// --- LDAP REFERENCE DATA ---
// Shared constants used by the translator, the visual builder and the UI.
// Kept framework-free so it can be loaded as a plain <script> before app.js.

(function (global) {
    'use strict';

    // Matching-rule OIDs (RFC 4515 extensible match).
    // Maps the numeric OID to a short identifier + a human-readable meaning.
    const MATCHING_RULE_OIDS = {
        '1.2.840.113556.1.4.803': {
            id: 'LDAP_MATCHING_RULE_BIT_AND',
            short: 'bitwise AND',
            describe: 'all of these bits are set'
        },
        '1.2.840.113556.1.4.804': {
            id: 'LDAP_MATCHING_RULE_BIT_OR',
            short: 'bitwise OR',
            describe: 'any of these bits are set'
        },
        '1.2.840.113556.1.4.1941': {
            id: 'LDAP_MATCHING_RULE_IN_CHAIN',
            short: 'in chain',
            describe: 'matches recursively up the chain of ancestry'
        }
    };

    // Friendly identifiers people type instead of the raw OID in the builder.
    const RULE_ALIASES = {
        'bit_and': '1.2.840.113556.1.4.803',
        'bitand': '1.2.840.113556.1.4.803',
        'bit_or': '1.2.840.113556.1.4.804',
        'bitor': '1.2.840.113556.1.4.804',
        'in_chain': '1.2.840.113556.1.4.1941',
        'inchain': '1.2.840.113556.1.4.1941',
        'recursive': '1.2.840.113556.1.4.1941'
    };

    // userAccountControl bit flags. Decoded when a bitwise filter targets UAC.
    const UAC_FLAGS = [
        [0x00000001, 'SCRIPT'],
        [0x00000002, 'ACCOUNTDISABLE'],
        [0x00000008, 'HOMEDIR_REQUIRED'],
        [0x00000010, 'LOCKOUT'],
        [0x00000020, 'PASSWD_NOTREQD'],
        [0x00000040, 'PASSWD_CANT_CHANGE'],
        [0x00000080, 'ENCRYPTED_TEXT_PWD_ALLOWED'],
        [0x00000100, 'TEMP_DUPLICATE_ACCOUNT'],
        [0x00000200, 'NORMAL_ACCOUNT'],
        [0x00000800, 'INTERDOMAIN_TRUST_ACCOUNT'],
        [0x00001000, 'WORKSTATION_TRUST_ACCOUNT'],
        [0x00002000, 'SERVER_TRUST_ACCOUNT'],
        [0x00010000, 'DONT_EXPIRE_PASSWORD'],
        [0x00020000, 'MNS_LOGON_ACCOUNT'],
        [0x00040000, 'SMARTCARD_REQUIRED'],
        [0x00080000, 'TRUSTED_FOR_DELEGATION'],
        [0x00100000, 'NOT_DELEGATED'],
        [0x00200000, 'USE_DES_KEY_ONLY'],
        [0x00400000, 'DONT_REQ_PREAUTH'],
        [0x00800000, 'PASSWORD_EXPIRED'],
        [0x01000000, 'TRUSTED_TO_AUTH_FOR_DELEGATION'],
        [0x04000000, 'PARTIAL_SECRETS_ACCOUNT']
    ];

    // Attributes that carry a userAccountControl-style bitmask, so a bitwise
    // match against them can be flag-decoded.
    const UAC_ATTRIBUTES = ['useraccountcontrol', 'msds-user-account-control-computed'];

    // Curated list of commonly used AD / LDAP attributes for autocomplete.
    // [lDAPDisplayName, friendly Common-Name]. Not exhaustive by design — it
    // covers the attributes used day to day for administration and enumeration.
    const COMMON_ATTRIBUTES = [
        ['objectClass', 'Object-Class'],
        ['objectCategory', 'Object-Category'],
        ['objectSid', 'Object-Sid'],
        ['objectGUID', 'Object-Guid'],
        ['cn', 'Common-Name'],
        ['name', 'RDN'],
        ['distinguishedName', 'Obj-Dist-Name'],
        ['sAMAccountName', 'SAM-Account-Name'],
        ['sAMAccountType', 'SAM-Account-Type'],
        ['userPrincipalName', 'User-Principal-Name'],
        ['displayName', 'Display-Name'],
        ['givenName', 'Given-Name'],
        ['sn', 'Surname'],
        ['initials', 'Initials'],
        ['description', 'Description'],
        ['info', 'Comment'],
        ['department', 'Department'],
        ['title', 'Title'],
        ['company', 'Company'],
        ['mail', 'E-mail-Addresses'],
        ['telephoneNumber', 'Telephone-Number'],
        ['memberOf', 'Is-Member-Of-DL'],
        ['member', 'Member'],
        ['manager', 'Manager'],
        ['managedBy', 'Managed-By'],
        ['directReports', 'Reports'],
        ['primaryGroupID', 'Primary-Group-ID'],
        ['groupType', 'Group-Type'],
        ['userAccountControl', 'User-Account-Control'],
        ['servicePrincipalName', 'SPN'],
        ['adminCount', 'Admin-Count'],
        ['accountExpires', 'Account-Expires'],
        ['pwdLastSet', 'Pwd-Last-Set'],
        ['badPwdCount', 'Bad-Pwd-Count'],
        ['badPasswordTime', 'Bad-Password-Time'],
        ['lockoutTime', 'Lockout-Time'],
        ['lastLogon', 'Last-Logon'],
        ['lastLogonTimestamp', 'Last-Logon-Timestamp'],
        ['logonCount', 'Logon-Count'],
        ['whenCreated', 'When-Created'],
        ['whenChanged', 'When-Changed'],
        ['operatingSystem', 'Operating-System'],
        ['operatingSystemVersion', 'Operating-System-Version'],
        ['dNSHostName', 'DNS-Host-Name'],
        ['homeDirectory', 'Home-Directory'],
        ['homeDrive', 'Home-Drive'],
        ['profilePath', 'Profile-Path'],
        ['scriptPath', 'Script-Path'],
        ['employeeID', 'Employee-ID'],
        ['employeeNumber', 'Employee-Number'],
        ['employeeType', 'Employee-Type'],
        ['physicalDeliveryOfficeName', 'Physical-Delivery-Office-Name'],
        ['l', 'Locality-Name'],
        ['st', 'State-Or-Province-Name'],
        ['c', 'Country-Name'],
        ['co', 'Text-Country'],
        ['o', 'Organization-Name'],
        ['ou', 'Organizational-Unit-Name'],
        ['dc', 'Domain-Component'],
        ['maxStorage', 'Max-Storage'],
        ['instanceType', 'Instance-Type'],
        ['ntSecurityDescriptor', 'NT-Security-Descriptor'],
        ['msDS-AllowedToDelegateTo', 'ms-DS-Allowed-To-Delegate-To'],
        ['msDS-AllowedToActOnBehalfOfOtherIdentity', 'ms-DS-Allowed-To-Act-On-Behalf-Of-Other-Identity'],
        ['ms-DS-MachineAccountQuota', 'MS-DS-Machine-Account-Quota'],
        ['msDS-SupportedEncryptionTypes', 'ms-DS-Supported-Encryption-Types'],
        ['gPLink', 'GP-Link'],
        ['gPCFileSysPath', 'GPC-File-Sys-Path']
    ];

    // Preset filters drawn from the reference. These are standard, well-known
    // enumeration/administration filters. `field`/`operator` seed the builder;
    // `query` is the ready-made filter string for the translator.
    const PRESETS = [
        {
            label: 'Disabled user accounts',
            query: '(userAccountControl:1.2.840.113556.1.4.803:=2)'
        },
        {
            label: 'Accounts that do not require a password',
            query: '(userAccountControl:1.2.840.113556.1.4.803:=32)'
        },
        {
            label: "Password never expires",
            query: '(userAccountControl:1.2.840.113556.1.4.803:=65536)'
        },
        {
            label: 'Accounts not requiring Kerberos pre-auth (AS-REP)',
            query: '(userAccountControl:1.2.840.113556.1.4.803:=4194304)'
        },
        {
            label: 'Trusted for unconstrained delegation',
            query: '(userAccountControl:1.2.840.113556.1.4.803:=524288)'
        },
        {
            label: 'Enabled users with a description set',
            query: '(&(objectCategory=user)(description=*)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))'
        },
        {
            label: 'Users with a Service Principal Name (Kerberoastable)',
            query: '(&(objectCategory=user)(servicePrincipalName=*))'
        },
        {
            label: 'Protected / privileged objects (adminCount=1)',
            query: '(&(objectCategory=person)(objectClass=user)(adminCount=1))'
        },
        {
            label: "A user's groups, resolved recursively",
            query: '(member:1.2.840.113556.1.4.1941:=CN=Harry Jones,OU=Employees,DC=INLANEFREIGHT,DC=LOCAL)'
        },
        {
            label: 'All computer objects',
            query: '(objectCategory=computer)'
        },
        {
            label: 'Domain controllers',
            query: '(userAccountControl:1.2.840.113556.1.4.803:=8192)'
        }
    ];

    // LDAP special characters that must be hex-escaped inside filter values
    // (RFC 4515, Listing 5). Order matters: backslash first.
    const ESCAPE_MAP = [
        ['\\', '\\5c'],
        ['\0', '\\00'],
        ['*', '\\2a'],
        ['(', '\\28'],
        [')', '\\29']
    ];

    global.LDAPData = {
        MATCHING_RULE_OIDS,
        RULE_ALIASES,
        UAC_FLAGS,
        UAC_ATTRIBUTES,
        COMMON_ATTRIBUTES,
        PRESETS,
        ESCAPE_MAP
    };
})(typeof window !== 'undefined' ? window : this);
