/* Run in the app's browser context (DevTools or Runtime.evaluate). */
async function runBrowserTests() {
    const $ = id => document.getElementById(id);
    const results = [];
    const check = (condition, message) => { if (!condition) throw new Error(message); results.push(message); };
    const input = (element, value, event = 'input') => { element.value = value; element.dispatchEvent(new Event(event, { bubbles: true })); };
    const load = filter => { input($('ldap-input'), filter); $('import-btn').click(); };
    const initial = $('builder-output').value;
    check(initial === '(objectClass=*)', 'App initializes with a valid filter');
    check($('powershell-output').value.includes('-LDAPFilter'), 'Commands initialize without a server connection');
    check($('attribute-options').children.length >= 681, 'Attribute autocomplete includes the full catalog');

    load(String.raw`(&(cn= A\2a*B )(member:dn:1.2.840.113556.1.4.1941:=CN=Alice,DC=example)(objectGUID=\ff\00))`);
    check($('translator-error').textContent === '', 'Complex imported filter validates');
    check($('builder-output').value === $('ldap-input').value, 'Builder import preserves escaped bytes, whitespace and extensible matches');
    check(document.querySelector('.extensible-options:not([hidden]) .rule-dn').checked, 'DN matching survives import');
    $('format-btn').click(); check($('ldap-input').value.includes('\n'), 'Formatting produces nested lines');
    $('compact-btn').click(); check(!$('ldap-input').value.includes('\n'), 'Compacting removes structural whitespace');

    load('(cn=first\nsecond)');
    check(LDAP.decodeValue(LDAP.parseLDAP($('builder-output').value).value) === 'first\nsecond', 'Import preserves literal control bytes as hex escapes');

    const before = $('builder-output').value;
    load('(cn=x)(sn=y)');
    check(Boolean($('translator-error').textContent), 'Invalid input displays an error');
    check($('builder-output').value === before, 'Invalid import preserves the existing builder');
    check(!$('human-output').value, 'Invalid input clears stale explanations');
    input($('command-source'), 'translator', 'change');
    check(!$('powershell-output').value && Boolean($('command-error').textContent), 'Invalid source clears command output');

    load('(cn=Alice)');
    const field = document.querySelector('.rule-value');
    document.querySelector('.rule-raw').click();
    input(field, '  A*)(|(objectClass=*))  ');
    check(LDAP.parseLDAP($('builder-output').value).type === 'rule', 'Literal user input cannot inject sibling filters');
    check(LDAP.decodeValue(LDAP.parseLDAP($('builder-output').value).value) === field.value, 'Literal builder input preserves leading/trailing spaces');
    input(document.querySelector('.rule-operator'), 'absent', 'change');
    check(field.disabled && $('builder-output').value === '(!(cn=*))', 'Absence operator disables values and emits NOT presence');

    $('reset-builder').click();
    document.querySelector('.add-rule-btn').click();
    check(!$('builder-output').value && Boolean($('builder-error').textContent), 'Incomplete rules are never silently dropped');
    check(!$('powershell-output').value, 'Incomplete builder clears commands');
    document.querySelectorAll('.remove-rule-btn')[1].click();
    check($('builder-output').value === '(objectClass=*)', 'Removing incomplete rule restores output');
    input(document.querySelector('.group-condition'), '!', 'change');
    check(document.querySelector('.add-rule-btn').disabled, 'NOT prevents adding a second child');
    check($('builder-output').value === '(!(objectClass=*))', 'NOT emits exactly one child');
    input(document.querySelector('.group-condition'), '&', 'change');
    document.querySelector('.add-rule-btn').click();
    input(document.querySelector('.group-condition'), '!', 'change');
    check($('builder-error').textContent.includes('exactly one'), 'Changing a multi-child group to NOT produces an explicit error');

    $('reset-builder').click();
    document.querySelector('.add-group-btn').click();
    check($('builder-error').textContent.includes('at least one'), 'Empty nested groups invalidate the builder');
    document.querySelector('.remove-group-btn').click();
    check($('builder-output').value === '(objectClass=*)', 'Removing empty nested group restores output');

    const presets = [...document.querySelectorAll('.preset button')];
    for (const button of presets) {
        input($('preset-dn'), "CN=O'Brien (Ops),DC=example,DC=com");
        button.click();
        check(!$('preset-error').textContent && !$('builder-error').textContent && Boolean($('powershell-output').value), button.getAttribute('aria-label') + ' produces a valid filter and command');
    }
    input($('preset-dn'), '');
    document.querySelector('[aria-label="Load A user\'s groups (recursive)"]').click();
    check($('preset-error').textContent.includes('Enter the target'), 'Membership preset requires a target DN');
    input($('preset-search'), 'nonsense-no-match');
    check($('preset-list').textContent.includes('No presets'), 'Preset search handles no results');
    input($('preset-search'), '');

    input($('attribute-search'), '1.2.840.113556.1.4.8');
    check($('attribute-table').textContent.includes('userAccountControl'), 'Attribute lookup searches OIDs');
    input($('attribute-search'), 'no-such-attribute');
    check($('attribute-table').children.length === 0, 'Attribute lookup handles no results');
    input($('attribute-search'), '');
    input($('escape-input'), '*()\\');
    check($('escape-output').value === String.raw`\2a\28\29\5c`, 'Escape helper handles all special visible characters');

    $('reset-builder').click();
    $('add-uac').click(); check(Boolean($('uac-error').textContent), 'UAC helper rejects an empty selection');
    document.querySelector('#uac-flags input[value="2"]').click();
    document.querySelector('#uac-flags input[value="32"]').click();
    check($('uac-mask').textContent === '34', 'UAC helper combines flag masks');
    input($('uac-mode'), 'or', 'change'); $('add-uac').click();
    check($('builder-output').value.includes('1.2.840.113556.1.4.804:=34'), 'UAC helper adds an OR-bit match');
    input($('search-scope'), 'OneLevel', 'change');
    check($('ldapsearch-output').value.includes('-s one'), 'Command context updates scope');
    input($('server'), 'bad;server'); check(!$('powershell-output').value, 'Malformed server clears commands');
    input($('server'), 'dc.example.com');
    input($('properties'), 'cn,description');
    check($('powershell-output').value.endsWith("-Properties 'cn','description'"), 'Return attribute changes update PowerShell');

    load('(cn=' + LDAP.escapeValue('<img src=x onerror=alert(1)>') + ')');
    check(!document.querySelector('img') && $('human-output').value.includes('<img'), 'Filter explanations render untrusted strings as text');

    // All four command outputs populate, and ADCS presets seed the config base.
    input($('command-source'), 'translator', 'change');
    input($('ldap-input'), '(objectCategory=computer)');
    input($('server'), 'dc.example.com');
    input($('cmdlet'), 'Get-ADComputer', 'change');
    $('translate-btn').click();
    check(Boolean($('powerview-output').value) && $('powerview-output').value.startsWith('Get-DomainComputer'), 'PowerView command generates for the current filter');
    check($('netexec-output').value.startsWith('nxc ldap '), 'NetExec command generates for the current filter');
    check($('windapsearch-output').value.startsWith('windapsearch.py'), 'windapsearch command generates for the current filter');
    input($('auth'), 'simple', 'change');
    check($('ldapsearch-output').value.includes('-x') && $('netexec-output').value.includes("-p '<password>'"), 'Simple bind flows through ldapsearch and NetExec');
    input($('auth'), 'gssapi', 'change');
    document.querySelector('[aria-label="Load AD CS ESC1: enrollee-supplies-subject + client-auth"]').click();
    check($('search-base').value.startsWith('CN=Configuration'), 'ADCS preset seeds the Configuration search base');
    check($('human-output').value.includes('ENROLLEE_SUPPLIES_SUBJECT'), 'ESC1 preset decodes the certificate name flag');
    check($('ldapsearch-output').value.includes("-J '1.2.840.113556.1.4.801"), 'nTSecurityDescriptor attribute adds the SD-flags control to ldapsearch');

    // ESC catalog + recipes render.
    check($('esc-catalog').children.length === 17, 'ESC catalog renders all 17 techniques');
    input($('esc-search'), 'ekuwu');
    check($('esc-catalog').children.length === 1 && $('esc-catalog').textContent.includes('ESC15'), 'ESC catalog search filters to a technique');
    input($('esc-search'), '');
    check($('recipe-list').querySelectorAll('.recipe').length >= 10, 'Command recipes render');
    check($('recipe-list').textContent.includes('certipy find'), 'certipy find recipe is present');

    document.querySelector('[aria-label="Load Disabled users"]').click();
    input($('search-scope'), 'Subtree', 'change');
    window.scrollTo(0, 0);
    return { passed: results.length, results };
}
