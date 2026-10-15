// Attribute names, CNs and OIDs from the supplied prompt, plus common AD fields.
// This is a reference catalog, not a complete or server-validated schema.
const AD_ATTRIBUTES = [
  {
    "name": "accountExpires",
    "cn": "Account-Expires",
    "oid": "1.2.840.113556.1.4.159"
  },
  {
    "name": "accountNameHistory",
    "cn": "Account-Name-History",
    "oid": "1.2.840.113556.1.4.1307"
  },
  {
    "name": "aCSAggregateTokenRatePerUser",
    "cn": "ACS-Aggregate-Token-Rate-Per-User",
    "oid": "1.2.840.113556.1.4.760"
  },
  {
    "name": "aCSAllocableRSVPBandwidth",
    "cn": "ACS-Allocable-RSVP-Bandwidth",
    "oid": "1.2.840.113556.1.4.766"
  },
  {
    "name": "aCSCacheTimeout",
    "cn": "ACS-Cache-Timeout",
    "oid": "1.2.840.113556.1.4.779"
  },
  {
    "name": "aCSDirection",
    "cn": "ACS-Direction",
    "oid": "1.2.840.113556.1.4.757"
  },
  {
    "name": "aCSDSBMDeadTime",
    "cn": "ACS-DSBM-DeadTime",
    "oid": "1.2.840.113556.1.4.778"
  },
  {
    "name": "aCSDSBMPriority",
    "cn": "ACS-DSBM-Priority",
    "oid": "1.2.840.113556.1.4.776"
  },
  {
    "name": "aCSDSBMRefresh",
    "cn": "ACS-DSBM-Refresh",
    "oid": "1.2.840.113556.1.4.777"
  },
  {
    "name": "aCSEnableACSService",
    "cn": "ACS-Enable-ACS-Service",
    "oid": "1.2.840.113556.1.4.770"
  },
  {
    "name": "aCSEnableRSVPAccounting",
    "cn": "ACS-Enable-RSVP-Accounting",
    "oid": "1.2.840.113556.1.4.899"
  },
  {
    "name": "aCSEnableRSVPMessageLogging",
    "cn": "ACS-Enable-RSVP-Message-Logging",
    "oid": "1.2.840.113556.1.4.768"
  },
  {
    "name": "aCSEventLogLevel",
    "cn": "ACS-Event-Log-Level",
    "oid": "1.2.840.113556.1.4.769"
  },
  {
    "name": "aCSIdentityName",
    "cn": "ACS-Identity-Name",
    "oid": "1.2.840.113556.1.4.784"
  },
  {
    "name": "aCSMaxAggregatePeakRatePerUser",
    "cn": "ACS-Max-Aggregate-Peak-Rate-Per-User",
    "oid": "1.2.840.113556.1.4.897"
  },
  {
    "name": "aCSMaxDurationPerFlow",
    "cn": "ACS-Max-Duration-Per-Flow",
    "oid": "1.2.840.113556.1.4.761"
  },
  {
    "name": "aCSMaximumSDUSize",
    "cn": "ACS-Maximum-SDU-Size",
    "oid": "1.2.840.113556.1.4.1314"
  },
  {
    "name": "aCSMaxNoOfAccountFiles",
    "cn": "ACS-Max-No-Of-Account-Files",
    "oid": "1.2.840.113556.1.4.901"
  },
  {
    "name": "aCSMaxNoOfLogFiles",
    "cn": "ACS-Max-No-Of-Log-Files",
    "oid": "1.2.840.113556.1.4.774"
  },
  {
    "name": "aCSMaxPeakBandwidth",
    "cn": "ACS-Max-Peak-Bandwidth",
    "oid": "1.2.840.113556.1.4.767"
  },
  {
    "name": "aCSMaxPeakBandwidthPerFlow",
    "cn": "ACS-Max-Peak-Bandwidth-Per-Flow",
    "oid": "1.2.840.113556.1.4.759"
  },
  {
    "name": "aCSMaxSizeOfRSVPAccountFile",
    "cn": "ACS-Max-Size-Of-RSVP-Account-File",
    "oid": "1.2.840.113556.1.4.902"
  },
  {
    "name": "aCSMaxSizeOfRSVPLogFile",
    "cn": "ACS-Max-Size-Of-RSVP-Log-File",
    "oid": "1.2.840.113556.1.4.775"
  },
  {
    "name": "aCSMaxTokenBucketPerFlow",
    "cn": "ACS-Max-Token-Bucket-Per-Flow",
    "oid": "1.2.840.113556.1.4.1313"
  },
  {
    "name": "aCSMaxTokenRatePerFlow",
    "cn": "ACS-Max-Token-Rate-Per-Flow",
    "oid": "1.2.840.113556.1.4.758"
  },
  {
    "name": "aCSMinimumDelayVariation",
    "cn": "ACS-Minimum-Delay-Variation",
    "oid": "1.2.840.113556.1.4.1317"
  },
  {
    "name": "aCSMinimumLatency",
    "cn": "ACS-Minimum-Latency",
    "oid": "1.2.840.113556.1.4.1316"
  },
  {
    "name": "aCSMinimumPolicedSize",
    "cn": "ACS-Minimum-Policed-Size",
    "oid": "1.2.840.113556.1.4.1315"
  },
  {
    "name": "aCSNonReservedMaxSDUSize",
    "cn": "ACS-Non-Reserved-Max-SDU-Size",
    "oid": "1.2.840.113556.1.4.1320"
  },
  {
    "name": "aCSNonReservedMinPolicedSize",
    "cn": "ACS-Non-Reserved-Min-Policed-Size",
    "oid": "1.2.840.113556.1.4.1321"
  },
  {
    "name": "aCSNonReservedPeakRate",
    "cn": "ACS-Non-Reserved-Peak-Rate",
    "oid": "1.2.840.113556.1.4.1318"
  },
  {
    "name": "aCSNonReservedTokenSize",
    "cn": "ACS-Non-Reserved-Token-Size",
    "oid": "1.2.840.113556.1.4.1319"
  },
  {
    "name": "aCSNonReservedTxLimit",
    "cn": "ACS-Non-Reserved-Tx-Limit",
    "oid": "1.2.840.113556.1.4.780"
  },
  {
    "name": "aCSNonReservedTxSize",
    "cn": "ACS-Non-Reserved-Tx-Size",
    "oid": "1.2.840.113556.1.4.898"
  },
  {
    "name": "aCSPermissionBits",
    "cn": "ACS-Permission-Bits",
    "oid": "1.2.840.113556.1.4.765"
  },
  {
    "name": "aCSPolicyName",
    "cn": "ACS-Policy-Name",
    "oid": "1.2.840.113556.1.4.772"
  },
  {
    "name": "aCSPriority",
    "cn": "ACS-Priority",
    "oid": "1.2.840.113556.1.4.764"
  },
  {
    "name": "aCSRSVPAccountFilesLocation",
    "cn": "ACS-RSVP-Account-Files-Location",
    "oid": "1.2.840.113556.1.4.900"
  },
  {
    "name": "aCSRSVPLogFilesLocation",
    "cn": "ACS-RSVP-Log-Files-Location",
    "oid": "1.2.840.113556.1.4.773"
  },
  {
    "name": "aCSServerList",
    "cn": "ACS-Server-List",
    "oid": "1.2.840.113556.1.4.1312"
  },
  {
    "name": "aCSServiceType",
    "cn": "ACS-Service-Type",
    "oid": "1.2.840.113556.1.4.762"
  },
  {
    "name": "aCSTimeOfDay",
    "cn": "ACS-Time-Of-Day",
    "oid": "1.2.840.113556.1.4.756"
  },
  {
    "name": "aCSTotalNoOfFlows",
    "cn": "ACS-Total-No-Of-Flows",
    "oid": "1.2.840.113556.1.4.763"
  },
  {
    "name": "additionalTrustedServiceNames",
    "cn": "Additional-Trusted-Service-Names",
    "oid": "1.2.840.113556.1.4.889"
  },
  {
    "name": "addressBookRoots",
    "cn": "Address-Book-Roots",
    "oid": "1.2.840.113556.1.4.1244"
  },
  {
    "name": "addressEntryDisplayTable",
    "cn": "Address-Entry-Display-Table",
    "oid": "1.2.840.113556.1.2.324"
  },
  {
    "name": "addressEntryDisplayTableMSDOS",
    "cn": "Address-Entry-Display-Table-MSDOS",
    "oid": "1.2.840.113556.1.2.400"
  },
  {
    "name": "addressSyntax",
    "cn": "Address-Syntax",
    "oid": "1.2.840.113556.1.2.255"
  },
  {
    "name": "addressType",
    "cn": "Address-Type",
    "oid": "1.2.840.113556.1.2.350"
  },
  {
    "name": "adminContextMenu",
    "cn": "Admin-Context-Menu",
    "oid": "1.2.840.113556.1.4.614"
  },
  {
    "name": "adminCount",
    "cn": "Admin-Count",
    "oid": "1.2.840.113556.1.4.150"
  },
  {
    "name": "adminDescription",
    "cn": "Admin-Description",
    "oid": "1.2.840.113556.1.2.226"
  },
  {
    "name": "adminDisplayName",
    "cn": "Admin-Display-Name",
    "oid": "1.2.840.113556.1.2.194"
  },
  {
    "name": "adminPropertyPages",
    "cn": "Admin-Property-Pages",
    "oid": "1.2.840.113556.1.4.562"
  },
  {
    "name": "allowedAttributes",
    "cn": "Allowed-Attributes",
    "oid": "1.2.840.113556.1.4.913"
  },
  {
    "name": "allowedAttributesEffective",
    "cn": "Allowed-Attributes-Effective",
    "oid": "1.2.840.113556.1.4.914"
  },
  {
    "name": "allowedChildClasses",
    "cn": "Allowed-Child-Classes",
    "oid": "1.2.840.113556.1.4.911"
  },
  {
    "name": "allowedChildClassesEffective",
    "cn": "Allowed-Child-Classes-Effective",
    "oid": "1.2.840.113556.1.4.912"
  },
  {
    "name": "altSecurityIdentities",
    "cn": "Alt-Security-Identities",
    "oid": "1.2.840.113556.1.4.867"
  },
  {
    "name": "aNR",
    "cn": "ANR",
    "oid": "1.2.840.113556.1.4.1208"
  },
  {
    "name": "applicationName",
    "cn": "Application-Name",
    "oid": "1.2.840.113556.1.4.218"
  },
  {
    "name": "appliesTo",
    "cn": "Applies-To",
    "oid": "1.2.840.113556.1.4.341"
  },
  {
    "name": "appSchemaVersion",
    "cn": "App-Schema-Version",
    "oid": "1.2.840.113556.1.4.848"
  },
  {
    "name": "assetNumber",
    "cn": "Asset-Number",
    "oid": "1.2.840.113556.1.4.283"
  },
  {
    "name": "assistant",
    "cn": "Assistant",
    "oid": "1.2.840.113556.1.4.652"
  },
  {
    "name": "assocNTAccount",
    "cn": "Assoc-NT-Account",
    "oid": "1.2.840.113556.1.4.1213"
  },
  {
    "name": "attributeDisplayNames",
    "cn": "Attribute-Display-Names",
    "oid": "1.2.840.113556.1.4.748"
  },
  {
    "name": "attributeID",
    "cn": "Attribute-ID",
    "oid": "1.2.840.113556.1.2.30"
  },
  {
    "name": "attributeSecurityGUID",
    "cn": "Attribute-Security-GUID",
    "oid": "1.2.840.113556.1.4.149"
  },
  {
    "name": "attributeSyntax",
    "cn": "Attribute-Syntax",
    "oid": "1.2.840.113556.1.2.32"
  },
  {
    "name": "attributeTypes",
    "cn": "Attribute-Types",
    "oid": "2.5.21.5"
  },
  {
    "name": "auditingPolicy",
    "cn": "Auditing-Policy",
    "oid": "1.2.840.113556.1.4.202"
  },
  {
    "name": "authenticationOptions",
    "cn": "Authentication-Options",
    "oid": "1.2.840.113556.1.4.11"
  },
  {
    "name": "authorityRevocationList",
    "cn": "Authority-Revocation-List",
    "oid": "2.5.4.38"
  },
  {
    "name": "auxiliaryClass",
    "cn": "Auxiliary-Class",
    "oid": "1.2.840.113556.1.2.351"
  },
  {
    "name": "badPasswordTime",
    "cn": "Bad-Password-Time",
    "oid": "1.2.840.113556.1.4.49"
  },
  {
    "name": "badPwdCount",
    "cn": "Bad-Pwd-Count",
    "oid": "1.2.840.113556.1.4.12"
  },
  {
    "name": "birthLocation",
    "cn": "Birth-Location",
    "oid": "1.2.840.113556.1.4.332"
  },
  {
    "name": "bridgeheadServerListBL",
    "cn": "Bridgehead-Server-List-BL",
    "oid": "1.2.840.113556.1.4.820"
  },
  {
    "name": "bridgeheadTransportList",
    "cn": "Bridgehead-Transport-List",
    "oid": "1.2.840.113556.1.4.819"
  },
  {
    "name": "builtinCreationTime",
    "cn": "Builtin-Creation-Time",
    "oid": "1.2.840.113556.1.4.13"
  },
  {
    "name": "builtinModifiedCount",
    "cn": "Builtin-Modified-Count",
    "oid": "1.2.840.113556.1.4.14"
  },
  {
    "name": "businessCategory",
    "cn": "Business-Category",
    "oid": "2.5.4.15"
  },
  {
    "name": "bytesPerMinute",
    "cn": "Bytes-Per-Minute",
    "oid": "1.2.840.113556.1.4.284"
  },
  {
    "name": "c",
    "cn": "Country-Name",
    "oid": "2.5.4.6"
  },
  {
    "name": "cACertificate",
    "cn": "CA-Certificate",
    "oid": "2.5.4.37"
  },
  {
    "name": "cACertificateDN",
    "cn": "CA-Certificate-DN",
    "oid": "1.2.840.113556.1.4.697"
  },
  {
    "name": "cAConnect",
    "cn": "CA-Connect",
    "oid": "1.2.840.113556.1.4.687"
  },
  {
    "name": "canonicalName",
    "cn": "Canonical-Name",
    "oid": "1.2.840.113556.1.4.916"
  },
  {
    "name": "canUpgradeScript",
    "cn": "Can-Upgrade-Script",
    "oid": "1.2.840.113556.1.4.815"
  },
  {
    "name": "catalogs",
    "cn": "Catalogs",
    "oid": "1.2.840.113556.1.4.675"
  },
  {
    "name": "categories",
    "cn": "Categories",
    "oid": "1.2.840.113556.1.4.672"
  },
  {
    "name": "categoryId",
    "cn": "Category-Id",
    "oid": "1.2.840.113556.1.4.322"
  },
  {
    "name": "cAUsages",
    "cn": "CA-Usages",
    "oid": "1.2.840.113556.1.4.690"
  },
  {
    "name": "cAWEBURL",
    "cn": "CA-WEB-URL",
    "oid": "1.2.840.113556.1.4.688"
  },
  {
    "name": "certificateAuthorityObject",
    "cn": "Certificate-Authority-Object",
    "oid": "1.2.840.113556.1.4.684"
  },
  {
    "name": "certificateRevocationList",
    "cn": "Certificate-Revocation-List",
    "oid": "2.5.4.39"
  },
  {
    "name": "certificateTemplates",
    "cn": "Certificate-Templates",
    "oid": "1.2.840.113556.1.4.823"
  },
  {
    "name": "classDisplayName",
    "cn": "Class-Display-Name",
    "oid": "1.2.840.113556.1.4.610"
  },
  {
    "name": "cn",
    "cn": "Common-Name",
    "oid": "2.5.4.3"
  },
  {
    "name": "co",
    "cn": "Text-Country",
    "oid": "1.2.840.113556.1.2.131"
  },
  {
    "name": "codePage",
    "cn": "Code-Page",
    "oid": "1.2.840.113556.1.4.16"
  },
  {
    "name": "cOMClassID",
    "cn": "COM-ClassID",
    "oid": "1.2.840.113556.1.4.19"
  },
  {
    "name": "cOMCLSID",
    "cn": "COM-CLSID",
    "oid": "1.2.840.113556.1.4.249"
  },
  {
    "name": "cOMInterfaceID",
    "cn": "COM-InterfaceID",
    "oid": "1.2.840.113556.1.4.20"
  },
  {
    "name": "comment",
    "cn": "User-Comment",
    "oid": "1.2.840.113556.1.4.156"
  },
  {
    "name": "cOMOtherProgId",
    "cn": "COM-Other-Prog-Id",
    "oid": "1.2.840.113556.1.4.253"
  },
  {
    "name": "company",
    "cn": "Company",
    "oid": "1.2.840.113556.1.2.146"
  },
  {
    "name": "cOMProgID",
    "cn": "COM-ProgID",
    "oid": "1.2.840.113556.1.4.21"
  },
  {
    "name": "cOMTreatAsClassId",
    "cn": "COM-Treat-As-Class-Id",
    "oid": "1.2.840.113556.1.4.251"
  },
  {
    "name": "cOMTypelibId",
    "cn": "COM-Typelib-Id",
    "oid": "1.2.840.113556.1.4.254"
  },
  {
    "name": "cOMUniqueLIBID",
    "cn": "COM-Unique-LIBID",
    "oid": "1.2.840.113556.1.4.250"
  },
  {
    "name": "contentIndexingAllowed",
    "cn": "Content-Indexing-Allowed",
    "oid": "1.2.840.113556.1.4.24"
  },
  {
    "name": "contextMenu",
    "cn": "Context-Menu",
    "oid": "1.2.840.113556.1.4.499"
  },
  {
    "name": "controlAccessRights",
    "cn": "Control-Access-Rights",
    "oid": "1.2.840.113556.1.4.200"
  },
  {
    "name": "cost",
    "cn": "Cost",
    "oid": "1.2.840.113556.1.2.135"
  },
  {
    "name": "countryCode",
    "cn": "Country-Code",
    "oid": "1.2.840.113556.1.4.25"
  },
  {
    "name": "createDialog",
    "cn": "Create-Dialog",
    "oid": "1.2.840.113556.1.4.810"
  },
  {
    "name": "createTimeStamp",
    "cn": "Create-Time-Stamp",
    "oid": "2.5.18.1"
  },
  {
    "name": "createWizardExt",
    "cn": "Create-Wizard-Ext",
    "oid": "1.2.840.113556.1.4.812"
  },
  {
    "name": "creationTime",
    "cn": "Creation-Time",
    "oid": "1.2.840.113556.1.4.26"
  },
  {
    "name": "creationWizard",
    "cn": "Creation-Wizard",
    "oid": "1.2.840.113556.1.4.498"
  },
  {
    "name": "creator",
    "cn": "Creator",
    "oid": "1.2.840.113556.1.4.679"
  },
  {
    "name": "cRLObject",
    "cn": "CRL-Object",
    "oid": "1.2.840.113556.1.4.689"
  },
  {
    "name": "cRLPartitionedRevocationList",
    "cn": "CRL-Partitioned-Revocation-List",
    "oid": "1.2.840.113556.1.4.683"
  },
  {
    "name": "crossCertificatePair",
    "cn": "Cross-Certificate-Pair",
    "oid": "2.5.4.40"
  },
  {
    "name": "currentLocation",
    "cn": "Current-Location",
    "oid": "1.2.840.113556.1.4.335"
  },
  {
    "name": "currentParentCA",
    "cn": "Current-Parent-CA",
    "oid": "1.2.840.113556.1.4.696"
  },
  {
    "name": "currentValue",
    "cn": "Current-Value",
    "oid": "1.2.840.113556.1.4.27"
  },
  {
    "name": "currMachineId",
    "cn": "Curr-Machine-Id",
    "oid": "1.2.840.113556.1.4.337"
  },
  {
    "name": "dBCSPwd",
    "cn": "DBCS-Pwd",
    "oid": "1.2.840.113556.1.4.55"
  },
  {
    "name": "dc",
    "cn": "Domain-Component",
    "oid": "0.9.2342.19200300.100.1.25"
  },
  {
    "name": "defaultClassStore",
    "cn": "Default-Class-Store",
    "oid": "1.2.840.113556.1.4.213"
  },
  {
    "name": "defaultGroup",
    "cn": "Default-Group",
    "oid": "1.2.840.113556.1.4.480"
  },
  {
    "name": "defaultHidingValue",
    "cn": "Default-Hiding-Value",
    "oid": "1.2.840.113556.1.4.518"
  },
  {
    "name": "defaultLocalPolicyObject",
    "cn": "Default-Local-Policy-Object",
    "oid": "1.2.840.113556.1.4.57"
  },
  {
    "name": "defaultObjectCategory",
    "cn": "Default-Object-Category",
    "oid": "1.2.840.113556.1.4.783"
  },
  {
    "name": "defaultPriority",
    "cn": "Default-Priority",
    "oid": "1.2.840.113556.1.4.232"
  },
  {
    "name": "defaultSecurityDescriptor",
    "cn": "Default-Security-Descriptor",
    "oid": "1.2.840.113556.1.4.224"
  },
  {
    "name": "deltaRevocationList",
    "cn": "Delta-Revocation-List",
    "oid": "2.5.4.53"
  },
  {
    "name": "department",
    "cn": "Department",
    "oid": "1.2.840.113556.1.2.141"
  },
  {
    "name": "description",
    "cn": "Description",
    "oid": "2.5.4.13"
  },
  {
    "name": "desktopProfile",
    "cn": "Desktop-Profile",
    "oid": "1.2.840.113556.1.4.346"
  },
  {
    "name": "destinationIndicator",
    "cn": "Destination-Indicator",
    "oid": "2.5.4.27"
  },
  {
    "name": "dhcpClasses",
    "cn": "dhcp-Classes",
    "oid": "1.2.840.113556.1.4.715"
  },
  {
    "name": "dhcpFlags",
    "cn": "dhcp-Flags",
    "oid": "1.2.840.113556.1.4.700"
  },
  {
    "name": "dhcpIdentification",
    "cn": "dhcp-Identification",
    "oid": "1.2.840.113556.1.4.701"
  },
  {
    "name": "dhcpMask",
    "cn": "dhcp-Mask",
    "oid": "1.2.840.113556.1.4.706"
  },
  {
    "name": "dhcpMaxKey",
    "cn": "dhcp-MaxKey",
    "oid": "1.2.840.113556.1.4.719"
  },
  {
    "name": "dhcpObjDescription",
    "cn": "dhcp-Obj-Description",
    "oid": "1.2.840.113556.1.4.703"
  },
  {
    "name": "dhcpObjName",
    "cn": "dhcp-Obj-Name",
    "oid": "1.2.840.113556.1.4.702"
  },
  {
    "name": "dhcpOptions",
    "cn": "dhcp-Options",
    "oid": "1.2.840.113556.1.4.714"
  },
  {
    "name": "dhcpProperties",
    "cn": "dhcp-Properties",
    "oid": "1.2.840.113556.1.4.718"
  },
  {
    "name": "dhcpRanges",
    "cn": "dhcp-Ranges",
    "oid": "1.2.840.113556.1.4.707"
  },
  {
    "name": "dhcpReservations",
    "cn": "dhcp-Reservations",
    "oid": "1.2.840.113556.1.4.709"
  },
  {
    "name": "dhcpServers",
    "cn": "dhcp-Servers",
    "oid": "1.2.840.113556.1.4.704"
  },
  {
    "name": "dhcpSites",
    "cn": "dhcp-Sites",
    "oid": "1.2.840.113556.1.4.708"
  },
  {
    "name": "dhcpState",
    "cn": "dhcp-State",
    "oid": "1.2.840.113556.1.4.717"
  },
  {
    "name": "dhcpSubnets",
    "cn": "dhcp-Subnets",
    "oid": "1.2.840.113556.1.4.705"
  },
  {
    "name": "dhcpType",
    "cn": "dhcp-Type",
    "oid": "1.2.840.113556.1.4.699"
  },
  {
    "name": "dhcpUniqueKey",
    "cn": "dhcp-Unique-Key",
    "oid": "1.2.840.113556.1.4.698"
  },
  {
    "name": "dhcpUpdateTime",
    "cn": "dhcp-Update-Time",
    "oid": "1.2.840.113556.1.4.720"
  },
  {
    "name": "directReports",
    "cn": "Reports",
    "oid": "1.2.840.113556.1.2.436"
  },
  {
    "name": "displayName",
    "cn": "Display-Name",
    "oid": "1.2.840.113556.1.2.13"
  },
  {
    "name": "displayNamePrintable",
    "cn": "Display-Name-Printable",
    "oid": "1.2.840.113556.1.2.353"
  },
  {
    "name": "distinguishedName",
    "cn": "Obj-Dist-Name",
    "oid": "2.5.4.49"
  },
  {
    "name": "dITContentRules",
    "cn": "DIT-Content-Rules",
    "oid": "2.5.21.2"
  },
  {
    "name": "division",
    "cn": "Division",
    "oid": "1.2.840.113556.1.4.261"
  },
  {
    "name": "dMDLocation",
    "cn": "DMD-Location",
    "oid": "1.2.840.113556.1.2.36"
  },
  {
    "name": "dmdName",
    "cn": "DMD-Name",
    "oid": "1.2.840.113556.1.2.598"
  },
  {
    "name": "dNReferenceUpdate",
    "cn": "DN-Reference-Update",
    "oid": "1.2.840.113556.1.4.1242"
  },
  {
    "name": "dnsAllowDynamic",
    "cn": "Dns-Allow-Dynamic",
    "oid": "1.2.840.113556.1.4.378"
  },
  {
    "name": "dnsAllowXFR",
    "cn": "Dns-Allow-XFR",
    "oid": "1.2.840.113556.1.4.379"
  },
  {
    "name": "dNSHostName",
    "cn": "DNS-Host-Name",
    "oid": "1.2.840.113556.1.4.619"
  },
  {
    "name": "dnsNotifySecondaries",
    "cn": "Dns-Notify-Secondaries",
    "oid": "1.2.840.113556.1.4.381"
  },
  {
    "name": "dNSProperty",
    "cn": "DNS-Property",
    "oid": "1.2.840.113556.1.4.1306"
  },
  {
    "name": "dnsRecord",
    "cn": "Dns-Record",
    "oid": "1.2.840.113556.1.4.382"
  },
  {
    "name": "dnsRoot",
    "cn": "Dns-Root",
    "oid": "1.2.840.113556.1.4.28"
  },
  {
    "name": "dnsSecureSecondaries",
    "cn": "Dns-Secure-Secondaries",
    "oid": "1.2.840.113556.1.4.380"
  },
  {
    "name": "dNSTombstoned",
    "cn": "DNS-Tombstoned",
    "oid": "1.2.840.113556.1.4.1414"
  },
  {
    "name": "domainCAs",
    "cn": "Domain-Certificate-Authorities",
    "oid": "1.2.840.113556.1.4.668"
  },
  {
    "name": "domainCrossRef",
    "cn": "Domain-Cross-Ref",
    "oid": "1.2.840.113556.1.4.472"
  },
  {
    "name": "domainID",
    "cn": "Domain-ID",
    "oid": "1.2.840.113556.1.4.686"
  },
  {
    "name": "domainIdentifier",
    "cn": "Domain-Identifier",
    "oid": "1.2.840.113556.1.4.755"
  },
  {
    "name": "domainPolicyObject",
    "cn": "Domain-Policy-Object",
    "oid": "1.2.840.113556.1.4.32"
  },
  {
    "name": "domainPolicyReference",
    "cn": "Domain-Policy-Reference",
    "oid": "1.2.840.113556.1.4.422"
  },
  {
    "name": "domainReplica",
    "cn": "Domain-Replica",
    "oid": "1.2.840.113556.1.4.158"
  },
  {
    "name": "domainWidePolicy",
    "cn": "Domain-Wide-Policy",
    "oid": "1.2.840.113556.1.4.421"
  },
  {
    "name": "driverName",
    "cn": "Driver-Name",
    "oid": "1.2.840.113556.1.4.229"
  },
  {
    "name": "driverVersion",
    "cn": "Driver-Version",
    "oid": "1.2.840.113556.1.4.276"
  },
  {
    "name": "dSASignature",
    "cn": "DSA-Signature",
    "oid": "1.2.840.113556.1.2.74"
  },
  {
    "name": "dSCorePropagationData",
    "cn": "DS-Core-Propagation-Data",
    "oid": "1.2.840.113556.1.4.1357"
  },
  {
    "name": "dSHeuristics",
    "cn": "DS-Heuristics",
    "oid": "1.2.840.113556.1.2.212"
  },
  {
    "name": "dSUIAdminMaximum",
    "cn": "DS-UI-Admin-Maximum",
    "oid": "1.2.840.113556.1.4.1344"
  },
  {
    "name": "dSUIAdminNotification",
    "cn": "DS-UI-Admin-Notification",
    "oid": "1.2.840.113556.1.4.1343"
  },
  {
    "name": "dSUIShellMaximum",
    "cn": "DS-UI-Shell-Maximum",
    "oid": "1.2.840.113556.1.4.1345"
  },
  {
    "name": "dynamicLDAPServer",
    "cn": "Dynamic-LDAP-Server",
    "oid": "1.2.840.113556.1.4.537"
  },
  {
    "name": "eFSPolicy",
    "cn": "EFSPolicy",
    "oid": "1.2.840.113556.1.4.268"
  },
  {
    "name": "employeeID",
    "cn": "Employee-ID",
    "oid": "1.2.840.113556.1.4.35"
  },
  {
    "name": "employeeNumber",
    "cn": "Employee-Number",
    "oid": "1.2.840.113556.1.2.610"
  },
  {
    "name": "employeeType",
    "cn": "Employee-Type",
    "oid": "1.2.840.113556.1.2.613"
  },
  {
    "name": "Enabled",
    "cn": "Enabled",
    "oid": "1.2.840.113556.1.2.557"
  },
  {
    "name": "enabledConnection",
    "cn": "Enabled-Connection",
    "oid": "1.2.840.113556.1.4.36"
  },
  {
    "name": "enrollmentProviders",
    "cn": "Enrollment-Providers",
    "oid": "1.2.840.113556.1.4.825"
  },
  {
    "name": "extendedAttributeInfo",
    "cn": "Extended-Attribute-Info",
    "oid": "1.2.840.113556.1.4.909"
  },
  {
    "name": "extendedCharsAllowed",
    "cn": "Extended-Chars-Allowed",
    "oid": "1.2.840.113556.1.2.380"
  },
  {
    "name": "extendedClassInfo",
    "cn": "Extended-Class-Info",
    "oid": "1.2.840.113556.1.4.908"
  },
  {
    "name": "extensionName",
    "cn": "Extension-Name",
    "oid": "1.2.840.113556.1.2.227"
  },
  {
    "name": "facsimileTelephoneNumber",
    "cn": "Facsimile-Telephone-Number",
    "oid": "2.5.4.23"
  },
  {
    "name": "fileExtPriority",
    "cn": "File-Ext-Priority",
    "oid": "1.2.840.113556.1.4.816"
  },
  {
    "name": "flags",
    "cn": "Flags",
    "oid": "1.2.840.113556.1.4.38"
  },
  {
    "name": "flatName",
    "cn": "Flat-Name",
    "oid": "1.2.840.113556.1.4.511"
  },
  {
    "name": "forceLogoff",
    "cn": "Force-Logoff",
    "oid": "1.2.840.113556.1.4.39"
  },
  {
    "name": "foreignIdentifier",
    "cn": "Foreign-Identifier",
    "oid": "1.2.840.113556.1.4.356"
  },
  {
    "name": "friendlyNames",
    "cn": "Friendly-Names",
    "oid": "1.2.840.113556.1.4.682"
  },
  {
    "name": "fromEntry",
    "cn": "From-Entry",
    "oid": "1.2.840.113556.1.4.910"
  },
  {
    "name": "fromServer",
    "cn": "From-Server",
    "oid": "1.2.840.113556.1.4.40"
  },
  {
    "name": "frsComputerReference",
    "cn": "Frs-Computer-Reference",
    "oid": "1.2.840.113556.1.4.869"
  },
  {
    "name": "frsComputerReferenceBL",
    "cn": "Frs-Computer-Reference-BL",
    "oid": "1.2.840.113556.1.4.870"
  },
  {
    "name": "fRSControlDataCreation",
    "cn": "FRS-Control-Data-Creation",
    "oid": "1.2.840.113556.1.4.871"
  },
  {
    "name": "fRSControlInboundBacklog",
    "cn": "FRS-Control-Inbound-Backlog",
    "oid": "1.2.840.113556.1.4.872"
  },
  {
    "name": "fRSControlOutboundBacklog",
    "cn": "FRS-Control-Outbound-Backlog",
    "oid": "1.2.840.113556.1.4.873"
  },
  {
    "name": "fRSDirectoryFilter",
    "cn": "FRS-Directory-Filter",
    "oid": "1.2.840.113556.1.4.484"
  },
  {
    "name": "fRSDSPoll",
    "cn": "FRS-DS-Poll",
    "oid": "1.2.840.113556.1.4.490"
  },
  {
    "name": "fRSExtensions",
    "cn": "FRS-Extensions",
    "oid": "1.2.840.113556.1.4.536"
  },
  {
    "name": "fRSFaultCondition",
    "cn": "FRS-Fault-Condition",
    "oid": "1.2.840.113556.1.4.491"
  },
  {
    "name": "fRSFileFilter",
    "cn": "FRS-File-Filter",
    "oid": "1.2.840.113556.1.4.483"
  },
  {
    "name": "fRSFlags",
    "cn": "FRS-Flags",
    "oid": "1.2.840.113556.1.4.874"
  },
  {
    "name": "fRSLevelLimit",
    "cn": "FRS-Level-Limit",
    "oid": "1.2.840.113556.1.4.534"
  },
  {
    "name": "fRSMemberReference",
    "cn": "FRS-Member-Reference",
    "oid": "1.2.840.113556.1.4.875"
  },
  {
    "name": "fRSMemberReferenceBL",
    "cn": "FRS-Member-Reference-BL",
    "oid": "1.2.840.113556.1.4.876"
  },
  {
    "name": "fRSPartnerAuthLevel",
    "cn": "FRS-Partner-Auth-Level",
    "oid": "1.2.840.113556.1.4.877"
  },
  {
    "name": "fRSPrimaryMember",
    "cn": "FRS-Primary-Member",
    "oid": "1.2.840.113556.1.4.878"
  },
  {
    "name": "fRSReplicaSetGUID",
    "cn": "FRS-Replica-Set-GUID",
    "oid": "1.2.840.113556.1.4.533"
  },
  {
    "name": "fRSReplicaSetType",
    "cn": "FRS-Replica-Set-Type",
    "oid": "1.2.840.113556.1.4.31"
  },
  {
    "name": "fRSRootPath",
    "cn": "FRS-Root-Path",
    "oid": "1.2.840.113556.1.4.487"
  },
  {
    "name": "fRSRootSecurity",
    "cn": "FRS-Root-Security",
    "oid": "1.2.840.113556.1.4.535"
  },
  {
    "name": "fRSServiceCommand",
    "cn": "FRS-Service-Command",
    "oid": "1.2.840.113556.1.4.500"
  },
  {
    "name": "fRSServiceCommandStatus",
    "cn": "FRS-Service-Command-Status",
    "oid": "1.2.840.113556.1.4.879"
  },
  {
    "name": "fRSStagingPath",
    "cn": "FRS-Staging-Path",
    "oid": "1.2.840.113556.1.4.488"
  },
  {
    "name": "fRSTimeLastCommand",
    "cn": "FRS-Time-Last-Command",
    "oid": "1.2.840.113556.1.4.880"
  },
  {
    "name": "fRSTimeLastConfigChange",
    "cn": "FRS-Time-Last-Config-Change",
    "oid": "1.2.840.113556.1.4.881"
  },
  {
    "name": "fRSUpdateTimeout",
    "cn": "FRS-Update-Timeout",
    "oid": "1.2.840.113556.1.4.485"
  },
  {
    "name": "fRSVersion",
    "cn": "FRS-Version",
    "oid": "1.2.840.113556.1.4.882"
  },
  {
    "name": "fRSVersionGUID",
    "cn": "FRS-Version-GUID",
    "oid": "1.2.840.113556.1.4.43"
  },
  {
    "name": "fRSWorkingPath",
    "cn": "FRS-Working-Path",
    "oid": "1.2.840.113556.1.4.486"
  },
  {
    "name": "fSMORoleOwner",
    "cn": "FSMO-Role-Owner",
    "oid": "1.2.840.113556.1.4.369"
  },
  {
    "name": "garbageCollPeriod",
    "cn": "Garbage-Coll-Period",
    "oid": "1.2.840.113556.1.2.301"
  },
  {
    "name": "generatedConnection",
    "cn": "Generated-Connection",
    "oid": "1.2.840.113556.1.4.41"
  },
  {
    "name": "generationQualifier",
    "cn": "Generation-Qualifier",
    "oid": "2.5.4.44"
  },
  {
    "name": "givenName",
    "cn": "Given-Name",
    "oid": "2.5.4.42"
  },
  {
    "name": "globalAddressList",
    "cn": "Global-Address-List",
    "oid": "1.2.840.113556.1.4.1245"
  },
  {
    "name": "governsID",
    "cn": "Governs-ID",
    "oid": "1.2.840.113556.1.2.22"
  },
  {
    "name": "gPCFileSysPath",
    "cn": "GPC-File-Sys-Path",
    "oid": "1.2.840.113556.1.4.894"
  },
  {
    "name": "gPCFunctionalityVersion",
    "cn": "GPC-Functionality-Version",
    "oid": "1.2.840.113556.1.4.893"
  },
  {
    "name": "gPCMachineExtensionNames",
    "cn": "GPC-Machine-Extension-Names",
    "oid": "1.2.840.113556.1.4.1348"
  },
  {
    "name": "gPCUserExtensionNames",
    "cn": "GPC-User-Extension-Names",
    "oid": "1.2.840.113556.1.4.1349"
  },
  {
    "name": "gPLink",
    "cn": "GP-Link",
    "oid": "1.2.840.113556.1.4.891"
  },
  {
    "name": "gPOptions",
    "cn": "GP-Options",
    "oid": "1.2.840.113556.1.4.892"
  },
  {
    "name": "groupAttributes",
    "cn": "Group-Attributes",
    "oid": "1.2.840.113556.1.4.152"
  },
  {
    "name": "groupMembershipSAM",
    "cn": "Group-Membership-SAM",
    "oid": "1.2.840.113556.1.4.166"
  },
  {
    "name": "groupPriority",
    "cn": "Group-Priority",
    "oid": "1.2.840.113556.1.4.345"
  },
  {
    "name": "groupsToIgnore",
    "cn": "Groups-to-Ignore",
    "oid": "1.2.840.113556.1.4.344"
  },
  {
    "name": "groupType",
    "cn": "Group-Type",
    "oid": "1.2.840.113556.1.4.750"
  },
  {
    "name": "hasMasterNCs",
    "cn": "Has-Master-NCs",
    "oid": "1.2.840.113556.1.2.14"
  },
  {
    "name": "hasPartialReplicaNCs",
    "cn": "Has-Partial-Replica-NCs",
    "oid": "1.2.840.113556.1.2.15"
  },
  {
    "name": "helpData16",
    "cn": "Help-Data16",
    "oid": "1.2.840.113556.1.2.402"
  },
  {
    "name": "helpData32",
    "cn": "Help-Data32",
    "oid": "1.2.840.113556.1.2.9"
  },
  {
    "name": "helpFileName",
    "cn": "Help-File-Name",
    "oid": "1.2.840.113556.1.2.327"
  },
  {
    "name": "homeDirectory",
    "cn": "Home-Directory",
    "oid": "1.2.840.113556.1.4.44"
  },
  {
    "name": "homeDrive",
    "cn": "Home-Drive",
    "oid": "1.2.840.113556.1.4.45"
  },
  {
    "name": "homePhone",
    "cn": "Phone-Home-Primary",
    "oid": "0.9.2342.19200300.100.1.20"
  },
  {
    "name": "homePostalAddress",
    "cn": "Address-Home",
    "oid": "1.2.840.113556.1.2.617"
  },
  {
    "name": "iconPath",
    "cn": "Icon-Path",
    "oid": "1.2.840.113556.1.4.219"
  },
  {
    "name": "implementedCategories",
    "cn": "Implemented-Categories",
    "oid": "1.2.840.113556.1.4.320"
  },
  {
    "name": "indexedScopes",
    "cn": "IndexedScopes",
    "oid": "1.2.840.113556.1.4.681"
  },
  {
    "name": "info",
    "cn": "Comment",
    "oid": "1.2.840.113556.1.2.81"
  },
  {
    "name": "initialAuthIncoming",
    "cn": "Initial-Auth-Incoming",
    "oid": "1.2.840.113556.1.4.539"
  },
  {
    "name": "initialAuthOutgoing",
    "cn": "Initial-Auth-Outgoing",
    "oid": "1.2.840.113556.1.4.540"
  },
  {
    "name": "initials",
    "cn": "Initials",
    "oid": "2.5.4.43"
  },
  {
    "name": "installUiLevel",
    "cn": "Install-Ui-Level",
    "oid": "1.2.840.113556.1.4.847"
  },
  {
    "name": "instanceType",
    "cn": "Instance-Type",
    "oid": "1.2.840.113556.1.2.1"
  },
  {
    "name": "internationalISDNNumber",
    "cn": "International-ISDN-Number",
    "oid": "2.5.4.25"
  },
  {
    "name": "interSiteTopologyFailover",
    "cn": "Inter-Site-Topology-Failover",
    "oid": "1.2.840.113556.1.4.1248"
  },
  {
    "name": "interSiteTopologyGenerator",
    "cn": "Inter-Site-Topology-Generator",
    "oid": "1.2.840.113556.1.4.1246"
  },
  {
    "name": "interSiteTopologyRenew",
    "cn": "Inter-Site-Topology-Renew",
    "oid": "1.2.840.113556.1.4.1247"
  },
  {
    "name": "invocationId",
    "cn": "Invocation-Id",
    "oid": "1.2.840.113556.1.2.115"
  },
  {
    "name": "ipPhone",
    "cn": "Phone-Ip-Primary",
    "oid": "1.2.840.113556.1.4.721"
  },
  {
    "name": "ipsecData",
    "cn": "Ipsec-Data",
    "oid": "1.2.840.113556.1.4.623"
  },
  {
    "name": "ipsecDataType",
    "cn": "Ipsec-Data-Type",
    "oid": "1.2.840.113556.1.4.622"
  },
  {
    "name": "ipsecFilterReference",
    "cn": "Ipsec-Filter-Reference",
    "oid": "1.2.840.113556.1.4.629"
  },
  {
    "name": "ipsecID",
    "cn": "Ipsec-ID",
    "oid": "1.2.840.113556.1.4.621"
  },
  {
    "name": "ipsecISAKMPReference",
    "cn": "Ipsec-ISAKMP-Reference",
    "oid": "1.2.840.113556.1.4.626"
  },
  {
    "name": "ipsecName",
    "cn": "Ipsec-Name",
    "oid": "1.2.840.113556.1.4.620"
  },
  {
    "name": "iPSECNegotiationPolicyAction",
    "cn": "IPSEC-Negotiation-Policy-Action",
    "oid": "1.2.840.113556.1.4.888"
  },
  {
    "name": "ipsecNegotiationPolicyReference",
    "cn": "Ipsec-Negotiation-Policy-Reference",
    "oid": "1.2.840.113556.1.4.628"
  },
  {
    "name": "iPSECNegotiationPolicyType",
    "cn": "IPSEC-Negotiation-Policy-Type",
    "oid": "1.2.840.113556.1.4.887"
  },
  {
    "name": "ipsecNFAReference",
    "cn": "Ipsec-NFA-Reference",
    "oid": "1.2.840.113556.1.4.627"
  },
  {
    "name": "ipsecOwnersReference",
    "cn": "Ipsec-Owners-Reference",
    "oid": "1.2.840.113556.1.4.624"
  },
  {
    "name": "ipsecPolicyReference",
    "cn": "Ipsec-Policy-Reference",
    "oid": "1.2.840.113556.1.4.517"
  },
  {
    "name": "isCriticalSystemObject",
    "cn": "Is-Critical-System-Object",
    "oid": "1.2.840.113556.1.4.868"
  },
  {
    "name": "isDefunct",
    "cn": "Is-Defunct",
    "oid": "1.2.840.113556.1.4.661"
  },
  {
    "name": "isDeleted",
    "cn": "Is-Deleted",
    "oid": "1.2.840.113556.1.2.48"
  },
  {
    "name": "isEphemeral",
    "cn": "Is-Ephemeral",
    "oid": "1.2.840.113556.1.4.1212"
  },
  {
    "name": "isMemberOfPartialAttributeSet",
    "cn": "Is-Member-Of-Partial-Attribute-Set",
    "oid": "1.2.840.113556.1.4.639"
  },
  {
    "name": "isPrivilegeHolder",
    "cn": "Is-Privilege-Holder",
    "oid": "1.2.840.113556.1.4.638"
  },
  {
    "name": "isSingleValued",
    "cn": "Is-Single-Valued",
    "oid": "1.2.840.113556.1.2.33"
  },
  {
    "name": "keywords",
    "cn": "Keywords",
    "oid": "1.2.840.113556.1.4.48"
  },
  {
    "name": "knowledgeInformation",
    "cn": "Knowledge-Information",
    "oid": "2.5.4.2"
  },
  {
    "name": "l",
    "cn": "Locality-Name",
    "oid": "2.5.4.7"
  },
  {
    "name": "lastBackupRestorationTime",
    "cn": "Last-Backup-Restoration-Time",
    "oid": "1.2.840.113556.1.4.519"
  },
  {
    "name": "lastContentIndexed",
    "cn": "Last-Content-Indexed",
    "oid": "1.2.840.113556.1.4.50"
  },
  {
    "name": "lastKnownParent",
    "cn": "Last-Known-Parent",
    "oid": "1.2.840.113556.1.4.781"
  },
  {
    "name": "lastLogoff",
    "cn": "Last-Logoff",
    "oid": "1.2.840.113556.1.4.51"
  },
  {
    "name": "lastLogon",
    "cn": "Last-Logon",
    "oid": "1.2.840.113556.1.4.52"
  },
  {
    "name": "lastSetTime",
    "cn": "Last-Set-Time",
    "oid": "1.2.840.113556.1.4.53"
  },
  {
    "name": "lastUpdateSequence",
    "cn": "Last-Update-Sequence",
    "oid": "1.2.840.113556.1.4.330"
  },
  {
    "name": "lDAPAdminLimits",
    "cn": "LDAP-Admin-Limits",
    "oid": "1.2.840.113556.1.4.843"
  },
  {
    "name": "lDAPDisplayName",
    "cn": "LDAP-Display-Name",
    "oid": "1.2.840.113556.1.2.460"
  },
  {
    "name": "lDAPIPDenyList",
    "cn": "LDAP-IPDeny-List",
    "oid": "1.2.840.113556.1.4.844"
  },
  {
    "name": "legacyExchangeDN",
    "cn": "Legacy-Exchange-DN",
    "oid": "1.2.840.113556.1.4.655"
  },
  {
    "name": "linkID",
    "cn": "Link-ID",
    "oid": "1.2.840.113556.1.2.50"
  },
  {
    "name": "linkTrackSecret",
    "cn": "Link-Track-Secret",
    "oid": "1.2.840.113556.1.4.269"
  },
  {
    "name": "lmPwdHistory",
    "cn": "Lm-Pwd-History",
    "oid": "1.2.840.113556.1.4.160"
  },
  {
    "name": "localeID",
    "cn": "Locale-ID",
    "oid": "1.2.840.113556.1.4.58"
  },
  {
    "name": "localizationDisplayId",
    "cn": "Localization-Display-Id",
    "oid": "1.2.840.113556.1.4.1353"
  },
  {
    "name": "localizedDescription",
    "cn": "Localized-Description",
    "oid": "1.2.840.113556.1.4.817"
  },
  {
    "name": "localPolicyFlags",
    "cn": "Local-Policy-Flags",
    "oid": "1.2.840.113556.1.4.56"
  },
  {
    "name": "localPolicyReference",
    "cn": "Local-Policy-Reference",
    "oid": "1.2.840.113556.1.4.457"
  },
  {
    "name": "location",
    "cn": "Location",
    "oid": "1.2.840.113556.1.4.222"
  },
  {
    "name": "lockoutDuration",
    "cn": "Lockout-Duration",
    "oid": "1.2.840.113556.1.4.60"
  },
  {
    "name": "lockOutObservationWindow",
    "cn": "Lock-Out-Observation-Window",
    "oid": "1.2.840.113556.1.4.61"
  },
  {
    "name": "lockoutThreshold",
    "cn": "Lockout-Threshold",
    "oid": "1.2.840.113556.1.4.73"
  },
  {
    "name": "lockoutTime",
    "cn": "Lockout-Time",
    "oid": "1.2.840.113556.1.4.662"
  },
  {
    "name": "logonCount",
    "cn": "Logon-Count",
    "oid": "1.2.840.113556.1.4.169"
  },
  {
    "name": "logonHours",
    "cn": "Logon-Hours",
    "oid": "1.2.840.113556.1.4.64"
  },
  {
    "name": "logonWorkstation",
    "cn": "Logon-Workstation",
    "oid": "1.2.840.113556.1.4.65"
  },
  {
    "name": "lSACreationTime",
    "cn": "LSA-Creation-Time",
    "oid": "1.2.840.113556.1.4.66"
  },
  {
    "name": "lSAModifiedCount",
    "cn": "LSA-Modified-Count",
    "oid": "1.2.840.113556.1.4.67"
  },
  {
    "name": "machineArchitecture",
    "cn": "Machine-Architecture",
    "oid": "1.2.840.113556.1.4.68"
  },
  {
    "name": "machinePasswordChangeInterval",
    "cn": "Machine-Password-Change-Interval",
    "oid": "1.2.840.113556.1.4.520"
  },
  {
    "name": "machineRole",
    "cn": "Machine-Role",
    "oid": "1.2.840.113556.1.4.71"
  },
  {
    "name": "machineWidePolicy",
    "cn": "Machine-Wide-Policy",
    "oid": "1.2.840.113556.1.4.459"
  },
  {
    "name": "mail",
    "cn": "E-mail-Addresses",
    "oid": "0.9.2342.19200300.100.1.3"
  },
  {
    "name": "mailAddress",
    "cn": "SMTP-Mail-Address",
    "oid": "1.2.840.113556.1.4.786"
  },
  {
    "name": "managedBy",
    "cn": "Managed-By",
    "oid": "1.2.840.113556.1.4.653"
  },
  {
    "name": "managedObjects",
    "cn": "Managed-Objects",
    "oid": "1.2.840.113556.1.4.654"
  },
  {
    "name": "manager",
    "cn": "Manager",
    "oid": "0.9.2342.19200300.100.1.10"
  },
  {
    "name": "mAPIID",
    "cn": "MAPI-ID",
    "oid": "1.2.840.113556.1.2.49"
  },
  {
    "name": "marshalledInterface",
    "cn": "Marshalled-Interface",
    "oid": "1.2.840.113556.1.4.72"
  },
  {
    "name": "masteredBy",
    "cn": "Mastered-By",
    "oid": "1.2.840.113556.1.4.1409"
  },
  {
    "name": "maxPwdAge",
    "cn": "Max-Pwd-Age",
    "oid": "1.2.840.113556.1.4.74"
  },
  {
    "name": "maxRenewAge",
    "cn": "Max-Renew-Age",
    "oid": "1.2.840.113556.1.4.75"
  },
  {
    "name": "maxStorage",
    "cn": "Max-Storage",
    "oid": "1.2.840.113556.1.4.76"
  },
  {
    "name": "maxTicketAge",
    "cn": "Max-Ticket-Age",
    "oid": "1.2.840.113556.1.4.77"
  },
  {
    "name": "mayContain",
    "cn": "May-Contain",
    "oid": "1.2.840.113556.1.2.25"
  },
  {
    "name": "meetingAdvertiseScope",
    "cn": "meetingAdvertiseScope",
    "oid": "1.2.840.113556.1.4.582"
  },
  {
    "name": "meetingApplication",
    "cn": "meetingApplication",
    "oid": "1.2.840.113556.1.4.573"
  },
  {
    "name": "meetingBandwidth",
    "cn": "meetingBandwidth",
    "oid": "1.2.840.113556.1.4.589"
  },
  {
    "name": "meetingBlob",
    "cn": "meetingBlob",
    "oid": "1.2.840.113556.1.4.590"
  },
  {
    "name": "meetingContactInfo",
    "cn": "meetingContactInfo",
    "oid": "1.2.840.113556.1.4.578"
  },
  {
    "name": "meetingDescription",
    "cn": "meetingDescription",
    "oid": "1.2.840.113556.1.4.567"
  },
  {
    "name": "meetingEndTime",
    "cn": "meetingEndTime",
    "oid": "1.2.840.113556.1.4.588"
  },
  {
    "name": "meetingID",
    "cn": "meetingID",
    "oid": "1.2.840.113556.1.4.565"
  },
  {
    "name": "meetingIP",
    "cn": "meetingIP",
    "oid": "1.2.840.113556.1.4.580"
  },
  {
    "name": "meetingIsEncrypted",
    "cn": "meetingIsEncrypted",
    "oid": "1.2.840.113556.1.4.585"
  },
  {
    "name": "meetingKeyword",
    "cn": "meetingKeyword",
    "oid": "1.2.840.113556.1.4.568"
  },
  {
    "name": "meetingLanguage",
    "cn": "meetingLanguage",
    "oid": "1.2.840.113556.1.4.574"
  },
  {
    "name": "meetingLocation",
    "cn": "meetingLocation",
    "oid": "1.2.840.113556.1.4.569"
  },
  {
    "name": "meetingMaxParticipants",
    "cn": "meetingMaxParticipants",
    "oid": "1.2.840.113556.1.4.576"
  },
  {
    "name": "meetingName",
    "cn": "meetingName",
    "oid": "1.2.840.113556.1.4.566"
  },
  {
    "name": "meetingOriginator",
    "cn": "meetingOriginator",
    "oid": "1.2.840.113556.1.4.577"
  },
  {
    "name": "meetingOwner",
    "cn": "meetingOwner",
    "oid": "1.2.840.113556.1.4.579"
  },
  {
    "name": "meetingProtocol",
    "cn": "meetingProtocol",
    "oid": "1.2.840.113556.1.4.570"
  },
  {
    "name": "meetingRating",
    "cn": "meetingRating",
    "oid": "1.2.840.113556.1.4.584"
  },
  {
    "name": "meetingRecurrence",
    "cn": "meetingRecurrence",
    "oid": "1.2.840.113556.1.4.586"
  },
  {
    "name": "meetingScope",
    "cn": "meetingScope",
    "oid": "1.2.840.113556.1.4.581"
  },
  {
    "name": "meetingStartTime",
    "cn": "meetingStartTime",
    "oid": "1.2.840.113556.1.4.587"
  },
  {
    "name": "meetingType",
    "cn": "meetingType",
    "oid": "1.2.840.113556.1.4.571"
  },
  {
    "name": "meetingURL",
    "cn": "meetingURL",
    "oid": "1.2.840.113556.1.4.583"
  },
  {
    "name": "member",
    "cn": "Member",
    "oid": "2.5.4.31"
  },
  {
    "name": "memberOf",
    "cn": "Is-Member-Of-DL",
    "oid": "1.2.840.113556.1.2.102"
  },
  {
    "name": "mhsORAddress",
    "cn": "MHS-OR-Address",
    "oid": "1.2.840.113556.1.4.650"
  },
  {
    "name": "middleName",
    "cn": "Other-Name",
    "oid": "2.16.840.1.113730.3.1.34"
  },
  {
    "name": "minPwdAge",
    "cn": "Min-Pwd-Age",
    "oid": "1.2.840.113556.1.4.78"
  },
  {
    "name": "minPwdLength",
    "cn": "Min-Pwd-Length",
    "oid": "1.2.840.113556.1.4.79"
  },
  {
    "name": "minTicketAge",
    "cn": "Min-Ticket-Age",
    "oid": "1.2.840.113556.1.4.80"
  },
  {
    "name": "mobile",
    "cn": "Phone-Mobile-Primary",
    "oid": "0.9.2342.19200300.100.1.41"
  },
  {
    "name": "modifiedCount",
    "cn": "Modified-Count",
    "oid": "1.2.840.113556.1.4.168"
  },
  {
    "name": "modifiedCountAtLastProm",
    "cn": "Modified-Count-At-Last-Prom",
    "oid": "1.2.840.113556.1.4.81"
  },
  {
    "name": "modifyTimeStamp",
    "cn": "Modify-Time-Stamp",
    "oid": "2.5.18.2"
  },
  {
    "name": "moniker",
    "cn": "Moniker",
    "oid": "1.2.840.113556.1.4.82"
  },
  {
    "name": "monikerDisplayName",
    "cn": "Moniker-Display-Name",
    "oid": "1.2.840.113556.1.4.83"
  },
  {
    "name": "moveTreeState",
    "cn": "Move-Tree-State",
    "oid": "1.2.840.113556.1.4.1305"
  },
  {
    "name": "mS-DS-ConsistencyChildCount",
    "cn": "MS-DS-Consistency-Child-Count",
    "oid": "1.2.840.113556.1.4.1361"
  },
  {
    "name": "mS-DS-ConsistencyGuid",
    "cn": "MS-DS-Consistency-Guid",
    "oid": "1.2.840.113556.1.4.1360"
  },
  {
    "name": "mS-DS-CreatorSID",
    "cn": "MS-DS-Creator-SID",
    "oid": "1.2.840.113556.1.4.1410"
  },
  {
    "name": "ms-DS-MachineAccountQuota",
    "cn": "MS-DS-Machine-Account-Quota",
    "oid": "1.2.840.113556.1.4.1411"
  },
  {
    "name": "mS-DS-ReplicatesNCReason",
    "cn": "MS-DS-Replicates-NC-Reason",
    "oid": "1.2.840.113556.1.4.1408"
  },
  {
    "name": "mS-SQL-Alias",
    "cn": "MS-SQL-Alias",
    "oid": "1.2.840.113556.1.4.1395"
  },
  {
    "name": "mS-SQL-AllowAnonymousSubscription",
    "cn": "MS-SQL-AllowAnonymousSubscription",
    "oid": "1.2.840.113556.1.4.1394"
  },
  {
    "name": "mS-SQL-AllowImmediateUpdatingSubscription",
    "cn": "MS-SQL-AllowImmediateUpdatingSubscription",
    "oid": "1.2.840.113556.1.4.1404"
  },
  {
    "name": "mS-SQL-AllowKnownPullSubscription",
    "cn": "MS-SQL-AllowKnownPullSubscription",
    "oid": "1.2.840.113556.1.4.1403"
  },
  {
    "name": "mS-SQL-AllowQueuedUpdatingSubscription",
    "cn": "MS-SQL-AllowQueuedUpdatingSubscription",
    "oid": "1.2.840.113556.1.4.1405"
  },
  {
    "name": "mS-SQL-AllowSnapshotFilesFTPDownloading",
    "cn": "MS-SQL-AllowSnapshotFilesFTPDownloading",
    "oid": "1.2.840.113556.1.4.1406"
  },
  {
    "name": "mS-SQL-AppleTalk",
    "cn": "MS-SQL-AppleTalk",
    "oid": "1.2.840.113556.1.4.1378"
  },
  {
    "name": "mS-SQL-Applications",
    "cn": "MS-SQL-Applications",
    "oid": "1.2.840.113556.1.4.1400"
  },
  {
    "name": "mS-SQL-Build",
    "cn": "MS-SQL-Build",
    "oid": "1.2.840.113556.1.4.1368"
  },
  {
    "name": "mS-SQL-CharacterSet",
    "cn": "MS-SQL-CharacterSet",
    "oid": "1.2.840.113556.1.4.1370"
  },
  {
    "name": "mS-SQL-Clustered",
    "cn": "MS-SQL-Clustered",
    "oid": "1.2.840.113556.1.4.1373"
  },
  {
    "name": "mS-SQL-ConnectionURL",
    "cn": "MS-SQL-ConnectionURL",
    "oid": "1.2.840.113556.1.4.1383"
  },
  {
    "name": "mS-SQL-Contact",
    "cn": "MS-SQL-Contact",
    "oid": "1.2.840.113556.1.4.1365"
  },
  {
    "name": "mS-SQL-CreationDate",
    "cn": "MS-SQL-CreationDate",
    "oid": "1.2.840.113556.1.4.1397"
  },
  {
    "name": "mS-SQL-Database",
    "cn": "MS-SQL-Database",
    "oid": "1.2.840.113556.1.4.1393"
  },
  {
    "name": "mS-SQL-Description",
    "cn": "MS-SQL-Description",
    "oid": "1.2.840.113556.1.4.1390"
  },
  {
    "name": "mS-SQL-GPSHeight",
    "cn": "MS-SQL-GPSHeight",
    "oid": "1.2.840.113556.1.4.1387"
  },
  {
    "name": "mS-SQL-GPSLatitude",
    "cn": "MS-SQL-GPSLatitude",
    "oid": "1.2.840.113556.1.4.1385"
  },
  {
    "name": "mS-SQL-GPSLongitude",
    "cn": "MS-SQL-GPSLongitude",
    "oid": "1.2.840.113556.1.4.1386"
  },
  {
    "name": "mS-SQL-InformationDirectory",
    "cn": "MS-SQL-InformationDirectory",
    "oid": "1.2.840.113556.1.4.1392"
  },
  {
    "name": "mS-SQL-InformationURL",
    "cn": "MS-SQL-InformationURL",
    "oid": "1.2.840.113556.1.4.1382"
  },
  {
    "name": "mS-SQL-Keywords",
    "cn": "MS-SQL-Keywords",
    "oid": "1.2.840.113556.1.4.1401"
  },
  {
    "name": "mS-SQL-Language",
    "cn": "MS-SQL-Language",
    "oid": "1.2.840.113556.1.4.1389"
  },
  {
    "name": "mS-SQL-LastBackupDate",
    "cn": "MS-SQL-LastBackupDate",
    "oid": "1.2.840.113556.1.4.1398"
  },
  {
    "name": "mS-SQL-LastDiagnosticDate",
    "cn": "MS-SQL-LastDiagnosticDate",
    "oid": "1.2.840.113556.1.4.1399"
  },
  {
    "name": "mS-SQL-LastUpdatedDate",
    "cn": "MS-SQL-LastUpdatedDate",
    "oid": "1.2.840.113556.1.4.1381"
  },
  {
    "name": "mS-SQL-Location",
    "cn": "MS-SQL-Location",
    "oid": "1.2.840.113556.1.4.1366"
  },
  {
    "name": "mS-SQL-Memory",
    "cn": "MS-SQL-Memory",
    "oid": "1.2.840.113556.1.4.1367"
  },
  {
    "name": "mS-SQL-MultiProtocol",
    "cn": "MS-SQL-MultiProtocol",
    "oid": "1.2.840.113556.1.4.1375"
  },
  {
    "name": "mS-SQL-Name",
    "cn": "MS-SQL-Name",
    "oid": "1.2.840.113556.1.4.1363"
  },
  {
    "name": "mS-SQL-NamedPipe",
    "cn": "MS-SQL-NamedPipe",
    "oid": "1.2.840.113556.1.4.1374"
  },
  {
    "name": "mS-SQL-PublicationURL",
    "cn": "MS-SQL-PublicationURL",
    "oid": "1.2.840.113556.1.4.1384"
  },
  {
    "name": "mS-SQL-Publisher",
    "cn": "MS-SQL-Publisher",
    "oid": "1.2.840.113556.1.4.1402"
  },
  {
    "name": "mS-SQL-RegisteredOwner",
    "cn": "MS-SQL-RegisteredOwner",
    "oid": "1.2.840.113556.1.4.1364"
  },
  {
    "name": "mS-SQL-ServiceAccount",
    "cn": "MS-SQL-ServiceAccount",
    "oid": "1.2.840.113556.1.4.1369"
  },
  {
    "name": "mS-SQL-Size",
    "cn": "MS-SQL-Size",
    "oid": "1.2.840.113556.1.4.1396"
  },
  {
    "name": "mS-SQL-SortOrder",
    "cn": "MS-SQL-SortOrder",
    "oid": "1.2.840.113556.1.4.1371"
  },
  {
    "name": "mS-SQL-SPX",
    "cn": "MS-SQL-SPX",
    "oid": "1.2.840.113556.1.4.1376"
  },
  {
    "name": "mS-SQL-Status",
    "cn": "MS-SQL-Status",
    "oid": "1.2.840.113556.1.4.1380"
  },
  {
    "name": "mS-SQL-TCPIP",
    "cn": "MS-SQL-TCPIP",
    "oid": "1.2.840.113556.1.4.1377"
  },
  {
    "name": "mS-SQL-ThirdParty",
    "cn": "MS-SQL-ThirdParty",
    "oid": "1.2.840.113556.1.4.1407"
  },
  {
    "name": "mS-SQL-Type",
    "cn": "MS-SQL-Type",
    "oid": "1.2.840.113556.1.4.1391"
  },
  {
    "name": "mS-SQL-UnicodeSortOrder",
    "cn": "MS-SQL-UnicodeSortOrder",
    "oid": "1.2.840.113556.1.4.1372"
  },
  {
    "name": "mS-SQL-Version",
    "cn": "MS-SQL-Version",
    "oid": "1.2.840.113556.1.4.1388"
  },
  {
    "name": "mS-SQL-Vines",
    "cn": "MS-SQL-Vines",
    "oid": "1.2.840.113556.1.4.1379"
  },
  {
    "name": "mscopeId",
    "cn": "Mscope-Id",
    "oid": "1.2.840.113556.1.4.716"
  },
  {
    "name": "msiFileList",
    "cn": "Msi-File-List",
    "oid": "1.2.840.113556.1.4.671"
  },
  {
    "name": "msiScript",
    "cn": "Msi-Script",
    "oid": "1.2.840.113556.1.4.814"
  },
  {
    "name": "msiScriptName",
    "cn": "Msi-Script-Name",
    "oid": "1.2.840.113556.1.4.845"
  },
  {
    "name": "msiScriptPath",
    "cn": "Msi-Script-Path",
    "oid": "1.2.840.113556.1.4.15"
  },
  {
    "name": "msiScriptSize",
    "cn": "Msi-Script-Size",
    "oid": "1.2.840.113556.1.4.846"
  },
  {
    "name": "mSMQAuthenticate",
    "cn": "MSMQ-Authenticate",
    "oid": "1.2.840.113556.1.4.923"
  },
  {
    "name": "mSMQBasePriority",
    "cn": "MSMQ-Base-Priority",
    "oid": "1.2.840.113556.1.4.920"
  },
  {
    "name": "mSMQComputerType",
    "cn": "MSMQ-Computer-Type",
    "oid": "1.2.840.113556.1.4.933"
  },
  {
    "name": "mSMQComputerTypeEx",
    "cn": "MSMQ-Computer-Type-Ex",
    "oid": "1.2.840.113556.1.4.1417"
  },
  {
    "name": "mSMQCost",
    "cn": "MSMQ-Cost",
    "oid": "1.2.840.113556.1.4.946"
  },
  {
    "name": "mSMQCSPName",
    "cn": "MSMQ-CSP-Name",
    "oid": "1.2.840.113556.1.4.940"
  },
  {
    "name": "mSMQDependentClientService",
    "cn": "MSMQ-Dependent-Client-Service",
    "oid": "1.2.840.113556.1.4.1239"
  },
  {
    "name": "mSMQDependentClientServices",
    "cn": "MSMQ-Dependent-Client-Services",
    "oid": "1.2.840.113556.1.4.1226"
  },
  {
    "name": "mSMQDigests",
    "cn": "MSMQ-Digests",
    "oid": "1.2.840.113556.1.4.948"
  },
  {
    "name": "mSMQDigestsMig",
    "cn": "MSMQ-Digests-Mig",
    "oid": "1.2.840.113556.1.4.966"
  },
  {
    "name": "mSMQDsService",
    "cn": "MSMQ-Ds-Service",
    "oid": "1.2.840.113556.1.4.1238"
  },
  {
    "name": "mSMQDsServices",
    "cn": "MSMQ-Ds-Services",
    "oid": "1.2.840.113556.1.4.1228"
  },
  {
    "name": "mSMQEncryptKey",
    "cn": "MSMQ-Encrypt-Key",
    "oid": "1.2.840.113556.1.4.936"
  },
  {
    "name": "mSMQForeign",
    "cn": "MSMQ-Foreign",
    "oid": "1.2.840.113556.1.4.934"
  },
  {
    "name": "mSMQInRoutingServers",
    "cn": "MSMQ-In-Routing-Servers",
    "oid": "1.2.840.113556.1.4.929"
  },
  {
    "name": "mSMQInterval1",
    "cn": "MSMQ-Interval1",
    "oid": "1.2.840.113556.1.4.1308"
  },
  {
    "name": "mSMQInterval2",
    "cn": "MSMQ-Interval2",
    "oid": "1.2.840.113556.1.4.1309"
  },
  {
    "name": "mSMQJournal",
    "cn": "MSMQ-Journal",
    "oid": "1.2.840.113556.1.4.918"
  },
  {
    "name": "mSMQJournalQuota",
    "cn": "MSMQ-Journal-Quota",
    "oid": "1.2.840.113556.1.4.921"
  },
  {
    "name": "mSMQLabel",
    "cn": "MSMQ-Label",
    "oid": "1.2.840.113556.1.4.922"
  },
  {
    "name": "mSMQLabelEx",
    "cn": "MSMQ-Label-Ex",
    "oid": "1.2.840.113556.1.4.1415"
  },
  {
    "name": "mSMQLongLived",
    "cn": "MSMQ-Long-Lived",
    "oid": "1.2.840.113556.1.4.941"
  },
  {
    "name": "mSMQMigrated",
    "cn": "MSMQ-Migrated",
    "oid": "1.2.840.113556.1.4.952"
  },
  {
    "name": "mSMQNameStyle",
    "cn": "MSMQ-Name-Style",
    "oid": "1.2.840.113556.1.4.939"
  },
  {
    "name": "mSMQNt4Flags",
    "cn": "MSMQ-Nt4-Flags",
    "oid": "1.2.840.113556.1.4.964"
  },
  {
    "name": "mSMQNt4Stub",
    "cn": "MSMQ-Nt4-Stub",
    "oid": "1.2.840.113556.1.4.960"
  },
  {
    "name": "mSMQOSType",
    "cn": "MSMQ-OS-Type",
    "oid": "1.2.840.113556.1.4.935"
  },
  {
    "name": "mSMQOutRoutingServers",
    "cn": "MSMQ-Out-Routing-Servers",
    "oid": "1.2.840.113556.1.4.928"
  },
  {
    "name": "mSMQOwnerID",
    "cn": "MSMQ-Owner-ID",
    "oid": "1.2.840.113556.1.4.925"
  },
  {
    "name": "mSMQPrevSiteGates",
    "cn": "MSMQ-Prev-Site-Gates",
    "oid": "1.2.840.113556.1.4.1225"
  },
  {
    "name": "mSMQPrivacyLevel",
    "cn": "MSMQ-Privacy-Level",
    "oid": "1.2.840.113556.1.4.924"
  },
  {
    "name": "mSMQQMID",
    "cn": "MSMQ-QM-ID",
    "oid": "1.2.840.113556.1.4.951"
  },
  {
    "name": "mSMQQueueJournalQuota",
    "cn": "MSMQ-Queue-Journal-Quota",
    "oid": "1.2.840.113556.1.4.963"
  },
  {
    "name": "mSMQQueueNameExt",
    "cn": "MSMQ-Queue-Name-Ext",
    "oid": "1.2.840.113556.1.4.1243"
  },
  {
    "name": "mSMQQueueQuota",
    "cn": "MSMQ-Queue-Quota",
    "oid": "1.2.840.113556.1.4.962"
  },
  {
    "name": "mSMQQueueType",
    "cn": "MSMQ-Queue-Type",
    "oid": "1.2.840.113556.1.4.917"
  },
  {
    "name": "mSMQQuota",
    "cn": "MSMQ-Quota",
    "oid": "1.2.840.113556.1.4.919"
  },
  {
    "name": "mSMQRoutingService",
    "cn": "MSMQ-Routing-Service",
    "oid": "1.2.840.113556.1.4.1237"
  },
  {
    "name": "mSMQRoutingServices",
    "cn": "MSMQ-Routing-Services",
    "oid": "1.2.840.113556.1.4.1227"
  },
  {
    "name": "mSMQServices",
    "cn": "MSMQ-Services",
    "oid": "1.2.840.113556.1.4.950"
  },
  {
    "name": "mSMQServiceType",
    "cn": "MSMQ-Service-Type",
    "oid": "1.2.840.113556.1.4.930"
  },
  {
    "name": "mSMQSignCertificates",
    "cn": "MSMQ-Sign-Certificates",
    "oid": "1.2.840.113556.1.4.947"
  },
  {
    "name": "mSMQSignCertificatesMig",
    "cn": "MSMQ-Sign-Certificates-Mig",
    "oid": "1.2.840.113556.1.4.967"
  },
  {
    "name": "mSMQSignKey",
    "cn": "MSMQ-Sign-Key",
    "oid": "1.2.840.113556.1.4.937"
  },
  {
    "name": "mSMQSite1",
    "cn": "MSMQ-Site-1",
    "oid": "1.2.840.113556.1.4.943"
  },
  {
    "name": "mSMQSite2",
    "cn": "MSMQ-Site-2",
    "oid": "1.2.840.113556.1.4.944"
  },
  {
    "name": "mSMQSiteForeign",
    "cn": "MSMQ-Site-Foreign",
    "oid": "1.2.840.113556.1.4.961"
  },
  {
    "name": "mSMQSiteGates",
    "cn": "MSMQ-Site-Gates",
    "oid": "1.2.840.113556.1.4.945"
  },
  {
    "name": "mSMQSiteGatesMig",
    "cn": "MSMQ-Site-Gates-Mig",
    "oid": "1.2.840.113556.1.4.1310"
  },
  {
    "name": "mSMQSiteID",
    "cn": "MSMQ-Site-ID",
    "oid": "1.2.840.113556.1.4.953"
  },
  {
    "name": "mSMQSiteName",
    "cn": "MSMQ-Site-Name",
    "oid": "1.2.840.113556.1.4.965"
  },
  {
    "name": "mSMQSiteNameEx",
    "cn": "MSMQ-Site-Name-Ex",
    "oid": "1.2.840.113556.1.4.1416"
  },
  {
    "name": "mSMQSites",
    "cn": "MSMQ-Sites",
    "oid": "1.2.840.113556.1.4.927"
  },
  {
    "name": "mSMQTransactional",
    "cn": "MSMQ-Transactional",
    "oid": "1.2.840.113556.1.4.926"
  },
  {
    "name": "mSMQUserSid",
    "cn": "MSMQ-User-Sid",
    "oid": "1.2.840.113556.1.4.1337"
  },
  {
    "name": "mSMQVersion",
    "cn": "MSMQ-Version",
    "oid": "1.2.840.113556.1.4.942"
  },
  {
    "name": "msNPAllowDialin",
    "cn": "msNPAllowDialin",
    "oid": "1.2.840.113556.1.4.1119"
  },
  {
    "name": "msNPCalledStationID",
    "cn": "msNPCalledStationID",
    "oid": "1.2.840.113556.1.4.1123"
  },
  {
    "name": "msNPCallingStationID",
    "cn": "msNPCallingStationID",
    "oid": "1.2.840.113556.1.4.1124"
  },
  {
    "name": "msNPSavedCallingStationID",
    "cn": "msNPSavedCallingStationID",
    "oid": "1.2.840.113556.1.4.1130"
  },
  {
    "name": "msRADIUSCallbackNumber",
    "cn": "msRADIUSCallbackNumber",
    "oid": "1.2.840.113556.1.4.1145"
  },
  {
    "name": "msRADIUSFramedIPAddress",
    "cn": "msRADIUSFramedIPAddress",
    "oid": "1.2.840.113556.1.4.1153"
  },
  {
    "name": "msRADIUSFramedRoute",
    "cn": "msRADIUSFramedRoute",
    "oid": "1.2.840.113556.1.4.1158"
  },
  {
    "name": "msRADIUSServiceType",
    "cn": "msRADIUSServiceType",
    "oid": "1.2.840.113556.1.4.1171"
  },
  {
    "name": "msRASSavedCallbackNumber",
    "cn": "msRASSavedCallbackNumber",
    "oid": "1.2.840.113556.1.4.1189"
  },
  {
    "name": "msRASSavedFramedIPAddress",
    "cn": "msRASSavedFramedIPAddress",
    "oid": "1.2.840.113556.1.4.1190"
  },
  {
    "name": "msRASSavedFramedRoute",
    "cn": "msRASSavedFramedRoute",
    "oid": "1.2.840.113556.1.4.1191"
  },
  {
    "name": "msRRASAttribute",
    "cn": "ms-RRAS-Attribute",
    "oid": "1.2.840.113556.1.4.884"
  },
  {
    "name": "msRRASVendorAttributeEntry",
    "cn": "ms-RRAS-Vendor-Attribute-Entry",
    "oid": "1.2.840.113556.1.4.883"
  },
  {
    "name": "mustContain",
    "cn": "Must-Contain",
    "oid": "1.2.840.113556.1.2.24"
  },
  {
    "name": "name",
    "cn": "RDN",
    "oid": "1.2.840.113556.1.4.1"
  },
  {
    "name": "nameServiceFlags",
    "cn": "Name-Service-Flags",
    "oid": "1.2.840.113556.1.4.753"
  },
  {
    "name": "nCName",
    "cn": "NC-Name",
    "oid": "1.2.840.113556.1.2.16"
  },
  {
    "name": "nETBIOSName",
    "cn": "NETBIOS-Name",
    "oid": "1.2.840.113556.1.4.87"
  },
  {
    "name": "netbootAllowNewClients",
    "cn": "netboot-Allow-New-Clients",
    "oid": "1.2.840.113556.1.4.849"
  },
  {
    "name": "netbootAnswerOnlyValidClients",
    "cn": "netboot-Answer-Only-Valid-Clients",
    "oid": "1.2.840.113556.1.4.854"
  },
  {
    "name": "netbootAnswerRequests",
    "cn": "netboot-Answer-Requests",
    "oid": "1.2.840.113556.1.4.853"
  },
  {
    "name": "netbootCurrentClientCount",
    "cn": "netboot-Current-Client-Count",
    "oid": "1.2.840.113556.1.4.852"
  },
  {
    "name": "netbootGUID",
    "cn": "Netboot-GUID",
    "oid": "1.2.840.113556.1.4.359"
  },
  {
    "name": "netbootInitialization",
    "cn": "Netboot-Initialization",
    "oid": "1.2.840.113556.1.4.358"
  },
  {
    "name": "netbootIntelliMirrorOSes",
    "cn": "netboot-IntelliMirror-OSes",
    "oid": "1.2.840.113556.1.4.857"
  },
  {
    "name": "netbootLimitClients",
    "cn": "netboot-Limit-Clients",
    "oid": "1.2.840.113556.1.4.850"
  },
  {
    "name": "netbootLocallyInstalledOSes",
    "cn": "netboot-Locally-Installed-OSes",
    "oid": "1.2.840.113556.1.4.859"
  },
  {
    "name": "netbootMachineFilePath",
    "cn": "Netboot-Machine-File-Path",
    "oid": "1.2.840.113556.1.4.361"
  },
  {
    "name": "netbootMaxClients",
    "cn": "netboot-Max-Clients",
    "oid": "1.2.840.113556.1.4.851"
  },
  {
    "name": "netbootMirrorDataFile",
    "cn": "Netboot-Mirror-Data-File",
    "oid": "1.2.840.113556.1.4.1241"
  },
  {
    "name": "netbootNewMachineNamingPolicy",
    "cn": "netboot-New-Machine-Naming-Policy",
    "oid": "1.2.840.113556.1.4.855"
  },
  {
    "name": "netbootNewMachineOU",
    "cn": "netboot-New-Machine-OU",
    "oid": "1.2.840.113556.1.4.856"
  },
  {
    "name": "netbootSCPBL",
    "cn": "netboot-SCP-BL",
    "oid": "1.2.840.113556.1.4.864"
  },
  {
    "name": "netbootServer",
    "cn": "netboot-Server",
    "oid": "1.2.840.113556.1.4.860"
  },
  {
    "name": "netbootSIFFile",
    "cn": "Netboot-SIF-File",
    "oid": "1.2.840.113556.1.4.1240"
  },
  {
    "name": "netbootTools",
    "cn": "netboot-Tools",
    "oid": "1.2.840.113556.1.4.858"
  },
  {
    "name": "networkAddress",
    "cn": "Network-Address",
    "oid": "1.2.840.113556.1.2.459"
  },
  {
    "name": "nextLevelStore",
    "cn": "Next-Level-Store",
    "oid": "1.2.840.113556.1.4.214"
  },
  {
    "name": "nextRid",
    "cn": "Next-Rid",
    "oid": "1.2.840.113556.1.4.88"
  },
  {
    "name": "nonSecurityMember",
    "cn": "Non-Security-Member",
    "oid": "1.2.840.113556.1.4.530"
  },
  {
    "name": "nonSecurityMemberBL",
    "cn": "Non-Security-Member-BL",
    "oid": "1.2.840.113556.1.4.531"
  },
  {
    "name": "notes",
    "cn": "Additional-Information",
    "oid": "1.2.840.113556.1.4.265"
  },
  {
    "name": "notificationList",
    "cn": "Notification-List",
    "oid": "1.2.840.113556.1.4.303"
  },
  {
    "name": "nTGroupMembers",
    "cn": "NT-Group-Members",
    "oid": "1.2.840.113556.1.4.89"
  },
  {
    "name": "nTMixedDomain",
    "cn": "NT-Mixed-Domain",
    "oid": "1.2.840.113556.1.4.357"
  },
  {
    "name": "ntPwdHistory",
    "cn": "Nt-Pwd-History",
    "oid": "1.2.840.113556.1.4.94"
  },
  {
    "name": "nTSecurityDescriptor",
    "cn": "NT-Security-Descriptor",
    "oid": "1.2.840.113556.1.2.281"
  },
  {
    "name": "o",
    "cn": "Organization-Name",
    "oid": "2.5.4.10"
  },
  {
    "name": "objectCategory",
    "cn": "Object-Category",
    "oid": "1.2.840.113556.1.4.782"
  },
  {
    "name": "objectClass",
    "cn": "Object-Class",
    "oid": "2.5.4.0"
  },
  {
    "name": "objectClassCategory",
    "cn": "Object-Class-Category",
    "oid": "1.2.840.113556.1.2.370"
  },
  {
    "name": "objectClasses",
    "cn": "Object-Classes",
    "oid": "2.5.21.6"
  },
  {
    "name": "objectCount",
    "cn": "Object-Count",
    "oid": "1.2.840.113556.1.4.506"
  },
  {
    "name": "objectGUID",
    "cn": "Object-Guid",
    "oid": "1.2.840.113556.1.4.2"
  },
  {
    "name": "objectSid",
    "cn": "Object-Sid",
    "oid": "1.2.840.113556.1.4.146"
  },
  {
    "name": "objectVersion",
    "cn": "Object-Version",
    "oid": "1.2.840.113556.1.2.76"
  },
  {
    "name": "oEMInformation",
    "cn": "OEM-Information",
    "oid": "1.2.840.113556.1.4.151"
  },
  {
    "name": "oMObjectClass",
    "cn": "OM-Object-Class",
    "oid": "1.2.840.113556.1.2.218"
  },
  {
    "name": "oMSyntax",
    "cn": "OM-Syntax",
    "oid": "1.2.840.113556.1.2.231"
  },
  {
    "name": "oMTGuid",
    "cn": "OMT-Guid",
    "oid": "1.2.840.113556.1.4.505"
  },
  {
    "name": "oMTIndxGuid",
    "cn": "OMT-Indx-Guid",
    "oid": "1.2.840.113556.1.4.333"
  },
  {
    "name": "operatingSystem",
    "cn": "Operating-System",
    "oid": "1.2.840.113556.1.4.363"
  },
  {
    "name": "operatingSystemHotfix",
    "cn": "Operating-System-Hotfix",
    "oid": "1.2.840.113556.1.4.415"
  },
  {
    "name": "operatingSystemServicePack",
    "cn": "Operating-System-Service-Pack",
    "oid": "1.2.840.113556.1.4.365"
  },
  {
    "name": "operatingSystemVersion",
    "cn": "Operating-System-Version",
    "oid": "1.2.840.113556.1.4.364"
  },
  {
    "name": "operatorCount",
    "cn": "Operator-Count",
    "oid": "1.2.840.113556.1.4.144"
  },
  {
    "name": "optionDescription",
    "cn": "Option-Description",
    "oid": "1.2.840.113556.1.4.712"
  },
  {
    "name": "options",
    "cn": "Options",
    "oid": "1.2.840.113556.1.4.307"
  },
  {
    "name": "optionsLocation",
    "cn": "Options-Location",
    "oid": "1.2.840.113556.1.4.713"
  },
  {
    "name": "originalDisplayTable",
    "cn": "Original-Display-Table",
    "oid": "1.2.840.113556.1.2.445"
  },
  {
    "name": "originalDisplayTableMSDOS",
    "cn": "Original-Display-Table-MSDOS",
    "oid": "1.2.840.113556.1.2.214"
  },
  {
    "name": "otherFacsimileTelephoneNumber",
    "cn": "Phone-Fax-Other",
    "oid": "1.2.840.113556.1.4.646"
  },
  {
    "name": "otherHomePhone",
    "cn": "Phone-Home-Other",
    "oid": "1.2.840.113556.1.2.277"
  },
  {
    "name": "otherIpPhone",
    "cn": "Phone-Ip-Other",
    "oid": "1.2.840.113556.1.4.722"
  },
  {
    "name": "otherLoginWorkstations",
    "cn": "Other-Login-Workstations",
    "oid": "1.2.840.113556.1.4.91"
  },
  {
    "name": "otherMailbox",
    "cn": "Other-Mailbox",
    "oid": "1.2.840.113556.1.4.651"
  },
  {
    "name": "otherMobile",
    "cn": "Phone-Mobile-Other",
    "oid": "1.2.840.113556.1.4.647"
  },
  {
    "name": "otherPager",
    "cn": "Phone-Pager-Other",
    "oid": "1.2.840.113556.1.2.118"
  },
  {
    "name": "otherTelephone",
    "cn": "Phone-Office-Other",
    "oid": "1.2.840.113556.1.2.18"
  },
  {
    "name": "otherWellKnownObjects",
    "cn": "Other-Well-Known-Objects",
    "oid": "1.2.840.113556.1.4.1359"
  },
  {
    "name": "ou",
    "cn": "Organizational-Unit-Name",
    "oid": "2.5.4.11"
  },
  {
    "name": "owner",
    "cn": "Owner",
    "oid": "2.5.4.32"
  },
  {
    "name": "packageFlags",
    "cn": "Package-Flags",
    "oid": "1.2.840.113556.1.4.327"
  },
  {
    "name": "packageName",
    "cn": "Package-Name",
    "oid": "1.2.840.113556.1.4.326"
  },
  {
    "name": "packageType",
    "cn": "Package-Type",
    "oid": "1.2.840.113556.1.4.324"
  },
  {
    "name": "pager",
    "cn": "Phone-Pager-Primary",
    "oid": "0.9.2342.19200300.100.1.42"
  },
  {
    "name": "parentCA",
    "cn": "Parent-CA",
    "oid": "1.2.840.113556.1.4.557"
  },
  {
    "name": "parentCACertificateChain",
    "cn": "Parent-CA-Certificate-Chain",
    "oid": "1.2.840.113556.1.4.685"
  },
  {
    "name": "parentGUID",
    "cn": "Parent-GUID",
    "oid": "1.2.840.113556.1.4.1224"
  },
  {
    "name": "partialAttributeDeletionList",
    "cn": "Partial-Attribute-Deletion-List",
    "oid": "1.2.840.113556.1.4.663"
  },
  {
    "name": "partialAttributeSet",
    "cn": "Partial-Attribute-Set",
    "oid": "1.2.840.113556.1.4.640"
  },
  {
    "name": "pekKeyChangeInterval",
    "cn": "Pek-Key-Change-Interval",
    "oid": "1.2.840.113556.1.4.866"
  },
  {
    "name": "pekList",
    "cn": "Pek-List",
    "oid": "1.2.840.113556.1.4.865"
  },
  {
    "name": "pendingCACertificates",
    "cn": "Pending-CA-Certificates",
    "oid": "1.2.840.113556.1.4.693"
  },
  {
    "name": "pendingParentCA",
    "cn": "Pending-Parent-CA",
    "oid": "1.2.840.113556.1.4.695"
  },
  {
    "name": "perMsgDialogDisplayTable",
    "cn": "Per-Msg-Dialog-Display-Table",
    "oid": "1.2.840.113556.1.2.325"
  },
  {
    "name": "perRecipDialogDisplayTable",
    "cn": "Per-Recip-Dialog-Display-Table",
    "oid": "1.2.840.113556.1.2.326"
  },
  {
    "name": "personalTitle",
    "cn": "Personal-Title",
    "oid": "1.2.840.113556.1.2.615"
  },
  {
    "name": "physicalDeliveryOfficeName",
    "cn": "Physical-Delivery-Office-Name",
    "oid": "2.5.4.19"
  },
  {
    "name": "physicalLocationObject",
    "cn": "Physical-Location-Object",
    "oid": "1.2.840.113556.1.4.514"
  },
  {
    "name": "pKICriticalExtensions",
    "cn": "PKI-Critical-Extensions",
    "oid": "1.2.840.113556.1.4.1330"
  },
  {
    "name": "pKIDefaultCSPs",
    "cn": "PKI-Default-CSPs",
    "oid": "1.2.840.113556.1.4.1334"
  },
  {
    "name": "pKIDefaultKeySpec",
    "cn": "PKI-Default-Key-Spec",
    "oid": "1.2.840.113556.1.4.1327"
  },
  {
    "name": "pKIEnrollmentAccess",
    "cn": "PKI-Enrollment-Access",
    "oid": "1.2.840.113556.1.4.1335"
  },
  {
    "name": "pKIExpirationPeriod",
    "cn": "PKI-Expiration-Period",
    "oid": "1.2.840.113556.1.4.1331"
  },
  {
    "name": "pKIExtendedKeyUsage",
    "cn": "PKI-Extended-Key-Usage",
    "oid": "1.2.840.113556.1.4.1333"
  },
  {
    "name": "pKIKeyUsage",
    "cn": "PKI-Key-Usage",
    "oid": "1.2.840.113556.1.4.1328"
  },
  {
    "name": "pKIMaxIssuingDepth",
    "cn": "PKI-Max-Issuing-Depth",
    "oid": "1.2.840.113556.1.4.1329"
  },
  {
    "name": "pKIOverlapPeriod",
    "cn": "PKI-Overlap-Period",
    "oid": "1.2.840.113556.1.4.1332"
  },
  {
    "name": "pKT",
    "cn": "PKT",
    "oid": "1.2.840.113556.1.4.206"
  },
  {
    "name": "pKTGuid",
    "cn": "PKT-Guid",
    "oid": "1.2.840.113556.1.4.205"
  },
  {
    "name": "policyReplicationFlags",
    "cn": "Policy-Replication-Flags",
    "oid": "1.2.840.113556.1.4.633"
  },
  {
    "name": "portName",
    "cn": "Port-Name",
    "oid": "1.2.840.113556.1.4.228"
  },
  {
    "name": "possibleInferiors",
    "cn": "Possible-Inferiors",
    "oid": "1.2.840.113556.1.4.915"
  },
  {
    "name": "possSuperiors",
    "cn": "Poss-Superiors",
    "oid": "1.2.840.113556.1.2.8"
  },
  {
    "name": "postalAddress",
    "cn": "Postal-Address",
    "oid": "2.5.4.16"
  },
  {
    "name": "postalCode",
    "cn": "Postal-Code",
    "oid": "2.5.4.17"
  },
  {
    "name": "postOfficeBox",
    "cn": "Post-Office-Box",
    "oid": "2.5.4.18"
  },
  {
    "name": "preferredDeliveryMethod",
    "cn": "Preferred-Delivery-Method",
    "oid": "2.5.4.28"
  },
  {
    "name": "preferredOU",
    "cn": "Preferred-OU",
    "oid": "1.2.840.113556.1.4.97"
  },
  {
    "name": "prefixMap",
    "cn": "Prefix-Map",
    "oid": "1.2.840.113556.1.4.538"
  },
  {
    "name": "presentationAddress",
    "cn": "Presentation-Address",
    "oid": "2.5.4.29"
  },
  {
    "name": "previousCACertificates",
    "cn": "Previous-CA-Certificates",
    "oid": "1.2.840.113556.1.4.692"
  },
  {
    "name": "previousParentCA",
    "cn": "Previous-Parent-CA",
    "oid": "1.2.840.113556.1.4.694"
  },
  {
    "name": "primaryGroupID",
    "cn": "Primary-Group-ID",
    "oid": "1.2.840.113556.1.4.98"
  },
  {
    "name": "primaryGroupToken",
    "cn": "Primary-Group-Token",
    "oid": "1.2.840.113556.1.4.1412"
  },
  {
    "name": "primaryInternationalISDNNumber",
    "cn": "Phone-ISDN-Primary",
    "oid": "1.2.840.113556.1.4.649"
  },
  {
    "name": "primaryTelexNumber",
    "cn": "Telex-Primary",
    "oid": "1.2.840.113556.1.4.648"
  },
  {
    "name": "printAttributes",
    "cn": "Print-Attributes",
    "oid": "1.2.840.113556.1.4.247"
  },
  {
    "name": "printBinNames",
    "cn": "Print-Bin-Names",
    "oid": "1.2.840.113556.1.4.237"
  },
  {
    "name": "printCollate",
    "cn": "Print-Collate",
    "oid": "1.2.840.113556.1.4.242"
  },
  {
    "name": "printColor",
    "cn": "Print-Color",
    "oid": "1.2.840.113556.1.4.243"
  },
  {
    "name": "printDuplexSupported",
    "cn": "Print-Duplex-Supported",
    "oid": "1.2.840.113556.1.4.1311"
  },
  {
    "name": "printEndTime",
    "cn": "Print-End-Time",
    "oid": "1.2.840.113556.1.4.234"
  },
  {
    "name": "printerName",
    "cn": "Printer-Name",
    "oid": "1.2.840.113556.1.4.300"
  },
  {
    "name": "printFormName",
    "cn": "Print-Form-Name",
    "oid": "1.2.840.113556.1.4.235"
  },
  {
    "name": "printKeepPrintedJobs",
    "cn": "Print-Keep-Printed-Jobs",
    "oid": "1.2.840.113556.1.4.275"
  },
  {
    "name": "printLanguage",
    "cn": "Print-Language",
    "oid": "1.2.840.113556.1.4.246"
  },
  {
    "name": "printMACAddress",
    "cn": "Print-MAC-Address",
    "oid": "1.2.840.113556.1.4.288"
  },
  {
    "name": "printMaxCopies",
    "cn": "Print-Max-Copies",
    "oid": "1.2.840.113556.1.4.241"
  },
  {
    "name": "printMaxResolutionSupported",
    "cn": "Print-Max-Resolution-Supported",
    "oid": "1.2.840.113556.1.4.238"
  },
  {
    "name": "printMaxXExtent",
    "cn": "Print-Max-X-Extent",
    "oid": "1.2.840.113556.1.4.277"
  },
  {
    "name": "printMaxYExtent",
    "cn": "Print-Max-Y-Extent",
    "oid": "1.2.840.113556.1.4.278"
  },
  {
    "name": "printMediaReady",
    "cn": "Print-Media-Ready",
    "oid": "1.2.840.113556.1.4.289"
  },
  {
    "name": "printMediaSupported",
    "cn": "Print-Media-Supported",
    "oid": "1.2.840.113556.1.4.299"
  },
  {
    "name": "printMemory",
    "cn": "Print-Memory",
    "oid": "1.2.840.113556.1.4.282"
  },
  {
    "name": "printMinXExtent",
    "cn": "Print-Min-X-Extent",
    "oid": "1.2.840.113556.1.4.279"
  },
  {
    "name": "printMinYExtent",
    "cn": "Print-Min-Y-Extent",
    "oid": "1.2.840.113556.1.4.280"
  },
  {
    "name": "printNetworkAddress",
    "cn": "Print-Network-Address",
    "oid": "1.2.840.113556.1.4.287"
  },
  {
    "name": "printNotify",
    "cn": "Print-Notify",
    "oid": "1.2.840.113556.1.4.272"
  },
  {
    "name": "printNumberUp",
    "cn": "Print-Number-Up",
    "oid": "1.2.840.113556.1.4.290"
  },
  {
    "name": "printOrientationsSupported",
    "cn": "Print-Orientations-Supported",
    "oid": "1.2.840.113556.1.4.240"
  },
  {
    "name": "printOwner",
    "cn": "Print-Owner",
    "oid": "1.2.840.113556.1.4.271"
  },
  {
    "name": "printPagesPerMinute",
    "cn": "Print-Pages-Per-Minute",
    "oid": "1.2.840.113556.1.4.631"
  },
  {
    "name": "printRate",
    "cn": "Print-Rate",
    "oid": "1.2.840.113556.1.4.285"
  },
  {
    "name": "printRateUnit",
    "cn": "Print-Rate-Unit",
    "oid": "1.2.840.113556.1.4.286"
  },
  {
    "name": "printSeparatorFile",
    "cn": "Print-Separator-File",
    "oid": "1.2.840.113556.1.4.230"
  },
  {
    "name": "printShareName",
    "cn": "Print-Share-Name",
    "oid": "1.2.840.113556.1.4.270"
  },
  {
    "name": "printSpooling",
    "cn": "Print-Spooling",
    "oid": "1.2.840.113556.1.4.274"
  },
  {
    "name": "printStaplingSupported",
    "cn": "Print-Stapling-Supported",
    "oid": "1.2.840.113556.1.4.281"
  },
  {
    "name": "printStartTime",
    "cn": "Print-Start-Time",
    "oid": "1.2.840.113556.1.4.233"
  },
  {
    "name": "printStatus",
    "cn": "Print-Status",
    "oid": "1.2.840.113556.1.4.273"
  },
  {
    "name": "priority",
    "cn": "Priority",
    "oid": "1.2.840.113556.1.4.231"
  },
  {
    "name": "priorSetTime",
    "cn": "Prior-Set-Time",
    "oid": "1.2.840.113556.1.4.99"
  },
  {
    "name": "priorValue",
    "cn": "Prior-Value",
    "oid": "1.2.840.113556.1.4.100"
  },
  {
    "name": "pwdLastSet",
    "cn": "",
    "oid": "1.2.840.113556.1.4.96"
  },
  {
    "name": "sAMAccountName",
    "cn": "",
    "oid": "1.2.840.113556.1.4.221"
  },
  {
    "name": "sAMAccountType",
    "cn": "",
    "oid": "1.2.840.113556.1.4.302"
  },
  {
    "name": "servicePrincipalName",
    "cn": "",
    "oid": "1.2.840.113556.1.4.771"
  },
  {
    "name": "sn",
    "cn": "",
    "oid": "2.5.4.4"
  },
  {
    "name": "title",
    "cn": "",
    "oid": "2.5.4.12"
  },
  {
    "name": "userAccountControl",
    "cn": "",
    "oid": "1.2.840.113556.1.4.8"
  },
  {
    "name": "userPrincipalName",
    "cn": "",
    "oid": "1.2.840.113556.1.4.656"
  },
  {
    "name": "whenChanged",
    "cn": "",
    "oid": "1.2.840.113556.1.2.3"
  },
  {
    "name": "whenCreated",
    "cn": "",
    "oid": "1.2.840.113556.1.2.2"
  }
];

// Offensively-relevant AD attributes (delegation, trusts, AD CS, shadow
// credentials, Kerberos) that are not in the base table. Merged with
// case-insensitive de-duplication so the catalog stays unique.
const OFFENSIVE_ATTRIBUTES = [
  { name: "sIDHistory", cn: "SID-History", oid: "1.2.840.113556.1.4.609" },
  { name: "msDS-KeyCredentialLink", cn: "ms-DS-Key-Credential-Link", oid: "1.2.840.113556.1.4.2328" },
  { name: "msDS-AllowedToDelegateTo", cn: "ms-DS-Allowed-To-Delegate-To", oid: "1.2.840.113556.1.4.1787" },
  { name: "msDS-AllowedToActOnBehalfOfOtherIdentity", cn: "ms-DS-Allowed-To-Act-On-Behalf-Of-Other-Identity", oid: "1.2.840.113556.1.4.2182" },
  { name: "msDS-SupportedEncryptionTypes", cn: "ms-DS-Supported-Encryption-Types", oid: "1.2.840.113556.1.4.1963" },
  { name: "msDS-GroupMSAMembership", cn: "ms-DS-GroupMSAMembership", oid: "1.2.840.113556.1.4.2070" },
  { name: "trustAttributes", cn: "Trust-Attributes", oid: "1.2.840.113556.1.4.470" },
  { name: "trustDirection", cn: "Trust-Direction", oid: "1.2.840.113556.1.4.469" },
  { name: "trustPartner", cn: "Trust-Partner", oid: "1.2.840.113556.1.4.471" },
  { name: "trustType", cn: "Trust-Type", oid: "1.2.840.113556.1.4.467" },
  { name: "msPKI-Certificate-Name-Flag", cn: "ms-PKI-Certificate-Name-Flag", oid: "1.2.840.113556.1.4.1432" },
  { name: "msPKI-Enrollment-Flag", cn: "ms-PKI-Enrollment-Flag", oid: "1.2.840.113556.1.4.1430" },
  { name: "msPKI-RA-Signature", cn: "ms-PKI-RA-Signature", oid: "1.2.840.113556.1.4.1429" }
];
(function () {
  const seen = new Set(AD_ATTRIBUTES.map(a => a.name.toLowerCase()));
  for (const attr of OFFENSIVE_ATTRIBUTES) {
    if (!seen.has(attr.name.toLowerCase())) { AD_ATTRIBUTES.push(attr); seen.add(attr.name.toLowerCase()); }
  }
})();
if (typeof module !== "undefined" && module.exports) module.exports = AD_ATTRIBUTES;
