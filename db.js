/* ==========================================================================
   eCatarman — Server-Side SQLite Database (Properly Normalized)
   ========================================================================== */

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "ecatarman.sqlite");
const sqlite = new Database(DB_PATH);

// WAL mode for better concurrent-read performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

/* ==========================================================================
   NORMALIZED SCHEMA
   ========================================================================== */

sqlite.exec(`
  -- Core request record: every column is searchable/indexable
  CREATE TABLE IF NOT EXISTS requests (
    id             TEXT PRIMARY KEY,
    serviceId      TEXT NOT NULL,
    serviceName    TEXT NOT NULL,
    departmentId   TEXT NOT NULL,
    departmentName TEXT DEFAULT '',
    status         TEXT NOT NULL DEFAULT 'Received',
    citizenName    TEXT NOT NULL,
    citizenEmail   TEXT DEFAULT '',
    submittedAt    TEXT NOT NULL,
    updatedAt      TEXT NOT NULL
  );

  -- EAV table for dynamic form fields — every field is individually queryable
  -- e.g. SELECT * FROM request_fields WHERE fieldName = 'barangay' AND fieldValue = 'Dalakit'
  CREATE TABLE IF NOT EXISTS request_fields (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    requestId  TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    fieldName  TEXT NOT NULL,
    fieldValue TEXT DEFAULT '',
    UNIQUE(requestId, fieldName)
  );

  -- Status timeline / notes — each entry is a row
  CREATE TABLE IF NOT EXISTS request_notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    requestId  TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    text       TEXT NOT NULL,
    status     TEXT NOT NULL,
    timestamp  TEXT NOT NULL
  );

  -- Cross-department routing — each route is a row
  CREATE TABLE IF NOT EXISTS request_routes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    requestId    TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    departmentId TEXT NOT NULL,
    UNIQUE(requestId, departmentId)
  );

  -- File attachments — each file is a row
  CREATE TABLE IF NOT EXISTS request_attachments (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    requestId    TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    originalName TEXT NOT NULL,
    url          TEXT NOT NULL,
    size         INTEGER DEFAULT 0,
    type         TEXT DEFAULT ''
  );

  -- Emergency contacts
  CREATE TABLE IF NOT EXISTS emergency_contacts (
    id       TEXT PRIMARY KEY,
    label    TEXT NOT NULL,
    number   TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'MDRRMO'
  );

  -- App metadata (demo seeded flag, etc.)
  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT
  );

  -- ── INDEXES for the queries the LGU will actually run ──────────────────
  CREATE INDEX IF NOT EXISTS idx_requests_status       ON requests(status);
  CREATE INDEX IF NOT EXISTS idx_requests_dept         ON requests(departmentId);
  CREATE INDEX IF NOT EXISTS idx_requests_submitted    ON requests(submittedAt);
  CREATE INDEX IF NOT EXISTS idx_requests_citizen      ON requests(citizenName);
  CREATE INDEX IF NOT EXISTS idx_fields_name_value     ON request_fields(fieldName, fieldValue);
  CREATE INDEX IF NOT EXISTS idx_fields_request        ON request_fields(requestId);
  CREATE INDEX IF NOT EXISTS idx_notes_request         ON request_notes(requestId);
  CREATE INDEX IF NOT EXISTS idx_routes_request        ON request_routes(requestId);
  CREATE INDEX IF NOT EXISTS idx_attachments_request   ON request_attachments(requestId);
`);

/* ==========================================================================
   SEED default emergency contacts if table is empty
   ========================================================================== */

const ecCount = sqlite.prepare("SELECT COUNT(*) AS cnt FROM emergency_contacts").get();
if (ecCount.cnt === 0) {
  const insertEC = sqlite.prepare(
    "INSERT INTO emergency_contacts (id, label, number, category) VALUES (@id, @label, @number, @category)"
  );
  sqlite.transaction(() => {
    insertEC.run({ id: "mdrrmo-smart", label: "Smart", number: "0949 151 3810", category: "MDRRMO" });
    insertEC.run({ id: "mdrrmo-globe", label: "Globe", number: "0905 547 7522", category: "MDRRMO" });
  })();
}

/* ==========================================================================
   PREPARED STATEMENTS
   ========================================================================== */

const stmts = {
  // Requests
  getAllRequests:    sqlite.prepare("SELECT * FROM requests ORDER BY submittedAt DESC"),
  getRequestById:   sqlite.prepare("SELECT * FROM requests WHERE id = ?"),
  insertRequest:    sqlite.prepare(`
    INSERT INTO requests (id, serviceId, serviceName, departmentId, departmentName, status, citizenName, citizenEmail, submittedAt, updatedAt)
    VALUES (@id, @serviceId, @serviceName, @departmentId, @departmentName, @status, @citizenName, @citizenEmail, @submittedAt, @updatedAt)
  `),
  updateRequestCore: sqlite.prepare(`
    UPDATE requests
    SET serviceId = @serviceId, serviceName = @serviceName, departmentId = @departmentId,
        departmentName = @departmentName, status = @status,
        citizenName = @citizenName, citizenEmail = @citizenEmail, updatedAt = @updatedAt
    WHERE id = @id
  `),
  deleteRequest:    sqlite.prepare("DELETE FROM requests WHERE id = ?"),

  // Form fields (EAV)
  getFields:        sqlite.prepare("SELECT fieldName, fieldValue FROM request_fields WHERE requestId = ?"),
  insertField:      sqlite.prepare("INSERT OR REPLACE INTO request_fields (requestId, fieldName, fieldValue) VALUES (?, ?, ?)"),
  deleteFields:     sqlite.prepare("DELETE FROM request_fields WHERE requestId = ?"),

  // Notes
  getNotes:         sqlite.prepare("SELECT text, status, timestamp FROM request_notes WHERE requestId = ? ORDER BY timestamp ASC"),
  insertNote:       sqlite.prepare("INSERT INTO request_notes (requestId, text, status, timestamp) VALUES (?, ?, ?, ?)"),
  deleteNotes:      sqlite.prepare("DELETE FROM request_notes WHERE requestId = ?"),

  // Routes
  getRoutes:        sqlite.prepare("SELECT departmentId FROM request_routes WHERE requestId = ?"),
  insertRoute:      sqlite.prepare("INSERT OR IGNORE INTO request_routes (requestId, departmentId) VALUES (?, ?)"),
  deleteRoutes:     sqlite.prepare("DELETE FROM request_routes WHERE requestId = ?"),

  // Attachments
  getAttachments:   sqlite.prepare("SELECT originalName, url, size, type FROM request_attachments WHERE requestId = ?"),
  insertAttachment: sqlite.prepare("INSERT INTO request_attachments (requestId, originalName, url, size, type) VALUES (?, ?, ?, ?, ?)"),
  deleteAttachments:sqlite.prepare("DELETE FROM request_attachments WHERE requestId = ?"),

  // Emergency contacts
  getAllEC:          sqlite.prepare("SELECT * FROM emergency_contacts"),
  deleteAllEC:      sqlite.prepare("DELETE FROM emergency_contacts"),
  insertEC:         sqlite.prepare("INSERT INTO emergency_contacts (id, label, number, category) VALUES (@id, @label, @number, @category)"),

  // Meta
  getMeta:          sqlite.prepare("SELECT value FROM meta WHERE key = ?"),
  setMeta:          sqlite.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)"),
};

/* ==========================================================================
   HELPERS — assemble a full request object from normalized tables
   ========================================================================== */

/** Build the JS object the frontend expects from the normalized tables */
function assembleRequest(row) {
  if (!row) return null;

  // Rebuild formData from EAV rows
  const fields = stmts.getFields.all(row.id);
  const formData = {};
  fields.forEach((f) => { formData[f.fieldName] = f.fieldValue; });

  // Rebuild _attachments
  const attachments = stmts.getAttachments.all(row.id);
  if (attachments.length > 0) {
    formData._attachments = attachments;
  }

  // Rebuild notes array
  const notes = stmts.getNotes.all(row.id);

  // Rebuild routedTo array
  const routedTo = stmts.getRoutes.all(row.id).map((r) => r.departmentId);

  return {
    id: row.id,
    serviceId: row.serviceId,
    serviceName: row.serviceName,
    departmentId: row.departmentId,
    departmentName: row.departmentName,
    status: row.status,
    citizenName: row.citizenName,
    citizenEmail: row.citizenEmail,
    submittedAt: row.submittedAt,
    updatedAt: row.updatedAt,
    formData,
    notes,
    routedTo,
  };
}

/** Save formData, notes, routes, and attachments from a JS request object into normalized tables */
const saveRelatedData = sqlite.transaction((id, formData, notes, routedTo) => {
  // ── Form fields ──
  stmts.deleteFields.run(id);
  stmts.deleteAttachments.run(id);
  if (formData) {
    Object.keys(formData).forEach((key) => {
      if (key === "_attachments") {
        // Save each attachment as its own row
        const atts = formData._attachments || [];
        atts.forEach((a) => {
          stmts.insertAttachment.run(id, a.originalName, a.url, a.size || 0, a.type || "");
        });
      } else {
        stmts.insertField.run(id, key, String(formData[key] ?? ""));
      }
    });
  }

  // ── Notes ──
  stmts.deleteNotes.run(id);
  if (notes && notes.length) {
    notes.forEach((n) => {
      stmts.insertNote.run(id, n.text, n.status, n.timestamp);
    });
  }

  // ── Routes ──
  stmts.deleteRoutes.run(id);
  if (routedTo && routedTo.length) {
    routedTo.forEach((deptId) => {
      stmts.insertRoute.run(id, deptId);
    });
  }
});

/* ==========================================================================
   PUBLIC API — same interface as before
   ========================================================================== */

function getRequests() {
  const rows = stmts.getAllRequests.all();
  return rows.map(assembleRequest);
}

function getRequestById(id) {
  return assembleRequest(stmts.getRequestById.get(id));
}

const createRequestTx = sqlite.transaction((request) => {
  stmts.insertRequest.run({
    id: request.id,
    serviceId: request.serviceId,
    serviceName: request.serviceName,
    departmentId: request.departmentId,
    departmentName: request.departmentName || "",
    status: request.status,
    citizenName: request.citizenName,
    citizenEmail: request.citizenEmail || "",
    submittedAt: request.submittedAt,
    updatedAt: request.updatedAt,
  });
  saveRelatedData(request.id, request.formData, request.notes, request.routedTo);
});

function createRequest(request) {
  createRequestTx(request);
  return request;
}

const updateRequestTx = sqlite.transaction((id, updates) => {
  const existing = assembleRequest(stmts.getRequestById.get(id));
  if (!existing) return null;

  Object.assign(existing, updates);
  existing.updatedAt = new Date().toISOString();

  stmts.updateRequestCore.run({
    id: existing.id,
    serviceId: existing.serviceId,
    serviceName: existing.serviceName,
    departmentId: existing.departmentId,
    departmentName: existing.departmentName || "",
    status: existing.status,
    citizenName: existing.citizenName,
    citizenEmail: existing.citizenEmail || "",
    updatedAt: existing.updatedAt,
  });
  saveRelatedData(existing.id, existing.formData, existing.notes, existing.routedTo);
  return existing;
});

function updateRequest(id, updates) {
  return updateRequestTx(id, updates);
}

function deleteRequest(id) {
  // CASCADE will handle child tables
  const result = stmts.deleteRequest.run(id);
  return result.changes > 0;
}

/* ---- Emergency Contacts ---- */

function getEmergencyContacts() {
  return stmts.getAllEC.all();
}

const updateECTx = sqlite.transaction((contacts) => {
  stmts.deleteAllEC.run();
  contacts.forEach((c) => {
    stmts.insertEC.run({
      id: c.id || (c.category + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6)),
      label: c.label,
      number: c.number,
      category: c.category || "MDRRMO",
    });
  });
});

function updateEmergencyContacts(contacts) {
  updateECTx(contacts);
  return contacts;
}

/* ---- Demo Seeder ---- */

function isDemoLoaded() {
  const row = stmts.getMeta.get("demoLoaded");
  return row ? row.value === "true" : false;
}

function markDemoLoaded() {
  stmts.setMeta.run("demoLoaded", "true");
}

/* ---- Graceful shutdown ---- */
process.on("exit", () => sqlite.close());
process.on("SIGINT", () => { sqlite.close(); process.exit(0); });

/* ==========================================================================
   EXPORTS
   ========================================================================== */

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  getEmergencyContacts,
  updateEmergencyContacts,
  isDemoLoaded,
  markDemoLoaded,
};
