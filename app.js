// --- LDAP PARSER & TRANSLATOR ---

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

        if (operator === '!' && query[pos] !== '(') {
             throw new Error(`Expected '(' after '!' at position ${pos}`);
        }

        while (pos < query.length && query[pos] === '(') {
            filters.push(parseFilter());
            skipWhitespace();
        }

        if (operator === '!' && filters.length !== 1) {
            throw new Error(`NOT operator '!' must have exactly one child filter`);
        }
        if ((operator === '&' || operator === '|') && filters.length === 0) {
            throw new Error(`Operator '${operator}' must have at least one child filter`);
        }

        return { type: 'group', operator, filters };
    }

    function parseSimple() {
        const startPos = pos;
        let attribute = '';
        while (pos < query.length && !['=', '~', '>', '<', ')'].includes(query[pos])) {
            attribute += query[pos];
            pos++;
        }
        attribute = attribute.trim();

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

        return { type: 'rule', attribute, operator, value };
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

function astToHumanReadable(ast) {
    if (!ast) return '';

    if (ast.type === 'rule') {
        let opHuman = ast.operator;
        let val = ast.value;

        if (ast.operator === '=' && val === '*') {
            return `${ast.attribute} is present`;
        } else if (ast.operator === '=' && val.startsWith('*') && val.endsWith('*') && val.length > 2) {
            return `${ast.attribute} contains ${val.slice(1, -1)}`;
        } else if (ast.operator === '=' && val.startsWith('*') && val.length > 1) {
            return `${ast.attribute} ends with ${val.slice(1)}`;
        } else if (ast.operator === '=' && val.endsWith('*') && val.length > 1) {
            return `${ast.attribute} starts with ${val.slice(0, -1)}`;
        }

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
            let joinWord = ast.operator === '&' ? ' AND ' : ' OR ';
            const childStrings = ast.filters.map(f => {
                const str = astToHumanReadable(f);
                // add parens if child is a group (and not a NOT) to maintain logic clarity
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

// Attach event listeners for translator
document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translate-btn');
    const ldapInput = document.getElementById('ldap-input');
    const humanOutput = document.getElementById('human-output');
    const errorMsg = document.getElementById('translator-error');

    translateBtn.addEventListener('click', () => {
        const query = ldapInput.value;
        errorMsg.textContent = '';
        humanOutput.value = '';
        if (!query) return;

        try {
            const ast = parseLDAP(query);
            humanOutput.value = astToHumanReadable(ast);
        } catch (e) {
            errorMsg.textContent = `Error: ${e.message}`;
        }
    });
});

// --- VISUAL QUERY BUILDER ---

document.addEventListener('DOMContentLoaded', () => {
    const builderRoot = document.getElementById('query-builder-root');
    const builderOutput = document.getElementById('builder-output');

    const groupTemplate = document.getElementById('group-template').content;
    const ruleTemplate = document.getElementById('rule-template').content;

    // Initialize root group
    createGroup(builderRoot, true);
    updateBuilderOutput();

    function createGroup(parentContainer, isRoot = false) {
        const groupClone = document.importNode(groupTemplate, true);
        const groupEl = groupClone.querySelector('.group-container');

        if (isRoot) {
            groupEl.querySelector('.remove-group-btn').remove();
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

        // Add one empty rule to start
        if (isRoot) {
            createRule(rulesContainer);
        }
    }

    function createRule(parentContainer) {
        const ruleClone = document.importNode(ruleTemplate, true);
        const ruleEl = ruleClone.querySelector('.rule-container');

        const fieldInput = ruleEl.querySelector('.rule-field');
        const operatorSelect = ruleEl.querySelector('.rule-operator');
        const valueInput = ruleEl.querySelector('.rule-value');
        const removeRuleBtn = ruleEl.querySelector('.remove-rule-btn');

        fieldInput.addEventListener('input', updateBuilderOutput);
        operatorSelect.addEventListener('change', () => {
            if (operatorSelect.value === 'present') {
                valueInput.disabled = true;
                valueInput.value = '';
            } else {
                valueInput.disabled = false;
            }
            updateBuilderOutput();
        });
        valueInput.addEventListener('input', updateBuilderOutput);

        removeRuleBtn.addEventListener('click', () => {
            ruleEl.remove();
            updateBuilderOutput();
        });

        parentContainer.appendChild(ruleEl);
    }

    function generateLDAPFromBuilder(groupEl) {
        const condition = groupEl.querySelector('.group-condition').value;
        const rulesContainer = groupEl.querySelector('.group-rules');
        const children = Array.from(rulesContainer.children);

        let childFilters = [];

        children.forEach(child => {
            if (child.classList.contains('group-container')) {
                const childLdap = generateLDAPFromBuilder(child);
                if (childLdap) childFilters.push(childLdap);
            } else if (child.classList.contains('rule-container')) {
                const field = child.querySelector('.rule-field').value.trim();
                const operator = child.querySelector('.rule-operator').value;
                const value = child.querySelector('.rule-value').value.trim();

                if (field) {
                    let ruleStr = '';
                    if (operator === '=') {
                        ruleStr = `(${field}=${value})`;
                    } else if (operator === '~=') {
                        ruleStr = `(${field}~=${value})`;
                    } else if (operator === '>=') {
                        ruleStr = `(${field}>=${value})`;
                    } else if (operator === '<=') {
                        ruleStr = `(${field}<=${value})`;
                    } else if (operator === 'contains') {
                        ruleStr = `(${field}=*${value}*)`;
                    } else if (operator === 'starts') {
                        ruleStr = `(${field}=${value}*)`;
                    } else if (operator === 'ends') {
                        ruleStr = `(${field}=*${value})`;
                    } else if (operator === 'present') {
                        ruleStr = `(${field}=*)`;
                    }
                    childFilters.push(ruleStr);
                }
            }
        });

        if (childFilters.length === 0) return '';

        if (condition === '!') {
            // NOT applies to the first valid child filter only in UI logic (or wrap them all in AND then NOT)
            // Let's wrap all children in an AND if there are multiple, since NOT takes exactly one filter
            if (childFilters.length > 1) {
                return `(!(&${childFilters.join('')}))`;
            } else {
                return `(!${childFilters[0]})`;
            }
        } else {
            // AND / OR
            if (childFilters.length === 1) {
                // If only one child, we can just return it, though (&(cn=foo)) is also valid
                return childFilters[0];
            } else {
                return `(${condition}${childFilters.join('')})`;
            }
        }
    }

    function updateBuilderOutput() {
        const rootGroup = builderRoot.querySelector('.group-container');
        if (rootGroup) {
            const ldap = generateLDAPFromBuilder(rootGroup);
            builderOutput.value = ldap;
        } else {
            builderOutput.value = '';
        }
    }
});
