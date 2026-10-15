/* UI wiring; all LDAP semantics live in ldap.js. No remote requests or storage. */
'use strict';
document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    const root = $('query-builder-root');
    const template = id => $(id).content.firstElementChild.cloneNode(true);
    const scopes = {
        Base: 'Base (0): examine only the object named by the search base. An OU base will not return its users; use Get-ADObject to query the OU itself.',
        OneLevel: 'OneLevel (1): search direct children of the base, excluding the base and all deeper descendants.',
        Subtree: 'Subtree (2): search the base and all descendants. Narrow the base to an OU when you can.'
    };
    let copyTimer;
    function status(message) {
        $('copy-status').textContent = message;
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => { $('copy-status').textContent = ''; }, 4500);
    }
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', async () => {
            const field = $(button.dataset.copy);
            if (!field.value) { status('Nothing to copy yet.'); return; }
            try {
                if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
                await navigator.clipboard.writeText(field.value);
                status('Copied to clipboard.');
            } catch {
                field.focus();
                field.select();
                try {
                    if (!document.execCommand('copy')) throw new Error('Copy denied');
                    status('Copied to clipboard.');
                } catch { status('Text selected. Press Ctrl+C or ⌘C to copy.'); }
            }
        });
    });

    function updateCommands() {
        $('scope-help').textContent = scopes[$('search-scope').value];
        $('powershell-output').value = '';
        $('ldapsearch-output').value = '';
        $('command-error').textContent = '';
        const filter = $($('command-source').value === 'builder' ? 'builder-output' : 'ldap-input').value;
        if (!filter.trim()) { $('command-error').textContent = 'A valid filter is needed to generate commands.'; return; }
        try {
            const result = LDAP.commands(filter, {
                base: $('search-base').value, scope: $('search-scope').value,
                server: $('server').value.trim(), properties: $('properties').value, cmdlet: $('cmdlet').value,
                auth: $('auth').value, bindUser: $('bind-user').value.trim()
            });
            $('powershell-output').value = result.powershell;
            $('ldapsearch-output').value = result.ldapsearch;
        } catch (error) { $('command-error').textContent = error.message; }
    }
    ['command-source', 'search-base', 'search-scope', 'server', 'properties', 'cmdlet', 'auth', 'bind-user'].forEach(id => {
        $(id).addEventListener('input', updateCommands);
        $(id).addEventListener('change', updateCommands);
    });

    function inspect() {
        $('translator-error').textContent = '';
        $('human-output').value = '';
        $('filter-notes').replaceChildren();
        $('filter-status').textContent = 'READY';
        try {
            const ast = LDAP.parseLDAP($('ldap-input').value);
            if (!ast) return null;
            $('human-output').value = LDAP.astToHumanReadable(ast);
            $('filter-status').textContent = 'VALID SYNTAX';
            LDAP.diagnostics(ast).forEach(note => {
                const li = document.createElement('li'); li.textContent = note; $('filter-notes').append(li);
            });
            return ast;
        } catch (error) {
            $('translator-error').textContent = error.message;
            $('filter-status').textContent = 'INVALID';
            return null;
        }
    }
    $('translate-btn').addEventListener('click', inspect);
    $('ldap-input').addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); inspect(); }
    });
    $('ldap-input').addEventListener('input', () => {
        $('human-output').value = '';
        $('filter-notes').replaceChildren();
        $('translator-error').textContent = '';
        $('filter-status').textContent = 'EDITED';
        updateCommands();
    });
    for (const [id, pretty] of [['format-btn', true], ['compact-btn', false]]) {
        $(id).addEventListener('click', () => {
            const ast = inspect();
            if (ast) { $('ldap-input').value = LDAP.serialize(ast, pretty); updateCommands(); }
        });
    }

    function syncGroup(group) {
        const header = group.firstElementChild;
        const isNot = header.querySelector('.group-condition').value === '!';
        const full = isNot && group.lastElementChild.children.length >= 1;
        header.querySelector('.add-rule-btn').disabled = full;
        header.querySelector('.add-group-btn').disabled = full;
    }
    function groupDepth(parent) {
        let depth = 0;
        for (let el = parent; el; el = el.parentElement) if (el.classList.contains('group-container')) depth++;
        return depth;
    }
    function canAdd(parent) {
        if (root.querySelectorAll('.group-container, .rule-container').length >= 500 || groupDepth(parent) >= 100) {
            status('Builder limit: 500 nodes and 100 nesting levels. Larger filters can still be inspected.'); return false;
        }
        return true;
    }
    function createGroup(parent, node = null, isRoot = false) {
        const group = template('group-template');
        const header = group.firstElementChild;
        const children = group.lastElementChild;
        const condition = header.querySelector('.group-condition');
        condition.value = node?.operator || '&';
        if (isRoot) { group.classList.add('root-group'); header.querySelector('.remove-group-btn').remove(); }
        else header.querySelector('.remove-group-btn').addEventListener('click', () => {
            group.remove(); syncGroup(parent.parentElement); updateBuilderOutput();
        });
        condition.addEventListener('change', () => { syncGroup(group); updateBuilderOutput(); });
        header.querySelector('.add-rule-btn').addEventListener('click', () => {
            if (!canAdd(children)) return;
            createRule(children); syncGroup(group); updateBuilderOutput();
        });
        header.querySelector('.add-group-btn').addEventListener('click', () => {
            if (!canAdd(children)) return;
            createGroup(children); syncGroup(group); updateBuilderOutput();
        });
        parent.append(group);
        if (node) node.filters.forEach(child => child.type === 'group' ? createGroup(children, child) : createRule(children, child));
        syncGroup(group);
        return group;
    }
    function createRule(parent, node = null) {
        const rule = template('rule-template');
        const field = rule.querySelector('.rule-field');
        const operator = rule.querySelector('.rule-operator');
        const value = rule.querySelector('.rule-value');
        const raw = rule.querySelector('.rule-raw');
        const oid = rule.querySelector('.rule-oid');
        const dn = rule.querySelector('.rule-dn');
        if (node) {
            field.value = node.attribute; operator.value = node.operator;
            // Text inputs strip literal newlines. Encode controls before assigning
            // so an imported assertion keeps the same bytes and meaning.
            value.value = node.value.replace(/[\x00-\x1f\x7f]/g, c => '\\' + c.charCodeAt(0).toString(16).padStart(2, '0'));
            raw.checked = true;
            oid.value = node.matchingRule || ''; dn.checked = Boolean(node.dnAttributes);
            if (node.operator === '=' && node.value === '*') { operator.value = 'present'; raw.checked = false; value.value = ''; }
        }
        function sync() {
            const presence = ['present', 'absent'].includes(operator.value);
            value.disabled = presence; raw.disabled = presence;
            rule.querySelector('.extensible-options').hidden = operator.value !== ':=';
            value.placeholder = raw.checked ? 'LDAP assertion (escaped)' : 'Literal value';
        }
        rule.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => { sync(); updateBuilderOutput(); });
            input.addEventListener('change', () => { sync(); updateBuilderOutput(); });
        });
        rule.querySelector('.remove-rule-btn').addEventListener('click', () => {
            rule.remove(); syncGroup(parent.parentElement); updateBuilderOutput();
        });
        sync(); parent.append(rule);
    }
    function readGroup(group) {
        const operator = group.firstElementChild.querySelector('.group-condition').value;
        const children = [...group.lastElementChild.children];
        if (!children.length) throw new Error('Every group needs at least one rule or group.');
        if (operator === '!' && children.length !== 1) throw new Error('NOT requires exactly one child. Put multiple rules in an AND or OR subgroup first.');
        return { type: 'group', operator, filters: children.map(child => {
            if (child.classList.contains('group-container')) return readGroup(child);
            return LDAP.buildRule({
                attribute: child.querySelector('.rule-field').value,
                operator: child.querySelector('.rule-operator').value,
                value: child.querySelector('.rule-value').value,
                matchingRule: child.querySelector('.rule-oid').value,
                dnAttributes: child.querySelector('.rule-dn').checked,
                raw: child.querySelector('.rule-raw').checked
            });
        }) };
    }
    function updateBuilderOutput() {
        $('builder-output').value = ''; $('builder-error').textContent = '';
        try {
            let ast = readGroup(root.firstElementChild);
            // The UI needs a root container even for a single imported assertion.
            if (ast.operator !== '!' && ast.filters.length === 1) ast = ast.filters[0];
            const filter = LDAP.serialize(ast);
            LDAP.parseLDAP(filter);
            $('builder-output').value = filter;
        } catch (error) { $('builder-error').textContent = error.message; }
        updateCommands();
    }
    function loadBuilder(ast) {
        let count = 0;
        const countNodes = node => { count++; if (node.type === 'group') node.filters.forEach(countNodes); };
        countNodes(ast);
        if (count > 499) throw new Error('This filter is too large for the visual builder (500 nodes). Use the filter input for translation and commands.');
        // Build off-screen before replacing the user's existing work.
        const fragment = document.createDocumentFragment();
        createGroup(fragment, ast.type === 'group' ? ast : { type: 'group', operator: '&', filters: [ast] }, true);
        root.replaceChildren(fragment);
        $('command-source').value = 'builder';
        updateBuilderOutput();
    }
    $('import-btn').addEventListener('click', () => {
        const ast = inspect();
        if (ast) {
            try { loadBuilder(ast); status('Filter loaded into the builder.'); }
            catch (error) { $('translator-error').textContent = error.message; }
        }
    });
    $('reset-builder').addEventListener('click', () => loadBuilder(LDAP.parseLDAP('(objectClass=*)')));
    $('inspect-builder').addEventListener('click', () => {
        if (!$('builder-output').value) { status('Complete the builder rules first.'); return; }
        $('ldap-input').value = $('builder-output').value; inspect(); $('translator-section').scrollIntoView();
    });

    function renderPresets() {
        const search = $('preset-search').value.toLowerCase();
        const filtered = AD_PRESETS.filter(p => `${p.name} ${p.category} ${p.note}`.toLowerCase().includes(search));
        $('preset-list').replaceChildren();
        filtered.forEach(preset => {
            const card = document.createElement('article'); card.className = 'preset';
            const title = document.createElement('div');
            const category = document.createElement('small'); category.textContent = preset.category;
            const heading = document.createElement('h3'); heading.textContent = preset.name;
            title.append(category, heading);
            const note = document.createElement('p'); note.className = 'hint'; note.textContent = preset.note;
            const button = document.createElement('button'); button.textContent = 'Load'; button.setAttribute('aria-label', `Load ${preset.name}`);
            button.addEventListener('click', () => {
                $('preset-error').textContent = '';
                try {
                    const dn = $('preset-dn').value;
                    if (preset.dn && !dn.trim()) throw new Error('Enter the target user or group DN above before loading this preset.');
                    const filter = preset.dn ? preset.filter(LDAP.escapeValue(dn)) : preset.filter;
                    const ast = LDAP.parseLDAP(filter);
                    loadBuilder(ast);
                    $('ldap-input').value = filter;
                    $('cmdlet').value = preset.cmdlet; $('properties').value = preset.properties;
                    inspect(); updateCommands(); status(`Loaded: ${preset.name}`);
                } catch (error) { $('preset-error').textContent = error.message; }
            });
            card.append(title, button, note); $('preset-list').append(card);
        });
        if (!filtered.length) $('preset-list').textContent = 'No presets match your search.';
    }
    $('preset-search').addEventListener('input', renderPresets);
    renderPresets();

    LDAP.FLAGS.forEach(([mask, name]) => {
        const label = document.createElement('label'); label.className = 'check';
        const input = document.createElement('input'); input.type = 'checkbox'; input.value = String(mask);
        input.addEventListener('change', () => {
            $('uac-mask').textContent = String(selectedMask()); $('uac-error').textContent = '';
        });
        label.append(input, document.createTextNode(`${name} (${mask})`)); $('uac-flags').append(label);
    });
    function selectedMask() { return [...$('uac-flags').querySelectorAll('input:checked')].reduce((mask, el) => mask | BigInt(el.value), 0n); }
    $('add-uac').addEventListener('click', () => {
        $('uac-error').textContent = '';
        const mask = selectedMask();
        if (!mask) { $('uac-error').textContent = 'Select at least one flag.'; return; }
        const group = root.firstElementChild;
        if (group.firstElementChild.querySelector('.group-condition').value === '!' && group.lastElementChild.children.length) {
            $('uac-error').textContent = 'The root NOT group already has its one child. Change its logic or add the rule inside a subgroup.'; return;
        }
        if (!canAdd(group.lastElementChild)) return;
        createRule(group.lastElementChild, LDAP.parseLDAP(`(userAccountControl:${LDAP.OIDS[$('uac-mode').value]}:=${mask})`));
        syncGroup(group); updateBuilderOutput();
    });

    const options = document.createDocumentFragment();
    AD_ATTRIBUTES.forEach(attr => {
        const option = document.createElement('option'); option.value = attr.name; option.label = attr.cn || attr.name; options.append(option);
    });
    $('attribute-options').append(options);
    $('attribute-count').textContent = `(${AD_ATTRIBUTES.length} entries)`;
    function renderAttributes() {
        const search = $('attribute-search').value.toLowerCase().trim();
        const matches = AD_ATTRIBUTES.filter(a => `${a.name} ${a.cn} ${a.oid}`.toLowerCase().includes(search));
        const fragment = document.createDocumentFragment();
        matches.slice(0, 100).forEach(attr => {
            const row = document.createElement('tr');
            [attr.name, attr.cn || '—', attr.oid].forEach(value => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); });
            fragment.append(row);
        });
        $('attribute-table').replaceChildren(fragment);
        $('attribute-results').textContent = `Showing ${Math.min(matches.length, 100)} of ${matches.length} matches${matches.length > 100 ? ' — refine your search to see more.' : '.'}`;
    }
    $('attribute-search').addEventListener('input', renderAttributes); renderAttributes();
    $('escape-input').addEventListener('input', () => {
        $('escape-output').value = ''; $('escape-error').textContent = '';
        try { $('escape-output').value = LDAP.escapeValue($('escape-input').value); }
        catch (error) { $('escape-error').textContent = error.message; }
    });
    loadBuilder(LDAP.parseLDAP('(objectClass=*)'));
});
