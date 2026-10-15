'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const L = require('../ldap');
const presets = require('../presets');
const attributes = require('../attributes');
const roundtrip = query => {
    const ast = L.parseLDAP(query);
    assert.deepEqual(L.parseLDAP(L.serialize(ast)), ast);
    assert.deepEqual(L.parseLDAP(L.serialize(ast, true)), ast);
    return ast;
};

test('RFC 4515 examples round trip, including extensible and binary assertions', () => {
    [
        '(cn=Babs Jensen)', '(!(cn=Tim Howes))', '(&(objectClass=Person)(|(sn=Jensen)(cn=Babs J*)))',
        '(o=univ*of*mich*)', '(seeAlso=)', '(cn:caseExactMatch:=Fred Flintstone)', '(cn:=Betty Rubble)',
        '(sn:dn:2.4.6.8.10:=Barney Rubble)', '(o:dn:=Ace Industry)', '(:1.2.3:=Wilma Flintstone)',
        '(:DN:2.4.6.8.10:=Dino)', String.raw`(o=Parens R Us \28for all your parenthetical needs\29)`,
        String.raw`(cn=*\2A*)`, String.raw`(filename=C:\5cMyFile)`, String.raw`(bin=\00\00\00\04)`,
        String.raw`(sn=Lu\c4\8di\c4\87)`, String.raw`(1.3.6.1.4.1.1466.0=\04\02\48\69)`,
        String.raw`(objectGUID=\ff\fe\00)`, '(cn;lang-en=Alice)', '(cn=مريم😀)'
    ].forEach(roundtrip);
});

test('empty input and structural whitespace; value whitespace is significant', () => {
    assert.equal(L.parseLDAP(' \n '), null);
    const ast = roundtrip(' \n (&\n(cn=  Alice  )\n(sn=Smith)\n) ');
    assert.equal(ast.filters[0].value, '  Alice  ');
    assert.equal(L.serialize(ast), '(&(cn=  Alice  )(sn=Smith))');
});

test('reject malformed groups, operators, names, escapes and trailing filters', () => {
    ['(&)', '(|)', '(!)', '(!(cn=a)(sn=b))', '(!cn=a)', '(cn=a', '(cn=a))', '(cn=a)(sn=b)',
        '(=value)', '(cn>1)', '(cn<1)', '(cn!=a)', '(cn=a(b))', '(cn=\0)', '(bad name=x)',
        '(cn :1.2.3:=x)', '(cn::=x)', '(:dn:=x)', '(:=x)', '(cn:1.2.3:dn:=x)',
        '(cn:1.2.3:other:=x)', '(cn:01.2:=x)', '(cn~=a*)', '(cn>=*)', '(cn:1.2.3:=*)',
        '(cn=\\)', '(cn=\\2)', '(cn=\\zz)', '(cn=\ud800)', '(cn=\udc00)'
    ].forEach(query => assert.throws(() => L.parseLDAP(query), undefined, query));
});

test('nesting and length limits fail with useful errors', () => {
    assert.throws(() => L.parseLDAP('(!'.repeat(102) + '(cn=a)' + ')'.repeat(102)), /nesting/);
    assert.throws(() => L.parseLDAP('(cn=' + 'a'.repeat(100000) + ')'), /100,000/);
});

test('all standard operators and multisegment wildcard explanations', () => {
    ['=', '~=', '>=', '<='].forEach(operator => roundtrip(`(cn${operator}Alice)`));
    assert.equal(L.astToHumanReadable(L.parseLDAP('(cn=*)')), 'cn is present');
    assert.equal(L.astToHumanReadable(L.parseLDAP('(!(cn=*))')), 'cn is not present');
    assert.match(L.astToHumanReadable(L.parseLDAP('(cn=*abc*)')), /contains "abc"/);
    assert.match(L.astToHumanReadable(L.parseLDAP('(cn=abc*)')), /starts with/);
    assert.match(L.astToHumanReadable(L.parseLDAP('(cn=*abc)')), /ends with/);
    assert.match(L.astToHumanReadable(L.parseLDAP('(cn=a*b*c*)')), /substring pattern/);
    assert.equal(L.astToHumanReadable(L.parseLDAP(String.raw`(cn=\2a)`)), 'cn equals "*"');
});

test('literal escaping prevents filter injection and preserves spaces and Unicode', () => {
    const value = '  A*)(|(objectClass=*))\\\0é😀  ';
    const ast = L.buildRule({ attribute: 'cn', operator: '=', value });
    assert.equal(ast.type, 'rule');
    assert.equal(L.decodeValue(ast.value), value);
    assert.equal(L.escapeValue('*()\\\0'), String.raw`\2a\28\29\5c\00`);
    assert.throws(() => L.escapeValue('\ud800'), /surrogate/);
});

test('builder operators produce valid filters with explicit wildcard semantics', () => {
    const expected = {
        '=': String.raw`(cn=a\2ab)`, '!=': String.raw`(!(cn=a\2ab))`,
        contains: String.raw`(cn=*a\2ab*)`, starts: String.raw`(cn=a\2ab*)`, ends: String.raw`(cn=*a\2ab)`,
        present: '(cn=*)', absent: '(!(cn=*))', '~=': String.raw`(cn~=a\2ab)`
    };
    for (const [operator, filter] of Object.entries(expected)) {
        assert.equal(L.serialize(L.buildRule({ attribute: 'cn', operator, value: 'a*b' })), filter);
    }
    assert.equal(L.serialize(L.buildRule({ attribute: 'cn', operator: '=', raw: true, value: String.raw`a*\2a*` })), String.raw`(cn=a*\2a*)`);
    assert.throws(() => L.buildRule({ attribute: 'cn', operator: '=', raw: true, value: '*)(sn=x)' }));
    assert.throws(() => L.buildRule({ attribute: 'cn)(sn', operator: '=', value: 'x' }));
});

test('all rule assertions survive import as raw values, including invalid UTF-8 octets', () => {
    [String.raw`(cn=a*\2a*)`, String.raw`(objectGUID=\ff\fe\00)`, '(cn= A )', '(cn=)', '(member:dn:1.2.840.113556.1.4.1941:=CN=Alice,DC=example)'].forEach(query => {
        const ast = L.parseLDAP(query);
        assert.equal(L.serialize(L.buildRule({ ...ast, raw: true })), query);
    });
    assert.equal(L.decodeValue(String.raw`Lu\c4\8di\c4\87`), 'Lučić');
    assert.equal(L.decodeValue(String.raw`\ff\fe`), String.raw`\ff\fe`);
});

test('bitwise and recursive matches are explained, with UAC flag names', () => {
    assert.match(L.astToHumanReadable(L.parseLDAP(`(userAccountControl:${L.OIDS.and}:=34)`)), /all bits in 34 \(ACCOUNTDISABLE, PASSWD_NOTREQD\)/);
    assert.match(L.astToHumanReadable(L.parseLDAP(`(groupType:${L.OIDS.or}:=2147483648)`)), /any bits/);
    assert.match(L.astToHumanReadable(L.parseLDAP(`(member:${L.OIDS.chain}:=CN=Alice,DC=example)`)), /recursive DN links/);
    assert.match(L.astToHumanReadable(L.parseLDAP('(:dn:caseExactMatch:=Alice)')), /any applicable attribute \(including DN attributes\)/);
});

test('diagnostics capture relevant AD semantics', () => {
    const notes = L.diagnostics(L.parseLDAP(`(&(objectClass=user)(adminCount=1)(userAccountControl:${L.OIDS.and}:=32)(cn=*a)(member:${L.OIDS.chain}:=CN=a))`)).join('\n');
    for (const word of ['computers', 'current privileges', 'blank password', 'expensive', 'primary-group']) assert.ok(notes.includes(word), word);
    assert.match(L.diagnostics(L.parseLDAP(`(userAccountControl:${L.OIDS.and}:=0x20)`))[0], /decimal integer/);
    assert.deepEqual(L.diagnostics(L.parseLDAP('(&(objectCategory=person)(objectClass=user))')), []);
    assert.ok(L.diagnostics(L.parseLDAP('(|(objectCategory=person)(objectClass=user))')).length);
});

test('all presets validate, scope users correctly, and generate commands', () => {
    assert.equal(presets.length, 26);
    for (const preset of presets) {
        const filter = preset.dn ? preset.filter(L.escapeValue('CN=Alice (Ops),DC=example,DC=com')) : preset.filter;
        roundtrip(filter);
        const output = L.commands(filter, { base: 'DC=example,DC=com', properties: preset.properties, cmdlet: preset.cmdlet });
        assert.ok(output.powershell.startsWith(preset.cmdlet));
        if (preset.cmdlet === 'Get-ADUser') assert.ok(filter.includes('(objectCategory=person)(objectClass=user)'));
    }
    const admin = presets.find(p => p.name.startsWith('Protected accounts'));
    assert.ok(L.parseLDAP(admin.filter).filters.some(f => f.attribute === 'adminCount'));
});

test('catalog is unique and valid, preserving the supplied table when available', () => {
    assert.ok(attributes.length >= 681);
    assert.equal(new Set(attributes.map(a => a.name.toLowerCase())).size, attributes.length);
    for (const attribute of attributes) {
        assert.equal(L.parseLDAP(`(${attribute.name}=*)`).attribute, attribute.name);
        assert.match(attribute.oid, /^\d+(\.\d+)+$/);
    }
    const promptPath = require('node:path').join(__dirname, '../prompt');
    if (!fs.existsSync(promptPath)) return; // The user's input is not a runtime or test dependency.
    const prompt = fs.readFileSync(promptPath, 'utf8');
    const rows = [...prompt.matchAll(/^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([0-9.]+)\s*\|/gm)];
    assert.equal(rows.length, 671);
    rows.forEach(([, name, cn, oid]) => assert.deepEqual(attributes.find(a => a.name === name), { name, cn, oid }));
});

test('command generators map all scopes, quote values and request selected properties', () => {
    for (const [scope, flag] of [['Base', 'base'], ['OneLevel', 'one'], ['Subtree', 'sub']]) {
        const output = L.commands("(cn=O'Brien $HOME `whoami`)", { base: "OU=O'Brien,DC=example", scope, server: 'dc.example.com', properties: 'cn,description' });
        assert.ok(output.powershell.includes("-LDAPFilter '(cn=O''Brien $HOME `whoami`)'"));
        assert.ok(output.powershell.includes("-SearchBase 'OU=O''Brien,DC=example'"));
        assert.ok(output.powershell.includes('-SearchScope ' + scope));
        assert.ok(output.powershell.endsWith("-Properties 'cn','description'"));
        assert.ok(output.ldapsearch.includes(`-s ${flag} -E pr=1000/noprompt`));
        assert.ok(output.ldapsearch.includes("'(cn=O'\"'\"'Brien $HOME `whoami`)'"));
    }
});

test('invalid inputs never produce commands', () => {
    assert.throws(() => L.commands('', { base: 'DC=example' }));
    assert.throws(() => L.commands('(cn=x)(sn=y)', { base: 'DC=example' }));
    for (const options of [{ base: '' }, { scope: 'invalid' }, { server: 'dc;whoami' }, { properties: 'cn;whoami()' }, { cmdlet: 'Remove-ADUser' }, { base: 'DC=x\nwhoami' }, { auth: 'ntlm' }, { auth: 'simple', bindUser: 'user\nwhoami' }]) {
        assert.throws(() => L.commands('(cn=x)', { base: 'DC=example', ...options }));
    }
    assert.throws(() => L.commands('(cn=a\nb)', { base: 'DC=example' }), /control/);
});

test('authentication modes shape ldapsearch and PowerShell without leaking secrets', () => {
    // Default is GSSAPI over LDAPS with an existing ticket.
    const gssapi = L.commands('(cn=x)', { base: 'DC=example,DC=com', server: 'dc.htb.local' });
    assert.ok(gssapi.ldapsearch.includes("-H 'ldaps://dc.htb.local' -Y GSSAPI"));
    assert.ok(!/-Credential/.test(gssapi.powershell));

    // Simple bind over LDAP, prompting for the password (-W / Get-Credential).
    const simple = L.commands('(cn=x)', {
        base: 'DC=example,DC=com', server: '10.10.10.5', auth: 'simple',
        bindUser: 'HTB\\\\jdoe', properties: 'sAMAccountName'
    });
    assert.ok(simple.ldapsearch.includes("-H 'ldap://10.10.10.5' -x -D 'HTB\\\\jdoe' -W"));
    assert.ok(/-AuthType Basic -Credential \(Get-Credential -UserName 'HTB\\\\jdoe'\)/.test(simple.powershell));
    // The password is never embedded in either command.
    assert.ok(!/-w\b/.test(simple.ldapsearch) && !/-Password/.test(simple.powershell));

    // Simple bind with no identity is an anonymous bind (-x only, no -D).
    const anon = L.commands('(cn=x)', { base: 'DC=example,DC=com', auth: 'simple' });
    assert.ok(/ -x -b /.test(anon.ldapsearch) && !anon.ldapsearch.includes('-D '));
});
