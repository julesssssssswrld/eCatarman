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
        { name: "taxGroupType", label: "Tax Group Type", type: "select", options: ["Individual", "Corporation", "Juridical"] },
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "profession", label: "Profession / Occupation", type: "text" },
        { name: "grossIncome", label: "Gross Annual Income (₱)", type: "number" },
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
        { name: "requestType", label: "Request Type", type: "select", options: ["Birth Certificate", "Marriage Certificate", "Death Certificate", "Correction for Clerical Error"], required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "ownDocument", label: "Own Document?", type: "select", options: ["Yes", "No"], required: true },
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "relationship", label: "Relationship with Document Owner", type: "text" },
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
        { name: "serviceType", label: "Service Type", type: "select", options: ["New Business Permit", "Renewal of Business Permit", "Retirement of Business", "CTC of Business Permit", "Amendment of Record"], required: true },
        { name: "businessName", label: "Business Name", type: "text", required: true },
        { name: "ownerName", label: "Owner Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "businessAddress", label: "Business Address", type: "text", required: true },
        { name: "businessType", label: "Business Type / Nature", type: "text", required: true },
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
        { name: "permitType", label: "Permit Type", type: "select", options: ["New Building Permit", "Certificate of Occupancy", "Electrical Permit"], required: true },
        { name: "applicantName", label: "Applicant Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "projectAddress", label: "Project Location / Address", type: "text", required: true },
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
        { name: "serviceType", label: "Service Type", type: "select", options: ["Transfer of Ownership", "New Declaration - Buildings", "New Declaration - Machineries", "Subdivision / Consolidation", "Reassessment", "Reclassification", "Certified True Copy", "Cert. of Real Property Holdings", "Cert. of Improvement / No Improvement"], required: true },
        { name: "propertyOwner", label: "Property Owner Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "taxDecNo", label: "Tax Declaration No. (if applicable)", type: "text" },
        { name: "propertyLocation", label: "Property Location", type: "text", required: true },
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
        { name: "serviceType", label: "Service Type", type: "select", options: ["Locational Clearance", "Zoning Certification", "Subdivision", "Special Projects with Required Locational Guidelines"], required: true },
        { name: "applicantName", label: "Applicant Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "projectLocation", label: "Project Location", type: "text", required: true },
        { name: "projectType", label: "Project Type / Description", type: "textarea", required: true },
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
     LOCAL STORAGE KEYS
     ==================================================================== */
  const KEYS = {
    REQUESTS: "ecatarman_requests",
    AUTH: "ecatarman_auth",
    DEMO_LOADED: "ecatarman_demo_loaded",
  };

  /* ====================================================================
     REQUEST TRACKING SYSTEM
     ==================================================================== */

  function generateTransactionId() {
    const year = new Date().getFullYear();
    const requests = getRequests();
    const num = String(requests.length + 1).padStart(4, "0");
    return "TXN-" + year + "-" + num;
  }

  function getRequests() {
    try {
      const data = localStorage.getItem(KEYS.REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRequests(requests) {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
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
      routedTo: [], // cross-department routing
    };

    const requests = getRequests();
    requests.push(request);
    saveRequests(requests);
    return request;
  }

  function getRequestById(transactionId) {
    var requests = getRequests();
    return requests.find(function (r) { return r.id === transactionId; }) || null;
  }

  function getRequestsByDept(departmentId) {
    return getRequests().filter(function (r) {
      return r.departmentId === departmentId || r.routedTo.indexOf(departmentId) >= 0;
    });
  }

  function getRequestsByStatus(status) {
    return getRequests().filter(function (r) { return r.status === status; });
  }

  function updateRequestStatus(transactionId, newStatus, note) {
    const requests = getRequests();
    const idx = requests.findIndex(function (r) { return r.id === transactionId; });
    if (idx === -1) return null;
    requests[idx].status = newStatus;
    requests[idx].updatedAt = new Date().toISOString();
    if (note) {
      requests[idx].notes.push({
        text: note,
        status: newStatus,
        timestamp: new Date().toISOString(),
      });
    }
    saveRequests(requests);
    return requests[idx];
  }

  function routeRequest(transactionId, targetDeptId, note) {
    const requests = getRequests();
    const idx = requests.findIndex(function (r) { return r.id === transactionId; });
    if (idx === -1) return null;
    if (requests[idx].routedTo.indexOf(targetDeptId) === -1) {
      requests[idx].routedTo.push(targetDeptId);
    }
    requests[idx].updatedAt = new Date().toISOString();
    const dept = departments.find(function (d) { return d.id === targetDeptId; });
    requests[idx].notes.push({
      text: note || "Routed to " + (dept ? dept.shortName : targetDeptId),
      status: requests[idx].status,
      timestamp: new Date().toISOString(),
    });
    saveRequests(requests);
    return requests[idx];
  }

  function deleteRequest(transactionId) {
    const requests = getRequests().filter(function (r) { return r.id !== transactionId; });
    saveRequests(requests);
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
     AUTH (Simple demo auth)
     ==================================================================== */
  function login(username, password) {
    if (username === "admin" && password === "admin") {
      localStorage.setItem(KEYS.AUTH, JSON.stringify({ user: "admin", role: "administrator", loggedIn: true }));
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(KEYS.AUTH);
  }

  function isLoggedIn() {
    try {
      const auth = JSON.parse(localStorage.getItem(KEYS.AUTH));
      return auth && auth.loggedIn;
    } catch (e) {
      return false;
    }
  }

  /* ====================================================================
     DEMO DATA SEEDER
     ==================================================================== */
  function loadDemoData() {
    if (localStorage.getItem(KEYS.DEMO_LOADED)) return;

    var demoRequests = [
      {
        id: "TXN-2026-0001",
        serviceId: "business",
        serviceName: "Business Permits",
        departmentId: "bplo",
        departmentName: "Business Permit & Licensing Office",
        status: STATUS.PROCESSING,
        formData: { serviceType: "New Business Permit", businessName: "Catarman General Store", ownerName: "Maria Santos", email: "maria@email.com", businessAddress: "Brgy. Dalakit, Catarman", businessType: "Retail / Sari-Sari Store" },
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
        formData: { taxGroupType: "Individual", fullName: "Juan Dela Cruz", email: "juan@email.com", address: "Brgy. UEP, Catarman", profession: "Teacher", grossIncome: "420000" },
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
        formData: { permitType: "New Building Permit", applicantName: "Pedro Reyes", email: "pedro@email.com", projectAddress: "Brgy. Cawayan, Catarman", projectDescription: "Two-storey residential building, 120 sqm lot" },
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
        formData: { requestType: "Birth Certificate", email: "ana@email.com", ownDocument: "Yes", firstName: "Ana", lastName: "Rizal" },
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
        formData: { serviceType: "Transfer of Ownership", propertyOwner: "Elena Magtanggol", email: "elena@email.com", taxDecNo: "TD-2024-0872", propertyLocation: "Brgy. Gebulwangan, Catarman" },
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
        formData: { serviceType: "Locational Clearance", applicantName: "Roberto Guzman", email: "robert@email.com", projectLocation: "Brgy. Caltabangan, Catarman", projectType: "Commercial building — hardware store" },
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

    saveRequests(demoRequests);
    localStorage.setItem(KEYS.DEMO_LOADED, "true");
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
  // Auto-load demo data
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
    getAnalytics: getAnalytics,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    timeAgo: timeAgo,
    generateTransactionId: generateTransactionId,
    loadDemoData: loadDemoData,
  };
})();
