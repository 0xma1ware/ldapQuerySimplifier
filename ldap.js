/* Shared filter engine. Works in the browser and in Node without dependencies. */
(function (root) {
    'use strict';
    const oidPattern = '(?:[A-Za-z][A-Za-z0-9-]*|(?:0|[1-9][0-9]*)(?:\\.(?:0|[1-9][0-9]*))+)';
    const attributePattern = new RegExp(`^${oidPattern}(?:;[A-Za-z0-9-]+)*$`);
    const rulePattern = new RegExp(`^${oidPattern}$`);
    const OIDS = { and: '1.2.840.113556.1.4.803', or: '1.2.840.113556.1.4.804', chain: '1.2.840.113556.1.4.1941' };
    const FLAGS = [
        [1, 'SCRIPT'], [2, 'ACCOUNTDISABLE'], [8, 'HOMEDIR_REQUIRED'],
        [32, 'PASSWD_NOTREQD'], [128, 'ENCRYPTED_TEXT_PWD_ALLOWED'],
        [256, 'TEMP_DUPLICATE_ACCOUNT'], [512, 'NORMAL_ACCOUNT'],
        [2048, 'INTERDOMAIN_TRUST_ACCOUNT'], [4096, 'WORKSTATION_TRUST_ACCOUNT'],
        [8192, 'SERVER_TRUST_ACCOUNT'], [65536, 'DONT_EXPIRE_PASSWORD'],
        [131072, 'MNS_LOGON_ACCOUNT'], [262144, 'SMARTCARD_REQUIRED'],
        [524288, 'TRUSTED_FOR_DELEGATION'], [1048576, 'NOT_DELEGATED'],
        [2097152, 'USE_DES_KEY_ONLY'], [4194304, 'DONT_REQ_PREAUTH'],
        [16777216, 'TRUSTED_TO_AUTH_FOR_DELEGATION'], [67108864, 'PARTIAL_SECRETS_ACCOUNT']
    ];
    // groupType is a signed 32-bit bitfield; the high bit marks security groups.
    const GROUP_TYPE_FLAGS = [
        [0x00000001, 'BUILTIN_LOCAL_GROUP'], [0x00000002, 'ACCOUNT_GROUP (Global)'],
        [0x00000004, 'RESOURCE_GROUP (Domain Local)'], [0x00000008, 'UNIVERSAL_GROUP'],
        [0x00000010, 'APP_BASIC_GROUP'], [0x00000020, 'APP_QUERY_GROUP'],
        [0x80000000, 'SECURITY_ENABLED']
    ];
    // msDS-SupportedEncryptionTypes (MS-KILE 2.2.7).
    const ENC_TYPE_FLAGS = [
        [0x00000001, 'DES_CBC_CRC'], [0x00000002, 'DES_CBC_MD5'], [0x00000004, 'RC4_HMAC'],
        [0x00000008, 'AES128_CTS_HMAC_SHA1_96'], [0x00000010, 'AES256_CTS_HMAC_SHA1_96'],
        [0x00000020, 'FAST_SUPPORTED'], [0x00000040, 'COMPOUND_IDENTITY_SUPPORTED'],
        [0x00000080, 'CLAIMS_SUPPORTED'], [0x00000100, 'RESOURCE_SID_COMPRESSION_DISABLED']
    ];
    // trustAttributes (MS-ADTS 6.1.6.7.9).
    const TRUST_ATTR_FLAGS = [
        [0x00000001, 'NON_TRANSITIVE'], [0x00000002, 'UPLEVEL_ONLY'],
        [0x00000004, 'QUARANTINED_DOMAIN (SID filtering)'], [0x00000008, 'FOREST_TRANSITIVE'],
        [0x00000010, 'CROSS_ORGANIZATION'], [0x00000020, 'WITHIN_FOREST'],
        [0x00000040, 'TREAT_AS_EXTERNAL'], [0x00000080, 'USES_RC4_ENCRYPTION'],
        [0x00000200, 'CROSS_ORGANIZATION_NO_TGT_DELEGATION'], [0x00000400, 'PIM_TRUST'],
        [0x00000800, 'CROSS_ORGANIZATION_ENABLE_TGT_DELEGATION']
    ];
    // msPKI-Certificate-Name-Flag (MS-CRTD 2.27). The offensive-relevant bit is
    // ENROLLEE_SUPPLIES_SUBJECT (1): the requester chooses the subject/SAN.
    const CERT_NAME_FLAGS = [
        [0x00000001, 'ENROLLEE_SUPPLIES_SUBJECT'],
        [0x00000008, 'OLD_CERT_SUPPLIES_SUBJECT_AND_ALT_NAME'],
        [0x00010000, 'ENROLLEE_SUPPLIES_SUBJECT_ALT_NAME'],
        [0x00400000, 'SUBJECT_ALT_REQUIRE_DOMAIN_DNS'], [0x00800000, 'SUBJECT_ALT_REQUIRE_SPN'],
        [0x01000000, 'SUBJECT_ALT_REQUIRE_DIRECTORY_GUID'], [0x02000000, 'SUBJECT_ALT_REQUIRE_UPN'],
        [0x04000000, 'SUBJECT_ALT_REQUIRE_EMAIL'], [0x08000000, 'SUBJECT_ALT_REQUIRE_DNS'],
        [0x10000000, 'SUBJECT_REQUIRE_DNS_AS_CN'], [0x20000000, 'SUBJECT_REQUIRE_EMAIL'],
        [0x40000000, 'SUBJECT_REQUIRE_COMMON_NAME'], [0x80000000, 'SUBJECT_REQUIRE_DIRECTORY_PATH']
    ];
    // msPKI-Enrollment-Flag (MS-CRTD 2.26). PEND_ALL_REQUESTS (2) is manager
    // approval; NO_SECURITY_EXTENSION (0x80000) relates to ESC9.
    const ENROLLMENT_FLAGS = [
        [0x00000001, 'INCLUDE_SYMMETRIC_ALGORITHMS'], [0x00000002, 'PEND_ALL_REQUESTS (manager approval)'],
        [0x00000004, 'PUBLISH_TO_KRA_CONTAINER'], [0x00000008, 'PUBLISH_TO_DS'],
        [0x00000010, 'AUTO_ENROLLMENT_CHECK_USER_DS_CERTIFICATE'], [0x00000020, 'AUTO_ENROLLMENT'],
        [0x00000040, 'PREVIOUS_APPROVAL_VALIDATE_REENROLLMENT'], [0x00000100, 'USER_INTERACTION_REQUIRED'],
        [0x00000400, 'REMOVE_INVALID_CERTIFICATE_FROM_PERSONAL_STORE'], [0x00000800, 'ALLOW_ENROLL_ON_BEHALF_OF'],
        [0x00001000, 'ADD_OCSP_NOCHECK'], [0x00002000, 'ENABLE_KEY_REUSE_ON_NT_TOKEN_KEYSET_STORAGE_FULL'],
        [0x00004000, 'NOREVOCATIONINFOINISSUEDCERTS'], [0x00008000, 'INCLUDE_BASIC_CONSTRAINTS_FOR_EE_CERTS'],
        [0x00010000, 'ALLOW_PREVIOUS_APPROVAL_KEYBASEDRENEWAL_VALIDATE_REENROLLMENT'],
        [0x00020000, 'ISSUANCE_POLICIES_FROM_REQUEST'], [0x00040000, 'SKIP_AUTO_RENEWAL'],
        [0x00080000, 'NO_SECURITY_EXTENSION']
    ];
    // Attribute (lowercased) -> bitfield table, for decoding bitmask matches.
    const FLAG_TABLES = {
        useraccountcontrol: FLAGS,
        'msds-user-account-control-computed': FLAGS,
        grouptype: GROUP_TYPE_FLAGS,
        'msds-supportedencryptiontypes': ENC_TYPE_FLAGS,
        trustattributes: TRUST_ATTR_FLAGS,
        'mspki-certificate-name-flag': CERT_NAME_FLAGS,
        'mspki-enrollment-flag': ENROLLMENT_FLAGS
    };
    // Common Extended Key Usage / certificate OIDs, for readable explanations.
    const EKU_OIDS = {
        '1.3.6.1.5.5.7.3.1': 'Server Authentication',
        '1.3.6.1.5.5.7.3.2': 'Client Authentication',
        '1.3.6.1.5.5.7.3.3': 'Code Signing',
        '1.3.6.1.5.5.7.3.4': 'Secure Email',
        '1.3.6.1.5.5.7.3.8': 'Time Stamping',
        '1.3.6.1.5.5.7.3.9': 'OCSP Signing',
        '1.3.6.1.4.1.311.20.2.2': 'Smart Card Logon',
        '1.3.6.1.5.2.3.4': 'PKINIT Client Authentication',
        '1.3.6.1.4.1.311.20.2.1': 'Certificate Request Agent (Enrollment Agent)',
        '2.5.29.37.0': 'Any Purpose'
    };
    const EKU_ATTRS = ['pkiextendedkeyusage', 'extendedkeyusage', 'mspki-certificate-application-policy'];

    function parseLDAP(query) {
        if (typeof query !== 'string') throw new Error('Filter must be text.');
        if (!query.trim()) return null;
        if (query.length > 100000) throw new Error('Filter exceeds 100,000 characters.');
        let pos = 0;
        const fail = message => { throw new Error(`${message} at position ${pos + 1}.`); };
        const whitespace = () => { while (/\s/.test(query[pos] || '') && pos < query.length) pos++; };
        function filter(depth) {
            if (depth > 100) fail('Filter exceeds 100 nesting levels');
            whitespace();
            if (query[pos++] !== '(') fail("Expected '('");
            whitespace();
            let node;
            if (['&', '|', '!'].includes(query[pos])) {
                const operator = query[pos++];
                const filters = [];
                whitespace();
                while (query[pos] === '(') { filters.push(filter(depth + 1)); whitespace(); }
                if (!filters.length) fail('A group must contain a filter');
                if (operator === '!' && filters.length !== 1) fail('NOT must contain exactly one filter');
                node = { type: 'group', operator, filters };
            } else {
                const start = pos;
                while (pos < query.length && !['=', '~', '>', '<', '(', ')'].includes(query[pos])) pos++;
                let attribute = query.slice(start, pos);
                let operator = query[pos];
                let matchingRule = '', dnAttributes = false;
                if (operator === '=' && attribute.endsWith(':')) {
                    operator = ':=';
                    const parts = attribute.slice(0, -1).split(':');
                    attribute = parts.shift();
                    if (parts[0]?.toLowerCase() === 'dn') { dnAttributes = true; parts.shift(); }
                    if (parts.length) matchingRule = parts.shift();
                    if (parts.length || (!attribute && !matchingRule) || (matchingRule && !rulePattern.test(matchingRule))) fail('Invalid extensible match');
                    // Empty components such as cn::= are not valid matching rules.
                    if (query.slice(start, pos).includes('::')) fail('Empty matching rule');
                    pos++;
                } else if (operator === '=') pos++;
                else if (['~', '>', '<'].includes(operator) && query[pos + 1] === '=') { operator += '='; pos += 2; }
                else fail('Expected =, ~=, >=, <= or :=; bare > and < are not LDAP operators');
                if ((!attribute && operator !== ':=') || (attribute && !attributePattern.test(attribute))) fail('Invalid attribute name');
                const valueStart = pos;
                while (pos < query.length && query[pos] !== ')') {
                    const char = query[pos];
                    if (char === '\\') {
                        if (!/^[0-9a-f]{2}$/i.test(query.slice(pos + 1, pos + 3))) fail('Escape must be a backslash followed by two hexadecimal digits');
                        pos += 3;
                    } else {
                        if (char === '(' || char === '\0') fail('Escape literal parentheses and NUL');
                        if (char === '*' && operator !== '=') fail('Escape literal * as \\2a outside equality/substring filters');
                        const cp = query.codePointAt(pos);
                        if (cp >= 0xd800 && cp <= 0xdfff) fail('Unpaired Unicode surrogate');
                        pos += cp > 0xffff ? 2 : 1;
                    }
                }
                node = { type: 'rule', attribute, operator, value: query.slice(valueStart, pos) };
                if (operator === ':=') Object.assign(node, { matchingRule, dnAttributes });
            }
            if (query[pos] !== ')') fail("Expected ')'");
            pos++;
            return node;
        }
        const ast = filter(0);
        whitespace();
        if (pos !== query.length) fail('Unexpected trailing content; combine filters inside an AND or OR group');
        return ast;
    }

    function serialize(ast, pretty = false, depth = 0) {
        if (!ast) return '';
        if (ast.type === 'rule') {
            const lhs = ast.operator === ':='
                ? `${ast.attribute}${ast.dnAttributes ? ':dn' : ''}${ast.matchingRule ? ':' + ast.matchingRule : ''}:=`
                : ast.attribute + ast.operator;
            return `(${lhs}${ast.value})`;
        }
        if (!pretty) return `(${ast.operator}${ast.filters.map(f => serialize(f)).join('')})`;
        const pad = '  '.repeat(depth);
        return `(${ast.operator}\n${ast.filters.map(f => pad + '  ' + serialize(f, true, depth + 1)).join('\n')}\n${pad})`;
    }

    function escapeValue(value) {
        const escaped = { '*': '\\2a', '(': '\\28', ')': '\\29', '\\': '\\5c', '\0': '\\00' };
        for (const c of value) {
            const cp = c.codePointAt(0);
            if (cp >= 0xd800 && cp <= 0xdfff) throw new Error('Value contains an unpaired Unicode surrogate.');
        }
        return value.replace(/[\0()*\\]/g, c => escaped[c]);
    }

    // Invalid UTF-8/binary octets remain escaped; they must survive builder round trips.
    function decodeValue(value) {
        return value.replace(/(?:\\[0-9a-f]{2})+/gi, run => {
            const bytes = Uint8Array.from(run.match(/[0-9a-f]{2}/gi), h => parseInt(h, 16));
            try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
            catch { return run; }
        });
    }
    const display = value => JSON.stringify(decodeValue(value));
    function describeMask(attribute, value) {
        const text = decodeValue(value);
        const table = FLAG_TABLES[String(attribute).toLowerCase()];
        if (!table || !/^-?\d+$/.test(text)) return text;
        // groupType and similar are signed 32-bit; normalise to unsigned bits.
        const mask = BigInt.asUintN(32, BigInt(text));
        const names = table.filter(([n]) => (mask & BigInt(n)) !== 0n).map(([, name]) => name);
        return names.length ? `${text} (${names.join(', ')})` : text;
    }
    // Append a friendly EKU/OID name when the value is a recognised OID.
    function describeEku(attribute, value) {
        const text = decodeValue(value);
        if (!EKU_ATTRS.includes(String(attribute).toLowerCase())) return display(value);
        return EKU_OIDS[text] ? `${display(value)} (${EKU_OIDS[text]})` : display(value);
    }
    function astToHumanReadable(ast) {
        if (!ast) return '';
        if (ast.type === 'group') {
            if (ast.operator === '!') {
                const child = ast.filters[0];
                if (child.type === 'rule' && child.operator === '=' && child.value === '*') return `${child.attribute} is not present`;
                return `NOT (${astToHumanReadable(child)})`;
            }
            return ast.filters.map(f => f.type === 'group' ? `(${astToHumanReadable(f)})` : astToHumanReadable(f)).join(ast.operator === '&' ? ' AND ' : ' OR ');
        }
        const { attribute, operator, value, matchingRule, dnAttributes } = ast;
        const field = (attribute || 'any applicable attribute') + (dnAttributes ? ' (including DN attributes)' : '');
        if (operator === ':=') {
            if ([OIDS.and, OIDS.or].includes(matchingRule)) return `${field} has ${matchingRule === OIDS.and ? 'all' : 'any'} bits in ${describeMask(attribute, value)}`;
            if (matchingRule === OIDS.chain) return `${field} matches ${display(value)} through recursive DN links`;
            return `${field} matches ${display(value)} using ${matchingRule || 'its default matching rule'}`;
        }
        if (operator === '=') {
            if (value === '*') return `${field} is present`;
            const stars = (value.match(/\*/g) || []).length;
            if (stars === 2 && value.startsWith('*') && value.endsWith('*') && value.length > 2) return `${field} contains ${display(value.slice(1, -1))}`;
            if (stars === 1 && value.startsWith('*')) return `${field} ends with ${display(value.slice(1))}`;
            if (stars === 1 && value.endsWith('*')) return `${field} starts with ${display(value.slice(0, -1))}`;
            if (stars) return `${field} matches substring pattern ${value.split('*').map(display).join(' then any text then ')}`;
        }
        const shown = operator === '=' ? describeEku(attribute, value) : display(value);
        return `${field} ${{ '=': 'equals', '~=': 'approximately matches', '>=': 'is greater than or equal to', '<=': 'is less than or equal to' }[operator]} ${shown}`;
    }

    function buildRule({ attribute, operator, value = '', matchingRule = '', dnAttributes = false, raw = false }) {
        attribute = attribute.trim();
        let encoded = raw ? value : escapeValue(value);
        let ldap;
        if (['present', 'absent'].includes(operator)) ldap = `(${attribute}=*)`;
        else if (operator === 'contains') ldap = `(${attribute}=*${encoded}*)`;
        else if (operator === 'starts') ldap = `(${attribute}=${encoded}*)`;
        else if (operator === 'ends') ldap = `(${attribute}=*${encoded})`;
        else if (operator === ':=') ldap = `(${attribute}${dnAttributes ? ':dn' : ''}${matchingRule.trim() ? ':' + matchingRule.trim() : ''}:=${encoded})`;
        else ldap = `(${attribute}${operator === '!=' ? '=' : operator}${encoded})`;
        if (['!=', 'absent'].includes(operator)) ldap = `(!${ldap})`;
        return parseLDAP(ldap);
    }

    function diagnostics(ast) {
        const notes = new Set();
        const walk = (node, peopleOnly = false) => {
            if (node.type === 'group') {
                const constrained = peopleOnly || (node.operator === '&' && node.filters.some(child =>
                    child.type === 'rule' && child.attribute.toLowerCase() === 'objectcategory' &&
                    child.operator === '=' && child.value.toLowerCase() === 'person'));
                return node.filters.forEach(child => walk(child, constrained));
            }
            const name = node.attribute.toLowerCase();
            if (node.operator === '=' && node.value.startsWith('*') && node.value !== '*') notes.add('Leading wildcards can make searches expensive. Narrow the search base when possible.');
            if (node.matchingRule === OIDS.chain) notes.add('Recursive membership follows DN links; primary-group membership is not represented by member/memberOf.');
            if (node.operator === ':=' && [OIDS.and, OIDS.or].includes(node.matchingRule) && !/^-?\d+$/.test(decodeValue(node.value))) notes.add('AD bitwise matching expects a decimal integer, not a hexadecimal value or flag name.');
            if (name === 'admincount') notes.add('adminCount=1 can remain after protected-group membership ends; it does not prove current privileges.');
            if (name === 'useraccountcontrol' && [OIDS.and, OIDS.or].includes(node.matchingRule) && /^\d+$/.test(decodeValue(node.value)) && (BigInt(decodeValue(node.value)) & 32n)) notes.add('PASSWD_NOTREQD means a password is not required; it does not prove the account has a blank password.');
            if (!peopleOnly && name === 'objectclass' && node.operator === '=' && node.value.toLowerCase() === 'user') notes.add('objectClass=user also matches computers; use objectCategory=person to limit results to people.');
        };
        if (ast) walk(ast);
        return [...notes];
    }

    const psQuote = text => "'" + text.replace(/['\u2018\u2019\u201a\u201b]/g, c => c + c) + "'";
    const shQuote = text => "'" + text.replace(/'/g, "'\"'\"'") + "'";
    function commands(filter, { base, scope = 'Subtree', server = '', properties = 'sAMAccountName,distinguishedName', cmdlet = 'Get-ADObject', auth = 'gssapi', bindUser = '' }) {
        const ast = parseLDAP(filter);
        if (!ast) throw new Error('Enter a valid filter first.');
        if (!base.trim()) throw new Error('Enter a search base DN.');
        if (!['Base', 'OneLevel', 'Subtree'].includes(scope)) throw new Error('Invalid search scope.');
        if (!['Get-ADObject', 'Get-ADUser', 'Get-ADComputer', 'Get-ADGroup'].includes(cmdlet)) throw new Error('Invalid command.');
        if (!['gssapi', 'simple'].includes(auth)) throw new Error('Invalid authentication method.');
        if (/[\x00-\x1f\x7f]/.test(base + server + properties + bindUser + serialize(ast))) throw new Error('Command inputs cannot contain control characters. Use LDAP hex escapes in filter values.');
        if (server && !/^[A-Za-z0-9][A-Za-z0-9.-]*(?::\d{1,5})?$/.test(server)) throw new Error('Server must be a hostname or IP with an optional port (no URL scheme).');
        const attrs = properties.split(',').map(s => s.trim()).filter(Boolean);
        if (attrs.some(a => a !== '*' && !attributePattern.test(a))) throw new Error('Return attributes must be LDAP names separated by commas.');
        const compact = serialize(ast);
        const host = server || 'dc.example.com';
        const scopeFlag = { Base: 'base', OneLevel: 'one', Subtree: 'sub' }[scope];

        // PowerShell: GSSAPI uses the caller's Kerberos context; simple bind
        // prompts for credentials with Get-Credential (no secret on the line).
        const psCred = auth === 'simple'
            ? ` -AuthType Basic -Credential (Get-Credential${bindUser ? ' -UserName ' + psQuote(bindUser) : ''})`
            : '';
        const powershell = `${cmdlet} -LDAPFilter ${psQuote(compact)} -SearchBase ${psQuote(base)} -SearchScope ${scope}${server ? ' -Server ' + psQuote(server) : ''}${psCred}${attrs.length ? ' -Properties ' + attrs.map(psQuote).join(',') : ''}`;

        // ldapsearch: GSSAPI over LDAPS with an existing ticket, or a simple
        // bind over LDAP. -W prompts for the password instead of exposing it.
        const uri = auth === 'simple' ? 'ldap://' + host : 'ldaps://' + host;
        const authFlags = auth === 'simple'
            ? ` -x${bindUser ? ' -D ' + shQuote(bindUser) + ' -W' : ''}`
            : ' -Y GSSAPI';
        const ldapsearch = `ldapsearch -LLL -H ${shQuote(uri)}${authFlags} -b ${shQuote(base)} -s ${scopeFlag} -E pr=1000/noprompt ${shQuote(compact)}${attrs.length ? ' ' + attrs.map(shQuote).join(' ') : ''}`;

        // PowerView (SharpView): the red-team staple, no RSAT required. The
        // Get-AD* cmdlet maps to the matching Get-Domain* function.
        const pvVerb = { 'Get-ADObject': 'Get-DomainObject', 'Get-ADUser': 'Get-DomainUser', 'Get-ADComputer': 'Get-DomainComputer', 'Get-ADGroup': 'Get-DomainGroup' }[cmdlet];
        const pvCred = auth === 'simple'
            ? ` -Credential (Get-Credential${bindUser ? ' -UserName ' + psQuote(bindUser) : ''})`
            : '';
        const powerview = `${pvVerb} -LDAPFilter ${psQuote(compact)} -SearchBase ${psQuote(base)} -SearchScope ${scope}${server ? ' -Server ' + psQuote(server) : ''}${pvCred}${attrs.length ? ' -Properties ' + attrs.map(psQuote).join(',') : ''}`;

        // NetExec (nxc ldap): --query takes the filter and a space-separated
        // attribute list. Credentials are placeholders; -k uses a Kerberos
        // ticket, and a simple bind leaves the password as a prompt-style token.
        const nxcUser = bindUser || '<user>';
        const nxcCreds = auth === 'simple' ? `-u ${shQuote(nxcUser)} -p '<password>'` : `-u ${shQuote(nxcUser)} -k`;
        const nxcAttrs = attrs.filter(a => a !== '*').join(' ');
        const netexec = `nxc ldap ${shQuote(host)} ${nxcCreds} --base-dn ${shQuote(base)} --query ${shQuote(compact)} ${shQuote(nxcAttrs)}`;

        return { powershell, powerview, ldapsearch, netexec };
    }
    const api = { OIDS, FLAGS, GROUP_TYPE_FLAGS, ENC_TYPE_FLAGS, TRUST_ATTR_FLAGS, CERT_NAME_FLAGS, ENROLLMENT_FLAGS, FLAG_TABLES, EKU_OIDS, parseLDAP, serialize, escapeValue, decodeValue, astToHumanReadable, buildRule, diagnostics, commands };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.LDAP = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
