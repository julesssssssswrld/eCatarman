/* ==========================================================================
   eCatarman — Centralized Data Store & Request Tracking System
   Shared data layer connecting Citizen Portal ↔ Admin Dashboard
   ========================================================================== */

const eCatarman = (function () {
  "use strict";

  /* ====================================================================
     DEPARTMENT DATA
     ==================================================================== */
  const departments = [
    {
      id: "mayor",
      name: "Office of the Municipal Mayor",
      shortName: "Mayor's Office",
      email: "mayor@catarman.gov.ph",
      phone: "09158368555",
      landline: "(055) 500-0712",
      head: "Mayor Francisco Aurelio E. Rosales III",
      icon: "building",
      color: "teal",
    },
    {
      id: "vice-mayor",
      name: "Office of the Vice Mayor",
      shortName: "Vice Mayor's Office",
      email: "vicemayor@catarman.gov.ph",
      phone: "",
      landline: "",
      head: "",
      icon: "building",
      color: "blue",
    },
    {
      id: "treasurer",
      name: "Municipal Treasurer's Office",
      shortName: "MTO",
      email: "treasury@catarman.gov.ph",
      phone: "09166324293",
      landline: "",
      head: "",
      icon: "building",
      color: "emerald",
    },
    {
      id: "assessor",
      name: "Municipal Assessor's Office",
      shortName: "MASSO",
      email: "assessor@catarman.gov.ph",
      phone: "09568393140",
      landline: "",
      head: "",
      icon: "building",
      color: "purple",
    },
    {
      id: "bplo",
      name: "Business Permit & Licensing Office",
      shortName: "BPLO",
      email: "bplo@catarman.gov.ph",
      phone: "09202950169",
      landline: "",
      head: "",
      icon: "briefcase",
      color: "amber",
    },
    {
      id: "civil-registry",
      name: "Civil Registry Office",
      shortName: "CRO",
      email: "civilregistry@catarman.gov.ph",
      phone: "",
      landline: "",
      head: "",
      icon: "fileBadge",
      color: "rose",
    },
    {
      id: "menro",
      name: "Municipal Environment & Natural Resources Office",
      shortName: "MENRO",
      email: "menro@catarman.gov.ph",
      phone: "09159842836",
      landline: "",
      head: "",
      icon: "building",
      color: "emerald",
    },
    {
      id: "obo",
      name: "Office of the Building Official",
      shortName: "OBO",
      email: "obo@catarman.gov.ph",
      phone: "",
      landline: "",
      head: "",
      icon: "building",
      color: "indigo",
    },
    {
      id: "zoning",
      name: "Zoning Office",
      shortName: "Zoning",
      email: "zoning@catarman.gov.ph",
      phone: "",
      landline: "",
      head: "",
      icon: "building",
      color: "blue",
    },
  ];

  /* ====================================================================
     CONTACT DIRECTORY
     ==================================================================== */
  const contacts = [
    { office: "Office of the Municipal Mayor", phone: "09158368555", landline: "(055) 500-0712" },
    { office: "Business Permit and Licensing Office (BPLO)", phone: "09202950169", landline: "" },
    { office: "Municipal Agriculture Office (MAO)", phone: "09560646632", landline: "" },
    { office: "Municipal Budget Office (MBO)", phone: "09176324409", landline: "(055) 500-2120" },
    { office: "Municipal HR Management & Development (MHRMDO)", phone: "09155385532", landline: "(055) 500-1224" },
    { office: "Municipal Planning & Development (MPDO)", phone: "09278947484", landline: "(055) 500-1192" },
    { office: "Municipal Environment & Natural Resources (MENRO)", phone: "09159842836", landline: "" },
    { office: "Local Economic Enterprise Office (LEE)", phone: "09176573352", landline: "" },
    { office: "Municipal Health Office (MHO)", phone: "09988640155", landline: "" },
    { office: "Municipal Engineering Office (MEO)", phone: "09563060373", landline: "(055) 500-0713" },
    { office: "Municipal Treasurer's Office (MTO)", phone: "09166324293", landline: "" },
    { office: "Municipal Assessor's Office (MASSO)", phone: "09568393140", landline: "" },
  ];

  /* ====================================================================
     SERVICE MODULES (The 6 core LGU services)
     ==================================================================== */
  const services = [
    {
      id: "cedula",
      name: "Cedula",
      department: "treasurer",
      icon: "fileText",
      color: "teal",
      tag: "Online",
      description: "Community Tax Certificate (CTC) issuance for individuals and businesses.",
      subServices: ["Issuance of Cedula"],
      fields: [
        { name: "_section_applicant", label: "Applicant Information", type: "section" },
        { name: "taxGroupType", label: "Tax Group Type", type: "select", options: ["Individual", "Corporation", "Juridical"], required: true },
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
        { name: "placeOfBirth", label: "Place of Birth", type: "text", required: true },
        { name: "civilStatus", label: "Civil Status", type: "select", options: ["Single", "Married", "Widowed", "Separated"], required: true },
        { name: "sex", label: "Sex", type: "select", options: ["Male", "Female"], required: true },
        { name: "citizenship", label: "Citizenship", type: "text", required: true },

        { name: "_section_address", label: "Address & Contact", type: "section" },
        { name: "address", label: "Complete Address", type: "text", required: true },
        { name: "barangay", label: "Barangay", type: "text", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "height", label: "Height (cm)", type: "number" },
        { name: "weight", label: "Weight (kg)", type: "number" },
        { name: "tinNo", label: "TIN No.", type: "text" },
        { name: "icr", label: "Immigration Certificate of Registration (ICR) No.", type: "text" },

        { name: "_section_income", label: "Profession & Income", type: "section" },
        { name: "profession", label: "Profession / Occupation / Business", type: "text", required: true },
        { name: "grossIncome", label: "Gross Annual Income (₱)", type: "number", required: true },
        { name: "salaryIncome", label: "Salary / Compensation Income (₱)", type: "number" },
        { name: "businessIncome", label: "Business / Professional Income (₱)", type: "number" },
        { name: "propertyIncome", label: "Income from Property (₱)", type: "number" },
      ],
    },
    {
      id: "civil-registry",
      name: "Civil Registry",
      department: "civil-registry",
      icon: "fileBadge",
      color: "purple",
      tag: "Online Form",
      description: "Birth, Marriage, Death Certificates and Correction for Clerical Error.",
      subServices: ["Birth Certificate", "Marriage Certificate", "Death Certificate", "Correction for Clerical Error"],
      fields: [
        { name: "_section_request", label: "Request Details", type: "section" },
        { name: "requestType", label: "Request Type", type: "select", options: ["Birth Certificate", "Marriage Certificate", "Death Certificate", "Correction for Clerical Error"], required: true },
        { name: "purpose", label: "Purpose of Request", type: "select", options: ["Personal Copy", "Employment", "School/Enrollment", "SSS/GSIS/Pag-IBIG", "Passport/Travel", "Legal Proceedings", "Lodge/Other"], required: true },
        { name: "numberOfCopies", label: "Number of Copies", type: "select", options: ["1", "2", "3", "4", "5"], required: true },

        { name: "_section_requester", label: "Requester Information", type: "section" },
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "middleName", label: "Middle Name", type: "text" },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "address", label: "Complete Address", type: "text", required: true },

        { name: "_section_document", label: "Document Owner Information", type: "section" },
        { name: "ownDocument", label: "Requesting own document?", type: "select", options: ["Yes", "No"], required: true },
        { name: "relationship", label: "Relationship with Document Owner", type: "select", options: ["Spouse", "Father", "Mother", "Son", "Daughter", "Grandparent", "Grandchild", "Authorized Representative"], required: true, showWhen: { field: "ownDocument", value: "No" } },
        { name: "ownerFirstName", label: "Document Owner — First Name", type: "text", required: true, showWhen: { field: "ownDocument", value: "No" } },
        { name: "ownerMiddleName", label: "Document Owner — Middle Name", type: "text", showWhen: { field: "ownDocument", value: "No" } },
        { name: "ownerLastName", label: "Document Owner — Last Name", type: "text", required: true, showWhen: { field: "ownDocument", value: "No" } },
        { name: "dateOfEvent", label: "Date of Birth / Marriage / Death", type: "date", required: true },
        { name: "placeOfEvent", label: "Place of Event (City/Municipality)", type: "text", required: true },

        { name: "_section_parents", label: "Parent Information", type: "section", showWhen: { field: "requestType", value: "Birth Certificate" } },
        { name: "fatherName", label: "Father's Full Name", type: "text", showWhen: { field: "requestType", value: "Birth Certificate" } },
        { name: "motherMaidenName", label: "Mother's Maiden Name", type: "text", showWhen: { field: "requestType", value: "Birth Certificate" } },
      ],
    },
    {
      id: "business",
      name: "Business Permits",
      department: "bplo",
      icon: "briefcase",
      color: "amber",
      tag: "Online",
      description: "New Business Permit, Renewal, Retirement, CTC of Business Permit, Amendment of Record.",
      subServices: ["New Business Permit", "Renewal of Business Permit", "Retirement of Business", "CTC of Business Permit", "Amendment of Record"],
      fields: [
        { name: "_section_type", label: "Application Type", type: "section" },
        { name: "serviceType", label: "Service Type", type: "select", options: ["New Business Permit", "Renewal of Business Permit", "Retirement of Business", "CTC of Business Permit", "Amendment of Record"], required: true },
        { name: "modeOfPayment", label: "Mode of Payment", type: "select", options: ["Annual", "Semi-Annual", "Quarterly"], required: true },

        { name: "_section_owner", label: "Owner / Applicant Information", type: "section" },
        { name: "ownerName", label: "Owner / Applicant Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "sex", label: "Sex", type: "select", options: ["Male", "Female"], required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "tinNo", label: "TIN No.", type: "text", required: true },
        { name: "ownerAddress", label: "Owner Residential Address", type: "text", required: true },

        { name: "_section_business", label: "Business Details", type: "section" },
        { name: "businessName", label: "Business Name / Trade Name", type: "text", required: true },
        { name: "businessAddress", label: "Business Address", type: "text", required: true },
        { name: "barangay", label: "Barangay", type: "text", required: true },
        { name: "businessType", label: "Business Type / Nature of Business", type: "text", required: true },
        { name: "dtiSecNo", label: "DTI / SEC / CDA Registration No.", type: "text", required: true },
        { name: "dateOfRegistration", label: "Date of DTI / SEC Registration", type: "date" },
        { name: "businessContactNo", label: "Business Telephone / Mobile No.", type: "text" },
        { name: "employeeMale", label: "No. of Employees (Male)", type: "number" },
        { name: "employeeFemale", label: "No. of Employees (Female)", type: "number" },
        { name: "employeeLgu", label: "No. of Employees Residing in LGU", type: "number" },

        { name: "_section_financial", label: "Financial Information", type: "section" },
        { name: "capitalInvestment", label: "Capitalization / Investment (₱)", type: "number" },
        { name: "lastYearGross", label: "Last Year's Gross Sales (₱)", type: "number" },
        { name: "essentialCommodity", label: "Essential Commodity?", type: "select", options: ["Yes", "No"] },
        { name: "floorArea", label: "Business Area (sq.m.)", type: "number" },
        { name: "numberOfUnits", label: "No. of Units (if leasing)", type: "number" },
      ],
    },
    {
      id: "building",
      name: "Building Permits",
      department: "obo",
      icon: "building",
      color: "indigo",
      tag: "Online",
      description: "Building Permit, Certificate of Occupancy, Electrical Permit applications.",
      subServices: ["New Building Permit", "Certificate of Occupancy", "Electrical Permit"],
      fields: [
        { name: "_section_type", label: "Application Type", type: "section" },
        { name: "permitType", label: "Permit Type", type: "select", options: ["New Building Permit", "Certificate of Occupancy", "Electrical Permit"], required: true },
        { name: "scopeOfWork", label: "Scope of Work", type: "select", options: ["New Construction", "Erection", "Addition", "Alteration", "Renovation", "Conversion", "Repair", "Demolition"], required: true },

        { name: "_section_owner", label: "Owner / Applicant Information", type: "section" },
        { name: "applicantName", label: "Owner / Applicant Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "ownerAddress", label: "Owner Address", type: "text", required: true },
        { name: "tinNo", label: "TIN No.", type: "text" },

        { name: "_section_project", label: "Project Details", type: "section" },
        { name: "projectAddress", label: "Project Location / Address", type: "text", required: true },
        { name: "lotNo", label: "Lot No.", type: "text" },
        { name: "blockNo", label: "Block No.", type: "text" },
        { name: "tctNo", label: "TCT / OCT No.", type: "text" },
        { name: "taxDecNo", label: "Tax Declaration No.", type: "text" },
        { name: "barangay", label: "Barangay", type: "text", required: true },
        { name: "streetName", label: "Street Name", type: "text" },

        { name: "_section_design", label: "Design & Construction Details", type: "section" },
        { name: "useOrCharacter", label: "Use or Character of Occupancy", type: "select", options: ["Residential", "Commercial", "Industrial", "Institutional/Government", "Agricultural", "Mixed-Use"], required: true },
        { name: "numberOfStoreys", label: "No. of Storeys", type: "number", required: true },
        { name: "totalFloorArea", label: "Total Floor Area (sq.m.)", type: "number", required: true },
        { name: "totalEstimatedCost", label: "Total Estimated Cost (₱)", type: "number", required: true },
        { name: "proposedDate", label: "Proposed Start of Construction", type: "date" },
        { name: "expectedCompletion", label: "Expected Date of Completion", type: "date" },
        { name: "projectDescription", label: "Brief Project Description", type: "textarea", required: true },
      ],
    },
    {
      id: "assessor",
      name: "Real Property Assessment",
      department: "assessor",
      icon: "home",
      color: "emerald",
      tag: "Online Form",
      description: "Property declarations, transfer of ownership, subdivision, certifications.",
      subServices: [
        "Transfer of Ownership (TR)",
        "New Declaration - Buildings (DC)",
        "New Declaration - Machineries (DC)",
        "Subdivision / Consolidation (SD/CS)",
        "Reassessment (DP/PC/DT)",
        "Reclassification (RC)",
        "Certified True Copy",
        "Cert. of Real Property Holdings",
        "Cert. of Improvement / No Improvement",
      ],
      fees: [
        { service: "Transfer of Ownership (TR)", fee: 1500.72 },
        { service: "Appraisal & Assessment (DC)", fee: 1071.75 },
        { service: "Subdivision / Consolidation (SD/CS)", fee: 1063.69 },
        { service: "Reassessment (DP/PC/DT)", fee: 810.67 },
        { service: "Reclassification (RC)", fee: 1077.37 },
        { service: "Certified True Copy", fee: 199.07 },
        { service: "Cert. Property Holdings / No Landholding", fee: 162.38 },
        { service: "Certification of History", fee: 261.09 },
        { service: "Cert. Improvement / No Improvement", fee: 156.72 },
      ],
      fields: [
        { name: "_section_type", label: "Transaction Type", type: "section" },
        { name: "serviceType", label: "Service Type", type: "select", options: ["Transfer of Ownership", "New Declaration - Buildings", "New Declaration - Machineries", "Subdivision / Consolidation", "Reassessment", "Reclassification", "Certified True Copy", "Cert. of Real Property Holdings", "Cert. of Improvement / No Improvement"], required: true },

        { name: "_section_declarant", label: "Declarant / Owner Information", type: "section" },
        { name: "propertyOwner", label: "Property Owner / Declarant Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "ownerAddress", label: "Complete Address", type: "text", required: true },
        { name: "tinNo", label: "TIN No.", type: "text" },

        { name: "_section_property", label: "Property Details", type: "section" },
        { name: "taxDecNo", label: "Tax Declaration No. (if existing)", type: "text" },
        { name: "pinNo", label: "Property Index Number (PIN)", type: "text" },
        { name: "propertyLocation", label: "Property Location", type: "text", required: true },
        { name: "barangay", label: "Barangay", type: "text", required: true },
        { name: "lotNo", label: "Lot No.", type: "text" },
        { name: "blockNo", label: "Block No.", type: "text" },
        { name: "surveyNo", label: "Survey No.", type: "text" },

        { name: "_section_classification", label: "Classification & Boundaries", type: "section" },
        { name: "classification", label: "Classification", type: "select", options: ["Residential", "Commercial", "Industrial", "Agricultural", "Mineral", "Timberland", "Special"], required: true },
        { name: "area", label: "Area (sq.m. or hectares)", type: "text", required: true },
        { name: "boundNorth", label: "Bounded on the North", type: "text" },
        { name: "boundSouth", label: "Bounded on the South", type: "text" },
        { name: "boundEast", label: "Bounded on the East", type: "text" },
        { name: "boundWest", label: "Bounded on the West", type: "text" },

        { name: "_section_transfer", label: "Transfer Details", type: "section", showWhen: { field: "serviceType", value: "Transfer of Ownership" } },
        { name: "previousOwner", label: "Previous Owner Name", type: "text", required: true, showWhen: { field: "serviceType", value: "Transfer of Ownership" } },
        { name: "previousTD", label: "Previous Tax Declaration No.", type: "text", showWhen: { field: "serviceType", value: "Transfer of Ownership" } },
        { name: "modeOfTransfer", label: "Mode of Transfer", type: "select", options: ["Sale", "Donation", "Succession/Inheritance", "Exchange", "Subdivision", "Merger/Consolidation", "Other"], required: true, showWhen: { field: "serviceType", value: "Transfer of Ownership" } },
      ],
    },
    {
      id: "zoning",
      name: "Zoning",
      department: "zoning",
      icon: "layoutGrid",
      color: "blue",
      tag: "Online Form",
      description: "Locational Clearance, Zoning Certification, Subdivision, Special Projects.",
      subServices: ["Locational Clearance", "Zoning Certification", "Subdivision", "Special Projects"],
      fields: [
        { name: "_section_type", label: "Application Type", type: "section" },
        { name: "serviceType", label: "Service Type", type: "select", options: ["Locational Clearance", "Zoning Certification", "Subdivision", "Special Projects with Required Locational Guidelines"], required: true },

        { name: "_section_applicant", label: "Applicant Information", type: "section" },
        { name: "applicantName", label: "Applicant / Owner Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true },
        { name: "applicantAddress", label: "Complete Address", type: "text", required: true },

        { name: "_section_project", label: "Project Details", type: "section" },
        { name: "projectName", label: "Project / Business Name", type: "text", required: true },
        { name: "projectLocation", label: "Project Location", type: "text", required: true },
        { name: "barangay", label: "Barangay", type: "text", required: true },
        { name: "lotNo", label: "Lot No.", type: "text" },
        { name: "tctNo", label: "TCT / OCT No.", type: "text" },
        { name: "taxDecNo", label: "Tax Declaration No.", type: "text" },

        { name: "_section_details", label: "Project Specifics", type: "section" },
        { name: "projectType", label: "Type of Project", type: "select", options: ["Residential", "Commercial", "Industrial", "Institutional", "Agricultural", "Mixed-Use", "Subdivision", "Other"], required: true },
        { name: "totalLotArea", label: "Total Lot Area (sq.m.)", type: "number", required: true },
        { name: "totalFloorArea", label: "Total Floor Area (sq.m.)", type: "number" },
        { name: "numberOfStoreys", label: "No. of Storeys", type: "number" },
        { name: "numberOfUnits", label: "No. of Units (if subdivision/condo)", type: "number" },
        { name: "zoningClassification", label: "Zoning Classification of Site", type: "text" },
        { name: "projectDescription", label: "Detailed Project Description", type: "textarea", required: true },
      ],
    },
  ];

  /* ====================================================================
     ABOUT DATA
     ==================================================================== */
  const about = {
    description: "The Municipality of Catarman is the capital and economic center of Northern Samar, serving as the province's hub for commerce, governance, and education. Under the leadership of Mayor Francisco Aurelio E. Rosales III, the LGU is committed to inclusive growth, digital innovation, and efficient public service.",
    geography: "Located at the center of the northernmost part of Samar Island, Catarman is bounded on the north by the Philippine Sea, on the west by the Municipality of Bobon, on the east by the Municipality of Mondragon, and on the south by the Municipality of Lope de Vega.",
    stats: {
      barangays: 55,
      urbanBarangays: 22,
      ruralBarangays: 33,
      landArea: "46,443 hectares",
      coordinates: "124°38'00'' E, 12°30'30'' N",
    },
    mission: "The Local Government of Catarman, Northern Samar shall endeavor for quality life for every constituent and towards this end shall: undertake a dynamic, transparent, accountable, responsive and effective governance; provide adequate accessible quality education, social services and facilities; maintain balanced ecology; encourage multi-sectoral participation; and promote vibrant domestic economy.",
    vision: "A center for education and investment in Samar Island with a well-developed agro-industrial economy; God-loving, pro-active, empowered, environment-friendly and resilient community with equitable solutions to climate change under a dynamic, transparent and democratic leadership.",
  };

  /* ====================================================================
     DOWNLOADABLE RESOURCES (from catarman.gov.ph/resources)
     ==================================================================== */
  const resources = [
    {
      department: "OBO",
      departmentId: "obo",
      forms: [
        { name: "Application Form for Building Permit", url: "https://catarman.gov.ph/files/resources/obo/Unified%20Application%20For%20Building%20Permit.pdf" },
        { name: "Civil Structural Permit", url: "https://catarman.gov.ph/files/resources/obo/Civil%20Structural%20Permit.pdf" },
        { name: "Electrical Permit", url: "https://catarman.gov.ph/files/resources/obo/Electrical%20Permit.pdf" },
        { name: "Electronics Permit", url: "https://catarman.gov.ph/files/resources/obo/Electronics%20Permit.pdf" },
        { name: "Mechanical Permit", url: "https://catarman.gov.ph/files/resources/obo/Mechanical%20Permit.pdf" },
        { name: "Plumbing Permit", url: "https://catarman.gov.ph/files/resources/obo/Plumbing%20Permit.pdf" },
        { name: "Sign Permit", url: "https://catarman.gov.ph/files/resources/obo/Sign%20Permit.pdf" },
      ],
    },
    {
      department: "Realty Property (Assessor)",
      departmentId: "assessor",
      forms: [
        { name: "Checklist of Documentary Requirements (CDR)", url: "https://catarman.gov.ph/files/resources/realty%20property/Checklist%20of%20Documentary%20Requirements%20%28CDR%29.pdf" },
      ],
    },
    {
      department: "Zoning",
      departmentId: "zoning",
      forms: [
        { name: "Application for Locational Clearance", url: "https://catarman.gov.ph/files/resources/zoning/Application%20for%20Locational%20Clearance.pdf" },
        { name: "Application for PALC", url: "https://catarman.gov.ph/files/resources/zoning/Application%20for%20PALC.pdf" },
        { name: "Development Permit", url: "https://catarman.gov.ph/files/resources/zoning/Development%20Permit.pdf" },
      ],
    },
  ];

  /* ====================================================================
     REQUEST STATUS WORKFLOW
     ==================================================================== */
  const STATUS = {
    RECEIVED: "Received",
    UNDER_REVIEW: "Under Review",
    PROCESSING: "Processing",
    FOR_RELEASE: "For Release",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
  };

  const STATUS_COLORS = {
    Received: "blue",
    "Under Review": "amber",
    Processing: "teal",
    "For Release": "purple",
    Completed: "emerald",
    Rejected: "rose",
  };

  /* ====================================================================
     LOCAL STORAGE KEYS (auth only — requests are on server now)
     ==================================================================== */
  const KEYS = {
    AUTH: "ecatarman_auth",
  };

  /* ====================================================================
     REQUEST TRACKING SYSTEM — Server-backed with local cache
     ==================================================================== */

  // Local cache — populated from server on init
  var _requestCache = [];
  var _cacheReady = false;

  function generateTransactionId() {
    const year = new Date().getFullYear();
    const num = String(_requestCache.length + 1).padStart(4, "0");
    return "TXN-" + year + "-" + num;
  }

  // Synchronous read from cache (used by all existing code)
  function getRequests() {
    return _requestCache;
  }

  // Sync cache from server
  function syncFromServer(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/requests", false); // synchronous for compatibility
    try {
      xhr.send();
      if (xhr.status === 200) {
        _requestCache = JSON.parse(xhr.responseText);
        _cacheReady = true;
      }
    } catch (e) {
      console.warn("⚠ Server sync failed, using cache:", e.message);
    }
    if (callback) callback();
  }

  // Async sync (for background refreshes)
  function syncFromServerAsync(callback) {
    fetch("/api/requests")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        _requestCache = data;
        _cacheReady = true;
        if (callback) callback();
      })
      .catch(function (e) {
        console.warn("⚠ Async sync failed:", e.message);
      });
  }

  function submitRequest(serviceId, formData) {
    const service = services.find(function (s) { return s.id === serviceId; });
    if (!service) return null;
    const dept = departments.find(function (d) { return d.id === service.department; });

    const request = {
      id: generateTransactionId(),
      serviceId: serviceId,
      serviceName: service.name,
      departmentId: service.department,
      departmentName: dept ? dept.name : "Unknown",
      status: STATUS.RECEIVED,
      formData: formData,
      citizenName: formData.fullName || formData.ownerName || formData.applicantName || formData.propertyOwner || formData.firstName + " " + (formData.lastName || ""),
      citizenEmail: formData.email || "",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
      routedTo: [],
    };

    // Add to cache immediately
    _requestCache.push(request);

    // Persist to server (async — check for duplicate/rate limit)
    fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }).then(function (response) {
      if (response.status === 409) {
        // Duplicate — remove from local cache
        _requestCache = _requestCache.filter(function (r) { return r.id !== request.id; });
        response.json().then(function (data) {
          _lastSubmitError = { type: "duplicate", message: data.message };
          window.dispatchEvent(new CustomEvent("ecatarman:submit-error", { detail: _lastSubmitError }));
        });
      } else if (response.status === 429) {
        _requestCache = _requestCache.filter(function (r) { return r.id !== request.id; });
        response.json().then(function (data) {
          _lastSubmitError = { type: "rate-limited", message: data.error };
          window.dispatchEvent(new CustomEvent("ecatarman:submit-error", { detail: _lastSubmitError }));
        });
      }
    }).catch(function (e) { console.warn("Server save failed:", e.message); });

    return request;
  }

  var _lastSubmitError = null;

  function getLastSubmitError() {
    var err = _lastSubmitError;
    _lastSubmitError = null;
    return err;
  }

  function getRequestById(transactionId) {
    return _requestCache.find(function (r) { return r.id === transactionId; }) || null;
  }

  function getRequestsByDept(departmentId) {
    return _requestCache.filter(function (r) {
      return r.departmentId === departmentId || (r.routedTo && r.routedTo.indexOf(departmentId) >= 0);
    });
  }

  function getRequestsByStatus(status) {
    return _requestCache.filter(function (r) { return r.status === status; });
  }

  function updateRequestStatus(transactionId, newStatus, note) {
    const idx = _requestCache.findIndex(function (r) { return r.id === transactionId; });
    if (idx === -1) return null;
    _requestCache[idx].status = newStatus;
    _requestCache[idx].updatedAt = new Date().toISOString();
    if (note) {
      if (!_requestCache[idx].notes) _requestCache[idx].notes = [];
      _requestCache[idx].notes.push({
        text: note,
        status: newStatus,
        timestamp: new Date().toISOString(),
      });
    }

    // Persist to server
    fetch("/api/requests/" + transactionId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: _requestCache[idx].status,
        updatedAt: _requestCache[idx].updatedAt,
        notes: _requestCache[idx].notes,
      }),
    }).catch(function (e) { console.warn("Server update failed:", e.message); });

    return _requestCache[idx];
  }

  function routeRequest(transactionId, targetDeptId, note) {
    const idx = _requestCache.findIndex(function (r) { return r.id === transactionId; });
    if (idx === -1) return null;
    if (!_requestCache[idx].routedTo) _requestCache[idx].routedTo = [];
    if (_requestCache[idx].routedTo.indexOf(targetDeptId) === -1) {
      _requestCache[idx].routedTo.push(targetDeptId);
    }
    _requestCache[idx].updatedAt = new Date().toISOString();
    const dept = departments.find(function (d) { return d.id === targetDeptId; });
    if (!_requestCache[idx].notes) _requestCache[idx].notes = [];
    _requestCache[idx].notes.push({
      text: note || "Routed to " + (dept ? dept.shortName : targetDeptId),
      status: _requestCache[idx].status,
      timestamp: new Date().toISOString(),
    });

    // Persist to server
    fetch("/api/requests/" + transactionId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routedTo: _requestCache[idx].routedTo,
        updatedAt: _requestCache[idx].updatedAt,
        notes: _requestCache[idx].notes,
      }),
    }).catch(function (e) { console.warn("Server route failed:", e.message); });

    return _requestCache[idx];
  }

  function deleteRequest(transactionId) {
    _requestCache = _requestCache.filter(function (r) { return r.id !== transactionId; });

    // Persist to server
    fetch("/api/requests/" + transactionId, {
      method: "DELETE",
    }).catch(function (e) { console.warn("Server delete failed:", e.message); });
  }

  /* ====================================================================
     DEMO DATA SEEDER — Server-side
     ==================================================================== */
  function loadDemoData() {
    // Check server if demo is already loaded
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/demo-status", false);
    try {
      xhr.send();
      if (xhr.status === 200) {
        var status = JSON.parse(xhr.responseText);
        if (status.demoLoaded) {
          // Demo already on server — just sync cache
          syncFromServer();
          return;
        }
      }
    } catch (e) {
      // Server not available — skip seeding
      return;
    }

    var demoRequests = [
      {
        id: "TXN-2026-0001",
        serviceId: "business",
        serviceName: "Business Permits",
        departmentId: "bplo",
        departmentName: "Business Permit & Licensing Office",
        status: STATUS.PROCESSING,
        formData: { serviceType: "New Business Permit", modeOfPayment: "Annual", ownerName: "Maria Santos", email: "maria@email.com", sex: "Female", contactNumber: "09171234567", tinNo: "123-456-789-000", ownerAddress: "Brgy. Dalakit, Catarman", businessName: "Catarman General Store", businessAddress: "National Highway, Brgy. Dalakit, Catarman", barangay: "Dalakit", businessType: "Retail / Sari-Sari Store", dtiSecNo: "DTI-08-2025-00412", capitalInvestment: "250000", lastYearGross: "0", floorArea: "48", _attachments: [{ originalName: "DTI_Certificate.pdf", url: "#", size: 245760, type: "application/pdf" }, { originalName: "Valid_ID_Front.jpg", url: "#", size: 1048576, type: "image/jpeg" }] },
        citizenName: "Maria Santos",
        citizenEmail: "maria@email.com",
        submittedAt: "2026-04-10T08:30:00.000Z",
        updatedAt: "2026-04-12T14:20:00.000Z",
        notes: [
          { text: "Application received and verified.", status: "Received", timestamp: "2026-04-10T08:30:00.000Z" },
          { text: "Documents complete. Forwarded for assessment.", status: "Under Review", timestamp: "2026-04-11T09:15:00.000Z" },
          { text: "Processing fees computed. Awaiting payment.", status: "Processing", timestamp: "2026-04-12T14:20:00.000Z" },
        ],
        routedTo: ["treasurer"],
      },
      {
        id: "TXN-2026-0002",
        serviceId: "cedula",
        serviceName: "Cedula",
        departmentId: "treasurer",
        departmentName: "Municipal Treasurer's Office",
        status: STATUS.COMPLETED,
        formData: { taxGroupType: "Individual", fullName: "Juan Dela Cruz", email: "juan@email.com", dateOfBirth: "1985-06-15", placeOfBirth: "Catarman, Northern Samar", civilStatus: "Married", sex: "Male", citizenship: "Filipino", address: "Purok 3, Brgy. UEP, Catarman", barangay: "UEP", contactNumber: "09281234567", profession: "Teacher", grossIncome: "420000", salaryIncome: "420000" },
        citizenName: "Juan Dela Cruz",
        citizenEmail: "juan@email.com",
        submittedAt: "2026-04-08T10:00:00.000Z",
        updatedAt: "2026-04-09T15:00:00.000Z",
        notes: [
          { text: "CTC application received.", status: "Received", timestamp: "2026-04-08T10:00:00.000Z" },
          { text: "CTC issued. Ready for pickup.", status: "Completed", timestamp: "2026-04-09T15:00:00.000Z" },
        ],
        routedTo: [],
      },
      {
        id: "TXN-2026-0003",
        serviceId: "building",
        serviceName: "Building Permits",
        departmentId: "obo",
        departmentName: "Office of the Building Official",
        status: STATUS.UNDER_REVIEW,
        formData: { permitType: "New Building Permit", scopeOfWork: "New Construction", applicantName: "Pedro Reyes", email: "pedro@email.com", contactNumber: "09351234567", ownerAddress: "Brgy. Cawayan, Catarman", projectAddress: "Lot 15, Brgy. Cawayan, Catarman", barangay: "Cawayan", useOrCharacter: "Residential", numberOfStoreys: "2", totalFloorArea: "120", totalEstimatedCost: "2500000", projectDescription: "Two-storey residential building with 3 bedrooms, 2 bathrooms, and carport" },
        citizenName: "Pedro Reyes",
        citizenEmail: "pedro@email.com",
        submittedAt: "2026-04-13T07:45:00.000Z",
        updatedAt: "2026-04-14T10:30:00.000Z",
        notes: [
          { text: "Building permit application received.", status: "Received", timestamp: "2026-04-13T07:45:00.000Z" },
          { text: "Under review. Requires zoning clearance.", status: "Under Review", timestamp: "2026-04-14T10:30:00.000Z" },
        ],
        routedTo: ["zoning"],
      },
      {
        id: "TXN-2026-0004",
        serviceId: "civil-registry",
        serviceName: "Civil Registry",
        departmentId: "civil-registry",
        departmentName: "Civil Registry Office",
        status: STATUS.FOR_RELEASE,
        formData: { requestType: "Birth Certificate", purpose: "Personal Copy", numberOfCopies: "2", firstName: "Ana", middleName: "Lopez", lastName: "Rizal", email: "ana@email.com", contactNumber: "09191234567", address: "Brgy. Narra, Catarman", ownDocument: "Yes", dateOfEvent: "1998-03-22", placeOfEvent: "Catarman, Northern Samar", fatherName: "Jose Rizal", motherMaidenName: "Teodora Lopez" },
        citizenName: "Ana Rizal",
        citizenEmail: "ana@email.com",
        submittedAt: "2026-04-11T13:20:00.000Z",
        updatedAt: "2026-04-14T16:00:00.000Z",
        notes: [
          { text: "Request for birth certificate received.", status: "Received", timestamp: "2026-04-11T13:20:00.000Z" },
          { text: "Document verified and printed. For release.", status: "For Release", timestamp: "2026-04-14T16:00:00.000Z" },
        ],
        routedTo: [],
      },
      {
        id: "TXN-2026-0005",
        serviceId: "assessor",
        serviceName: "Real Property Assessment",
        departmentId: "assessor",
        departmentName: "Municipal Assessor's Office",
        status: STATUS.RECEIVED,
        formData: { serviceType: "Transfer of Ownership", propertyOwner: "Elena Magtanggol", email: "elena@email.com", contactNumber: "09561234567", ownerAddress: "Brgy. Gebulwangan, Catarman", taxDecNo: "TD-2024-0872", pinNo: "PIN-08-012-0421", propertyLocation: "Brgy. Gebulwangan, Catarman", barangay: "Gebulwangan", classification: "Residential", area: "300 sq.m.", boundNorth: "Lot 23 - Garcia", boundSouth: "Barangay Road", previousOwner: "Ricardo Magtanggol", modeOfTransfer: "Succession/Inheritance" },
        citizenName: "Elena Magtanggol",
        citizenEmail: "elena@email.com",
        submittedAt: "2026-04-15T06:10:00.000Z",
        updatedAt: "2026-04-15T06:10:00.000Z",
        notes: [],
        routedTo: [],
      },
      {
        id: "TXN-2026-0006",
        serviceId: "zoning",
        serviceName: "Zoning",
        departmentId: "zoning",
        departmentName: "Zoning Office",
        status: STATUS.PROCESSING,
        formData: { serviceType: "Locational Clearance", applicantName: "Roberto Guzman", email: "robert@email.com", contactNumber: "09451234567", applicantAddress: "Brgy. Caltabangan, Catarman", projectName: "Guzman Hardware & Construction Supply", projectLocation: "National Highway, Brgy. Caltabangan", barangay: "Caltabangan", projectType: "Commercial", totalLotArea: "200", totalFloorArea: "150", numberOfStoreys: "1", projectDescription: "Single-storey commercial building for hardware and construction supply retail" },
        citizenName: "Roberto Guzman",
        citizenEmail: "robert@email.com",
        submittedAt: "2026-04-09T11:00:00.000Z",
        updatedAt: "2026-04-13T09:30:00.000Z",
        notes: [
          { text: "Locational clearance application received.", status: "Received", timestamp: "2026-04-09T11:00:00.000Z" },
          { text: "Site inspection scheduled.", status: "Under Review", timestamp: "2026-04-11T08:00:00.000Z" },
          { text: "Site inspection completed. Processing clearance.", status: "Processing", timestamp: "2026-04-13T09:30:00.000Z" },
        ],
        routedTo: [],
      },
    ];

    // Seed to server
    var seedXhr = new XMLHttpRequest();
    seedXhr.open("POST", "/api/seed", false);
    seedXhr.setRequestHeader("Content-Type", "application/json");
    try {
      seedXhr.send(JSON.stringify({ requests: demoRequests }));
    } catch (e) {
      console.warn("⚠ Seed failed:", e.message);
    }

    // Sync cache from server
    syncFromServer();
  }

  /* ====================================================================
     ANALYTICS
     ==================================================================== */
  function getAnalytics() {
    var requests = getRequests();
    var total = requests.length;
    var byStatus = {};
    var byDept = {};
    var byService = {};

    Object.values(STATUS).forEach(function (s) { byStatus[s] = 0; });

    requests.forEach(function (r) {
      if (byStatus[r.status] !== undefined) byStatus[r.status]++;
      byDept[r.departmentId] = (byDept[r.departmentId] || 0) + 1;
      byService[r.serviceId] = (byService[r.serviceId] || 0) + 1;
    });

    return { total: total, byStatus: byStatus, byDept: byDept, byService: byService };
  }

  /* ====================================================================
     AUTH — Role-Based Multi-Account System
     Each department gets its own login. "admin" is superadmin (sees all).
     ==================================================================== */
  var ACCOUNTS = {
    admin:     { password: "admin",     role: "administrator", department: null,             label: "Super Admin" },
    treasurer: { password: "treasurer", role: "department",    department: "treasurer",      label: "Municipal Treasurer's Office" },
    civil:     { password: "civil",     role: "department",    department: "civil-registry",  label: "Civil Registry Office" },
    bplo:      { password: "bplo",      role: "department",    department: "bplo",            label: "Business Permit & Licensing Office" },
    obo:       { password: "obo",       role: "department",    department: "obo",             label: "Office of the Building Official" },
    assessor:  { password: "assessor",  role: "department",    department: "assessor",        label: "Municipal Assessor's Office" },
    zoning:    { password: "zoning",    role: "department",    department: "zoning",          label: "Zoning Office" },
  };

  function login(username, password) {
    var account = ACCOUNTS[username];
    if (account && account.password === password) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify({
        user: username,
        role: account.role,
        department: account.department,
        label: account.label,
        loggedIn: true,
      }));
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(KEYS.AUTH);
  }

  function isLoggedIn() {
    try {
      var auth = JSON.parse(localStorage.getItem(KEYS.AUTH));
      return auth && auth.loggedIn;
    } catch (e) {
      return false;
    }
  }

  function getAuth() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.AUTH)) || null;
    } catch (e) {
      return null;
    }
  }

  /* ====================================================================
     UTILITY FUNCTIONS
     ==================================================================== */
  function formatDate(isoString) {
    var d = new Date(isoString);
    return d.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
  }

  function formatDateTime(isoString) {
    var d = new Date(isoString);
    return d.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function timeAgo(isoString) {
    var now = Date.now();
    var then = new Date(isoString).getTime();
    var diff = now - then;
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + "m ago";
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + "d ago";
    return formatDate(isoString);
  }

  /* ====================================================================
     PUBLIC API
     ==================================================================== */
  // Auto-load demo data (seeds to server if first run)
  loadDemoData();

  return {
    departments: departments,
    contacts: contacts,
    services: services,
    about: about,
    resources: resources,
    STATUS: STATUS,
    STATUS_COLORS: STATUS_COLORS,
    submitRequest: submitRequest,
    getRequests: getRequests,
    getRequestById: getRequestById,
    getRequestsByDept: getRequestsByDept,
    getRequestsByStatus: getRequestsByStatus,
    updateRequestStatus: updateRequestStatus,
    routeRequest: routeRequest,
    deleteRequest: deleteRequest,
    getLastSubmitError: getLastSubmitError,
    getAnalytics: getAnalytics,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    getAuth: getAuth,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    timeAgo: timeAgo,
    generateTransactionId: generateTransactionId,
    loadDemoData: loadDemoData,
    syncFromServer: syncFromServer,
    syncFromServerAsync: syncFromServerAsync,
  };
})();
