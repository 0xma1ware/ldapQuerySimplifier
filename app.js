// --- LDAP PARSER, TRANSLATOR & VISUAL BUILDER ---
//
// Pure helpers (parseLDAP, astToHumanReadable, escaping) are defined at module
// scope so they can be unit-tested; the DOM wiring lives in the
// DOMContentLoaded handler at the bottom.

(function () {
    'use strict';

    const DATA = (typeof window !== 'undefined' && window.LDAPData) || {};
    const MATCHING_RULE_OIDS = DATA.MATCHING_RULE_OIDS || {};
    const RULE_ALIASES = DATA.RULE_ALIASES || {};
    const UAC_FLAGS = DATA.UAC_FLAGS || [];
    const UAC_ATTRIBUTES = DATA.UAC_ATTRIBUTES || [];
    const ESCAPE_MAP = DATA.ESCAPE_MAP || [];

    // --- VALUE ESCAPING (RFC 4515) ---

    // Escape the characters that are not allowed to appear literally inside a
    // filter value. Used by the builder for non-wildcard values.
    function escapeValue(value) {
        let out = value;
        for (const [ch, esc] of ESCAPE_MAP) {
            out = out.split(ch).join(esc);
        }
        return out;
    }

    // Escape everything except '*', so wildcard operators (contains/starts/ends)
    // keep their intentional asterisks while still neutralising (), \ and NUL.
    function escapeValueKeepWildcards(value) {
        let out = value;
        for (const [ch, esc] of ESCAPE_MAP) {
            if (ch === '*') continue;
            out = out.split(ch).join(esc);
        }
        return out;
    }

    // Turn hex escapes (\2a) back into readable characters for human output.
    function unescapeValue(value) {
        return value.replace(/\\([0-9a-fA-F]{2})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        );
    }

    // --- PARSER ---

    function parseLDAP(query) {
        query = query.trim();
        if (!query) return null;

        let pos = 0;

        function parseFilter() {
            skipWhitespace();
            if (pos >= query.length) return null;

            if (query[pos] !== '(') {
                throw new Error(`Expected '(' at position ${pos}`);
            }
            pos++; // Skip '('

            skipWhitespace();
            let filter;

            const char = query[pos];
            if (char === '&' || char === '|' || char === '!') {
                filter = parsePrefix(char);
            } else {
                filter = parseSimple();
            }

            skipWhitespace();
            if (pos >= query.length || query[pos] !== ')') {
                throw new Error(`Expected ')' at position ${pos}, found ${query[pos] || 'EOF'}`);
            }
            pos++; // Skip ')'

            return filter;
        }

        function parsePrefix(operator) {
            pos++; // Skip operator
            const filters = [];
            skipWhitespace();

            if (pos >= query.length || query[pos] === ')') {
                throw new Error(`Operator '${operator}' at position ${pos} has no child filter`);
            }

            if (query[pos] === '(') {
                // Standard form: one or more parenthesised child filters.
                while (pos < query.length && query[pos] === '(') {
                    filters.push(parseFilter());
                    skipWhitespace();
                }
            } else {
                // Lenient form used in some references, e.g. (!objectClass=group)
                // or (!homeDirectory=*) — a bare simple/extensible filter.
                filters.push(parseSimple());
                skipWhitespace();
            }

            if (operator === '!' && filters.length !== 1) {
                throw new Error(`NOT operator '!' must have exactly one child filter`);
            }

            return { type: 'group', operator, filters };
        }

        function parseSimple() {
            const startPos = pos;
            // Read the attribute description up to the comparison operator.
            // It may contain ':' segments for an extensible match
            // (attr:dn:rule:=value), so ':' is NOT a terminator here.
            let token = '';
            while (pos < query.length && !['=', '~', '>', '<', ')'].includes(query[pos])) {
                token += query[pos];
                pos++;
            }
            token = token.trim();

            if (pos >= query.length || query[pos] === ')') {
                throw new Error(`Invalid simple filter starting at ${startPos}`);
            }

            let operator = '';
            const opChar1 = query[pos];
            const opChar2 = query[pos + 1];

            if (opChar1 === '=') {
                operator = '=';
                pos++;
            } else if ((opChar1 === '~' || opChar1 === '>' || opChar1 === '<') && opChar2 === '=') {
                operator = opChar1 + '=';
                pos += 2;
            } else {
                throw new Error(`Unknown operator starting at ${pos}`);
            }

            let value = '';
            while (pos < query.length && query[pos] !== ')') {
                value += query[pos];
                pos++;
            }

            // Detect an extensible match: the attribute description carries ':'
            // segments, e.g. "userAccountControl:1.2.840.113556.1.4.803:".
            if (token.indexOf(':') !== -1) {
                if (operator !== '=') {
                    throw new Error(`Extensible match must use ':=' at position ${startPos}`);
                }
                const segments = token.split(':');
                const attribute = segments.shift().trim();
                let dnAttributes = false;
                let rule = null;
                for (const seg of segments) {
                    const s = seg.trim();
                    if (s === '') continue; // trailing colon before '='
                    if (s.toLowerCase() === 'dn') {
                        dnAttributes = true;
                    } else {
                        rule = s;
                    }
                }
                return {
                    type: 'extensible',
                    attribute,
                    dnAttributes,
                    rule,
                    value
                };
            }

            return { type: 'rule', attribute: token, operator, value };
        }

        function skipWhitespace() {
            while (pos < query.length && /\s/.test(query[pos])) {
                pos++;
            }
        }

        const ast = parseFilter();
        skipWhitespace();
        if (pos < query.length) {
            throw new Error(`Unexpected trailing characters starting at position ${pos}`);
        }

        return ast;
    }

    // --- TRANSLATION HELPERS ---

    // Decode a bitmask into named flags for a known bitmask attribute (UAC).
    function decodeFlags(attribute, rawValue) {
        if (!UAC_ATTRIBUTES.includes(String(attribute).toLowerCase())) return null;
        const num = Number(rawValue);
        if (!Number.isFinite(num) || num < 0) return null;
        const names = [];
        let covered = 0;
        for (const [bit, label] of UAC_FLAGS) {
            if ((num & bit) === bit && bit !== 0) {
                names.push(label);
                covered |= bit;
            }
        }
        // If bits were set that we don't recognise, note the leftover value.
        const remainder = num & ~covered;
        if (names.length === 0) return null;
        if (remainder) names.push(`0x${remainder.toString(16)}`);
        return names;
    }

    function extensibleToHuman(node) {
        const attr = node.attribute || '<DN>';
        const ruleInfo = node.rule ? MATCHING_RULE_OIDS[node.rule] : null;
        const value = unescapeValue(node.value);

        if (ruleInfo) {
            const flags = decodeFlags(node.attribute, node.value);
            if (flags) {
                const verb = ruleInfo.id === 'LDAP_MATCHING_RULE_BIT_OR'
                    ? 'has any of these flags'
                    : 'has all of these flags';
                return `${attr} ${verb}: ${flags.join(', ')}`;
            }
            let base = `${attr} ${ruleInfo.short} ${value}`;
            if (ruleInfo.id === 'LDAP_MATCHING_RULE_IN_CHAIN') {
                base = `${attr} matches ${value} (recursively, following nested membership)`;
            }
            return base + (node.dnAttributes ? ' [DN attributes]' : '');
        }

        // Unknown or absent matching rule — describe it generically.
        const rulePart = node.rule ? ` using matching rule ${node.rule}` : '';
        const dnPart = node.dnAttributes ? ' (DN attributes)' : '';
        return `${attr} extensibly matches ${value}${rulePart}${dnPart}`;
    }

    function astToHumanReadable(ast) {
        if (!ast) return '';

        if (ast.type === 'extensible') {
            return extensibleToHuman(ast);
        }

        if (ast.type === 'rule') {
            const rawVal = ast.value;
            const val = unescapeValue(rawVal);

            if (ast.operator === '=' && rawVal === '*') {
                return `${ast.attribute} is present`;
            } else if (ast.operator === '=' && rawVal.startsWith('*') && rawVal.endsWith('*') && rawVal.length > 2) {
                return `${ast.attribute} contains ${unescapeValue(rawVal.slice(1, -1))}`;
            } else if (ast.operator === '=' && rawVal.startsWith('*') && rawVal.length > 1) {
                return `${ast.attribute} ends with ${unescapeValue(rawVal.slice(1))}`;
            } else if (ast.operator === '=' && rawVal.endsWith('*') && rawVal.length > 1) {
                return `${ast.attribute} starts with ${unescapeValue(rawVal.slice(0, -1))}`;
            }

            let opHuman = ast.operator;
            switch (ast.operator) {
                case '=': opHuman = '='; break;
                case '~=': opHuman = '≈'; break;
                case '>=': opHuman = '>='; break;
                case '<=': opHuman = '<='; break;
            }

            return `${ast.attribute} ${opHuman} ${val}`;
        }

        if (ast.type === 'group') {
            if (ast.operator === '!') {
                return `NOT (${astToHumanReadable(ast.filters[0])})`;
            } else {
                if (ast.filters.length === 0) {
                    return ast.operator === '&' ? 'TRUE' : 'FALSE';
                }
                const joinWord = ast.operator === '&' ? ' AND ' : ' OR ';
                const childStrings = ast.filters.map(f => {
                    const str = astToHumanReadable(f);
                    // Parenthesise nested AND/OR groups to keep logic unambiguous.
                    if (f.type === 'group' && f.operator !== '!') {
                        return `(${str})`;
                    }
                    return str;
                });
                return childStrings.join(joinWord);
            }
        }
        return '';
    }

    // Expose pure helpers for potential testing / reuse.
    const api = {
        parseLDAP,
        astToHumanReadable,
        escapeValue,
        escapeValueKeepWildcards,
        unescapeValue
    };
    if (typeof window !== 'undefined') window.LDAPTool = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;

    // --- DOM WIRING ---

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        setupAttributeDatalist();
        setupTranslator();
        setupPresets();
        setupBuilder();
    });

    function copyToClipboard(text, btn) {
        if (!text) return;
        const done = () => {
            if (!btn) return;
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 1200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
            done();
        }
    }

    function setupAttributeDatalist() {
        const datalist = document.getElementById('attribute-list');
        if (!datalist || !DATA.COMMON_ATTRIBUTES) return;
        const frag = document.createDocumentFragment();
        for (const [display, friendly] of DATA.COMMON_ATTRIBUTES) {
            const opt = document.createElement('option');
            opt.value = display;
            opt.label = friendly;
            frag.appendChild(opt);
        }
        datalist.appendChild(frag);
    }

    function setupTranslator() {
        const translateBtn = document.getElementById('translate-btn');
        const ldapInput = document.getElementById('ldap-input');
        const humanOutput = document.getElementById('human-output');
        const errorMsg = document.getElementById('translator-error');
        const copyBtn = document.getElementById('copy-human-btn');
        if (!translateBtn || !ldapInput || !humanOutput) return;

        const translate = () => {
            const query = ldapInput.value;
            errorMsg.textContent = '';
            humanOutput.value = '';
            if (!query.trim()) return;
            try {
                const ast = parseLDAP(query);
                humanOutput.value = astToHumanReadable(ast);
            } catch (e) {
                errorMsg.textContent = `Error: ${e.message}`;
            }
        };

        translateBtn.addEventListener('click', translate);
        // Ctrl/Cmd+Enter translates straight from the textarea.
        ldapInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                translate();
            }
        });
        if (copyBtn) {
            copyBtn.addEventListener('click', () => copyToClipboard(humanOutput.value, copyBtn));
        }
    }

    function setupPresets() {
        const select = document.getElementById('preset-select');
        const ldapInput = document.getElementById('ldap-input');
        const translateBtn = document.getElementById('translate-btn');
        if (!select || !DATA.PRESETS) return;

        for (const preset of DATA.PRESETS) {
            const opt = document.createElement('option');
            opt.value = preset.query;
            opt.textContent = preset.label;
            select.appendChild(opt);
        }

        select.addEventListener('change', () => {
            if (!select.value) return;
            if (ldapInput) ldapInput.value = select.value;
            if (translateBtn) translateBtn.click();
            // Reset back to the placeholder so the same preset can be re-picked.
            select.selectedIndex = 0;
        });
    }

    function setupBuilder() {
        const builderRoot = document.getElementById('query-builder-root');
        const builderOutput = document.getElementById('builder-output');
        const copyBtn = document.getElementById('copy-builder-btn');
        const escapeToggle = document.getElementById('escape-toggle');
        if (!builderRoot || !builderOutput) return;

        const groupTemplate = document.getElementById('group-template').content;
        const ruleTemplate = document.getElementById('rule-template').content;

        createGroup(builderRoot, true);
        updateBuilderOutput();

        if (copyBtn) {
            copyBtn.addEventListener('click', () => copyToClipboard(builderOutput.value, copyBtn));
        }
        if (escapeToggle) {
            escapeToggle.addEventListener('change', updateBuilderOutput);
        }

        function escapingEnabled() {
            return !escapeToggle || escapeToggle.checked;
        }

        function createGroup(parentContainer, isRoot = false) {
            const groupClone = document.importNode(groupTemplate, true);
            const groupEl = groupClone.querySelector('.group-container');

            if (isRoot) {
                const rm = groupEl.querySelector('.remove-group-btn');
                if (rm) rm.remove();
                groupEl.classList.add('root-group');
            }

            const conditionSelect = groupEl.querySelector('.group-condition');
            const addRuleBtn = groupEl.querySelector('.add-rule-btn');
            const addGroupBtn = groupEl.querySelector('.add-group-btn');
            const removeGroupBtn = groupEl.querySelector('.remove-group-btn');
            const rulesContainer = groupEl.querySelector('.group-rules');

            conditionSelect.addEventListener('change', updateBuilderOutput);
            addRuleBtn.addEventListener('click', () => {
                createRule(rulesContainer);
                updateBuilderOutput();
            });
            addGroupBtn.addEventListener('click', () => {
                createGroup(rulesContainer);
                updateBuilderOutput();
            });
            if (removeGroupBtn) {
                removeGroupBtn.addEventListener('click', () => {
                    groupEl.remove();
                    updateBuilderOutput();
                });
            }

            parentContainer.appendChild(groupEl);

            if (isRoot) {
                createRule(rulesContainer);
            }
        }

        function createRule(parentContainer) {
            const ruleClone = document.importNode(ruleTemplate, true);
            const ruleEl = ruleClone.querySelector('.rule-container');

            const operatorSelect = ruleEl.querySelector('.rule-operator');
            const valueInput = ruleEl.querySelector('.rule-value');

            ruleEl.querySelector('.rule-field').addEventListener('input', updateBuilderOutput);
            operatorSelect.addEventListener('change', () => {
                // "present" needs no value.
                valueInput.disabled = operatorSelect.value === 'present';
                if (valueInput.disabled) valueInput.value = '';
                updateBuilderOutput();
            });
            valueInput.addEventListener('input', updateBuilderOutput);
            ruleEl.querySelector('.remove-rule-btn').addEventListener('click', () => {
                ruleEl.remove();
                updateBuilderOutput();
            });

            parentContainer.appendChild(ruleEl);
        }

        function buildRule(field, operator, rawValue) {
            const useEscape = escapingEnabled();
            const esc = (v) => (useEscape ? escapeValue(v) : v);
            const escW = (v) => (useEscape ? escapeValueKeepWildcards(v) : v);

            switch (operator) {
                case '=': return `(${field}=${esc(rawValue)})`;
                case '~=': return `(${field}~=${esc(rawValue)})`;
                case '>=': return `(${field}>=${esc(rawValue)})`;
                case '<=': return `(${field}<=${esc(rawValue)})`;
                case 'contains': return `(${field}=*${escW(rawValue)}*)`;
                case 'starts': return `(${field}=${escW(rawValue)}*)`;
                case 'ends': return `(${field}=*${escW(rawValue)})`;
                case 'present': return `(${field}=*)`;
                case 'bit_and':
                case 'bit_or':
                case 'in_chain': {
                    const oid = RULE_ALIASES[operator];
                    return `(${field}:${oid}:=${esc(rawValue)})`;
                }
                default: return '';
            }
        }

        function generateLDAPFromBuilder(groupEl) {
            const condition = groupEl.querySelector('.group-condition').value;
            const rulesContainer = groupEl.querySelector('.group-rules');
            const children = Array.from(rulesContainer.children);

            const childFilters = [];
            children.forEach(child => {
                if (child.classList.contains('group-container')) {
                    const childLdap = generateLDAPFromBuilder(child);
                    if (childLdap) childFilters.push(childLdap);
                } else if (child.classList.contains('rule-container')) {
                    const field = child.querySelector('.rule-field').value.trim();
                    const operator = child.querySelector('.rule-operator').value;
                    const value = child.querySelector('.rule-value').value.trim();
                    if (field) {
                        const ruleStr = buildRule(field, operator, value);
                        if (ruleStr) childFilters.push(ruleStr);
                    }
                }
            });

            if (childFilters.length === 0) return '';

            if (condition === '!') {
                // NOT takes exactly one child — wrap multiple children in an AND.
                return childFilters.length > 1
                    ? `(!(&${childFilters.join('')}))`
                    : `(!${childFilters[0]})`;
            }
            // AND / OR. A single child needs no wrapping operator.
            return childFilters.length === 1
                ? childFilters[0]
                : `(${condition}${childFilters.join('')})`;
        }

        function updateBuilderOutput() {
            const rootGroup = builderRoot.querySelector('.group-container');
            builderOutput.value = rootGroup ? generateLDAPFromBuilder(rootGroup) : '';
        }
    }
})();
