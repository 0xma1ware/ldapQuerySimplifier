/* AD CS ESC1-ESC17 catalog + enumeration command recipes.
   Reference data only — rendered into the page, never executed. Sourced from
   SpecterOps "Certified Pre-Owned", Certipy, Certify and the hacker recipes. */
(function (root) {
    'use strict';

    // ldapFilterable: 'yes' | 'partial' | 'no' — how much of the technique a plain
    // LDAP filter can decide. 'partial' means the template/value half is
    // LDAP-expressible but enroll/ACL/registry conditions are not.
    const ESC_CATALOG = [
        { id: 'ESC1', title: 'Enrollee-supplied subject on a client-auth template', ldapFilterable: 'partial',
          summary: 'A published template sets ENROLLEE_SUPPLIES_SUBJECT, allows client authentication, needs no manager approval and no RA signature, and a low-priv principal can enrol — so the requester names any principal (e.g. a DA) and authenticates as them.',
          enumeration: "Preset “AD CS ESC1” surfaces the template/EKU half; the decisive low-priv Enroll right lives in nTSecurityDescriptor and must be ACL-parsed (certipy find -vulnerable).",
          caveat: 'A filter hit is a candidate — enroll rights (right GUID 0e10c968-78fb-11d2-90d4-00c04f79dc55, or all-zeros) are not RFC 4515-expressible.' },
        { id: 'ESC2', title: 'Any-Purpose or no-EKU template', ldapFilterable: 'partial',
          summary: 'An enrollable template whose EKU is Any Purpose (2.5.29.37.0) or empty (SubCA-style) yields a cert usable for anything, including client auth; the no-EKU variant can sign further certs.',
          enumeration: 'Preset “AD CS ESC2”; confirm Enroll via the template DACL and CA publication. certipy find -vulnerable.',
          caveat: 'Default SubCA/CA/CrossCA templates match the no-EKU branch but are normally admin-only — the DACL + publication check removes them.' },
        { id: 'ESC3', title: 'Certificate Request Agent (enrollment agent) template', ldapFilterable: 'partial',
          summary: 'A template grants the Certificate Request Agent EKU (1.3.6.1.4.1.311.20.2.1) to low-priv users; they get an enrollment-agent cert and enrol “on behalf of” a privileged user against a second client-auth template.',
          enumeration: 'Preset “AD CS ESC3” finds the agent template (stage 1); a client-auth target template is stage 2. Both enroll rights need ACL parsing; CA agent restrictions are registry.',
          caveat: 'Two-template chain. Any-Purpose/empty-EKU templates also count as agent-capable.' },
        { id: 'ESC4', title: 'Vulnerable certificate-template access control', ldapFilterable: 'partial',
          summary: 'A non-admin owns, or holds WriteDacl/WriteOwner/GenericAll/GenericWrite/WriteProperty over, a template; they rewrite it into an ESC1, enrol, then revert.',
          enumeration: 'Preset “AD CS ESC4” returns every template’s nTSecurityDescriptor (request the SD_FLAGS control, DACL+Owner, not SACL). Decide by parsing the DACL. certipy find / BloodHound ADCSESC4.',
          caveat: 'Pure ACL — no value filter decides it. Owner implies DACL-write, so scanning only ACE masks misses ownership paths.' },
        { id: 'ESC5', title: 'Vulnerable PKI object access control', ldapFilterable: 'partial',
          summary: 'A non-admin holds dangerous write rights over surrounding PKI objects — the CA host account, the PKI containers, or NTAuthCertificates — enabling PKI takeover.',
          enumeration: 'Preset “AD CS ESC5” lists the PKI objects + nTSecurityDescriptor for ACL parsing. Certipy does not emit a dedicated ESC5 finding; use BloodHound / Certify enum-pkiobjects.',
          caveat: 'A dangerous ACE on a CA is ESC7, on a single template is ESC4 — ESC5 is the container/NTAuth/CA-host scope. The CA host account lives in the domain NC.' },
        { id: 'ESC6', title: 'EDITF_ATTRIBUTESUBJECTALTNAME2 (CA-wide user-specified SAN)', ldapFilterable: 'no',
          summary: 'The CA policy module lets any enrollee inject an arbitrary SAN into a cert from any template, turning any auth template into an ESC1.',
          enumeration: 'Not in LDAP — read the CA registry: certutil -config "<ca>" -getreg policy\\EditFlags, or certipy find (tests EditFlags & 0x40000).',
          caveat: 'EditFlags is CA policy-module registry state, never published to AD. Post-KB5014754 usually needs chaining with ESC9/ESC16.' },
        { id: 'ESC7', title: 'Vulnerable CA access control (ManageCA / Manage Certificates)', ldapFilterable: 'no',
          summary: 'A non-admin holds the ManageCA or Manage Certificates RPC right on the CA — e.g. enable EDITF_ATTRIBUTESUBJECTALTNAME2 or approve pending requests.',
          enumeration: 'Not the object DACL — the CA “Security” value read over RPC: certutil -config "<ca>" -getreg CA\\Security, or certipy ca.',
          caveat: 'The CA RPC security descriptor is distinct from the AD object DACL.' },
        { id: 'ESC8', title: 'NTLM relay to AD CS web enrollment', ldapFilterable: 'no',
          summary: 'The /certsrv/ web-enrollment endpoint accepts NTLM over HTTP (or HTTPS without channel binding); coerce a privileged machine and relay it to obtain a cert.',
          enumeration: 'LDAP only yields the CA host (dNSHostName). Confirm the endpoint with certipy find (reports Web Enrollment) or a GET to /certsrv/.',
          caveat: 'Endpoint/relay condition, not a directory attribute. Exploit = coerce (PetitPotam/PrinterBug) + ntlmrelayx.' },
        { id: 'ESC9', title: 'No security extension (CT_FLAG_NO_SECURITY_EXTENSION)', ldapFilterable: 'partial',
          summary: 'A client-auth template sets NO_SECURITY_EXTENSION (0x80000), so issued certs omit the SID extension, re-enabling weak UPN mapping; with GenericWrite over a victim UPN the attacker impersonates them.',
          enumeration: 'Preset “AD CS ESC9” matches the template half. Full exploit also needs DC StrongCertificateBindingEnforcement 0/1 (registry) and GenericWrite over a UPN (ACL). certipy find.',
          caveat: 'Template flag + EKU are filterable; the DC registry state and the UPN-write ACL are not.' },
        { id: 'ESC10', title: 'Weak certificate mapping on the DC', ldapFilterable: 'no',
          summary: 'DCs use weak Schannel/Kerberos cert mapping (CertificateMappingMethods UPN bit 0x4, or StrongCertificateBindingEnforcement 0/1), allowing UPN-based impersonation.',
          enumeration: 'LDAP only lists the DCs to inspect (preset “AD CS ESC10 (DC targets)”). The condition is per-DC registry.',
          caveat: 'Nothing in AD decides it. Hardened CertificateMappingMethods is 0x18.' },
        { id: 'ESC11', title: 'ICPR without RPC encryption (relay)', ldapFilterable: 'no',
          summary: 'The CA does not enforce RPC packet privacy on the ICertPassage (ICPR) interface, allowing NTLM relay to the CA RPC endpoint.',
          enumeration: 'Not in LDAP — read CA\\InterfaceFlags (certipy tests IF_ENFORCEENCRYPTICERTREQUEST = 0x200; its absence is vulnerable).',
          caveat: 'Exploit = coerce + ntlmrelayx -t rpc://<ca-host>.' },
        { id: 'ESC12', title: 'CA key on YubiHSM with static KSP auth key', ldapFilterable: 'no',
          summary: 'The CA private key is on a YubiHSM whose KSP auth key is held statically in the CA host registry; local admin on the CA host can forge certs.',
          enumeration: 'Host posture on the CA — no AD object or CA-config LDAP signal. Inspect the CA host directly.',
          caveat: 'Detection needs access to the CA host itself.' },
        { id: 'ESC13', title: 'Issuance policy linked to a privileged group (OID group link)', ldapFilterable: 'partial',
          summary: 'A template references an issuance-policy OID (msPKI-Certificate-Policy) whose OID object carries msDS-OIDToGroupLink to a group; authenticating with such a cert injects that group’s SID.',
          enumeration: 'Presets “AD CS ESC13 (template)” + “AD CS ESC13 (OID→group link)”. Join the template policy OID to the OID object’s group link. certipy find.',
          caveat: 'Both halves are LDAP-readable (strongly filterable), but the linked group must be universal/empty and Enroll is still ACL-only.' },
        { id: 'ESC14', title: 'Weak explicit certificate mapping (altSecurityIdentities)', ldapFilterable: 'partial',
          summary: 'A victim’s altSecurityIdentities uses a weak explicit mapping (X509:<S>subject or X509:<RFC822>email) an attacker can satisfy, or the attacker can write such a mapping onto a target.',
          enumeration: 'Preset “AD CS ESC14 (altSecurityIdentities)” (domain NC) lists principals with the attribute and returns the mapping string to classify.',
          caveat: 'Weak: X509:<S>… / X509:<RFC822>…; strong: X509:<I>…<SR>… and X509:<SKI>/<SHA1-PUKEY>. Abuse needs write access.' },
        { id: 'ESC15', title: 'EKUwu / application-policy injection (CVE-2024-49019)', ldapFilterable: 'partial',
          summary: 'A schema-v1 template with ENROLLEE_SUPPLIES_SUBJECT lets a requester inject arbitrary Application Policies into the CSR on an unpatched CA, escalating to ESC1/ESC3.',
          enumeration: 'Preset “AD CS ESC15” matches schema-v1 + ESS templates. The CA patch level (fixed 2024-11-12) is not an LDAP attribute.',
          caveat: 'On templates without enrollee-supplied SAN the injected policy may not persist — verify.' },
        { id: 'ESC16', title: 'CA-wide SID extension disabled (DisableExtensionList)', ldapFilterable: 'no',
          summary: 'The CA globally disables the SID security extension (OID 1.3.6.1.4.1.311.25.2 in policy\\DisableExtensionList), so every issued cert omits it — a CA-wide ESC9.',
          enumeration: 'Not in LDAP — read CA policy\\DisableExtensionList (certipy find matches the disabled OID).',
          caveat: 'Strictly worse than per-template ESC9; pairs with ESC6/ESC9-style impersonation.' },
        { id: 'ESC17', title: 'Enrollee-supplied subject on a server-auth template', ldapFilterable: 'partial',
          summary: 'ESC1 modeled for Server Authentication (1.3.6.1.5.5.7.3.1) or Any Purpose — enrollee-supplies-subject, no approval, no RA signature, low-priv Enroll. A recent Certipy addition.',
          enumeration: 'Preset “AD CS ESC17” matches the template half; Enroll still needs ACL parsing. certipy find.',
          caveat: 'Newer and less standardized; exploitability depends on what accepts the server-auth cert (e.g. LDAPS/Schannel).' },
    ];

    // Fixed enumeration/exploitation commands that do NOT consume the current
    // filter (so they are reference recipes, not generated from the builder).
    const RECIPES = [
        { group: 'Discovery', tool: 'ldapsearch (rootDSE)', example: "ldapsearch -x -H ldap://<dc-ip> -s base -b '' configurationNamingContext defaultNamingContext", note: 'Find the Configuration naming context (AD CS base) and the domain NC. Anonymous bind usually works.' },
        { group: 'AD CS', tool: 'certipy find', example: "certipy find -u <user>@<domain> -p '<password>' -dc-ip <dc-ip> -vulnerable -enabled -stdout", note: 'Enumerates ESC1–ESC16 incl. the ACL/registry halves LDAP cannot. -enabled = published templates only.' },
        { group: 'AD CS', tool: 'certipy req (ESC1)', example: "certipy req -u <user>@<domain> -p '<password>' -dc-ip <dc-ip> -ca <ca-name> -template <template> -upn administrator@<domain> -sid <target-sid>", note: 'Request a cert as a chosen principal. -sid is required on patched (KB5014754) DCs.' },
        { group: 'AD CS', tool: 'certipy auth', example: 'certipy auth -pfx administrator.pfx -dc-ip <dc-ip>', note: 'PKINIT with the issued PFX → TGT + NT hash.' },
        { group: 'AD CS', tool: 'Certify (on-host)', example: 'Certify.exe find /vulnerable', note: 'GhostPack on-host enumerator. ESC1 only: Certify.exe find /enrolleeSuppliesSubject.' },
        { group: 'AD CS', tool: 'ldap3 (read template DACL)', example: "from ldap3.protocol.microsoft import security_descriptor_control\\nctrl = security_descriptor_control(sdflags=0x05)  # owner+DACL", note: 'As a non-admin you must request DACL-only/owner+DACL or AD blanks nTSecurityDescriptor.' },
        { group: 'Kerberos', tool: 'GetUserSPNs (Kerberoast)', example: "GetUserSPNs.py <domain>/<user>:'<password>' -dc-ip <dc-ip> -request -outputfile kerb.hashes", note: 'Impacket. Hashcat mode 13100.' },
        { group: 'Kerberos', tool: 'GetNPUsers (AS-REP roast)', example: 'GetNPUsers.py <domain>/ -usersfile users.txt -no-pass -dc-ip <dc-ip> -format hashcat -outputfile asrep.txt', note: 'Impacket. Hashcat mode 18200.' },
        { group: 'Kerberos', tool: 'Rubeus (on-host)', example: 'Rubeus.exe kerberoast /rc4opsec /nowrap /outfile:kerb.hashes', note: '/rc4opsec targets accounts without AES to force crackable etype 23.' },
        { group: 'Collection', tool: 'bloodhound-python', example: 'bloodhound-python -u <user> -p <password> -d <domain> -dc <dc-fqdn> -ns <dc-ip> -c All --zip', note: 'Graph collector incl. ACLs and (with the right edition) AD CS.' },
        { group: 'Collection', tool: 'netexec (nxc) adcs module', example: "nxc ldap <dc-ip> -u <user> -p '<password>' -M adcs", note: 'Also --kerberoasting / --asreproast for roast targets.' },
        { group: 'Collection', tool: 'ldapdomaindump', example: "ldapdomaindump -u '<domain>\\\\<user>' -p '<password>' ldap://<dc-ip> -o loot/", note: 'Writes HTML + JSON + grepable files; parse the JSON for description/info secrets.' },
    ];

    const api = { ESC_CATALOG, RECIPES };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.ADCS_REFERENCE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
