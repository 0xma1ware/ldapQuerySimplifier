# LDAP Query Tool · AD Workbench

A zero-build, fully-offline web workbench for reading, building and operationalising
RFC 4515 LDAP filters against Active Directory. Aimed at system administration and
authorised red-team / HTB-style AD enumeration: understand a filter, build one
visually, then take a ready-to-run `ldapsearch` / PowerShell command to your terminal.

No dependencies, no build step, no network calls, and no query history is stored —
open `index.html` in a browser and everything runs locally.

## Features

### 1 · Inspect a filter
- Parses standard RFC 4515 filters (`&`, `|`, `!`, `=`, `~=`, `>=`, `<=`, substrings/wildcards)
  with strict validation, helpful position-aware errors, and nesting/length limits.
- Handles **extensible matching rules**, including bitwise AND (`1.2.840.113556.1.4.803`),
  bitwise OR (`1.2.840.113556.1.4.804`) and recursive "in chain" DN matching
  (`1.2.840.113556.1.4.1941`), plus optional `:dn` DN-attribute matching.
- **Decodes `userAccountControl` bitmasks into named flags** (e.g. `...:=2` → `ACCOUNTDISABLE`).
- Decodes hex-escaped values (`\2a`, multi-byte UTF-8, etc.) into readable text.
- **Diagnostics**: contextual notes that flag common AD gotchas — `objectClass=user`
  also matches computers, `adminCount=1` can be stale, `PASSWD_NOTREQD` ≠ blank password,
  leading-wildcard cost, recursive membership not covering primary groups, and more.
- **Format** (pretty-print) and **Compact** buttons; **Load into builder** for round-tripping.

### 2 · Enumeration presets
- A searchable, categorised library of well-known AD queries: disabled/enabled users,
  password-not-required, never-expiring passwords, **Kerberoastable** (SPN) and
  **AS-REP roastable** accounts, **unconstrained / constrained / resource-based delegation**,
  recursive group membership (with a target-DN parameter), **LAPS** and **gMSA** objects,
  **SID history**, protected (`adminCount=1`) accounts, must-change-password accounts,
  domain controllers, domain trusts and legacy/unsupported operating systems.
- Loading a preset fills the filter, the builder, the return attributes and the AD cmdlet,
  and carries an accurate operational note.

### 3 · Visual query builder
- Infinitely nestable AND / OR / NOT groups and rules, with node/depth limits.
- Operators for equality, inequality, approximate, range, substrings, presence/absence
  and extensible (OID) matches.
- Values are **literal and auto-escaped** (`*`, `(`, `)`, `\`, NUL) to prevent filter
  injection, with an explicit "LDAP syntax" toggle for already-escaped assertions.
- Attribute-name autocomplete, and a **userAccountControl bitmask composer**.

### 4 · Search context & commands
- Generates ready-to-run **PowerShell** (`Get-ADObject/User/Computer/Group`) and
  **`ldapsearch`** commands from the current filter, with injection-safe quoting.
- Configurable search base, **search scope** (Base / OneLevel / Subtree), domain
  controller (hostname or IP) and return attributes.
- **Authentication modes for HTB/engagements**: Kerberos (GSSAPI over LDAPS, using your
  existing ticket) or **simple bind** (over LDAP with a bind identity). Passwords are
  never placed on the command line — `ldapsearch -W` and `Get-Credential` prompt for them.
- Paged results (`pr=1000`) by default. Commands are generated locally; the tool never
  connects to AD.

### 5 · Reference
- Searchable catalog of 680+ AD attributes (LDAP name, CN, attribute OID).
- Filter-syntax and matching-rule cheat sheet, and a standalone value-escaping helper.

## Tech Stack
Plain HTML, CSS and dependency-free JavaScript. The LDAP engine (`ldap.js`) runs in both
the browser and Node, so the logic is unit-tested.

## Tests
```bash
node --test            # ldap.js engine, presets, catalog and command generation
```
A browser-side suite (`tests/browser.js`) exercises the full UI; paste it into the page's
DevTools console, or drive it with a headless browser, and call `runBrowserTests()`.

## Preview

![LDAP Query Tool UI](assets/ui_screenshot.png)
