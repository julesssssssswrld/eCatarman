/* ==========================================================================
   eCatarman — Server-Side SQLite Database
   Drop-in replacement for the old JSON-based db.
   Same API surface — server.js requires zero changes.
   ========================================================================== */

const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "ecatarman.sqlite");

// Open (or create) the database file
const sqlite = new Database(DB_PATH);

// Enable WAL mode for better concurrent-read performance
sqlite.pragma("journal_mode = WAL");

/* ==========================================================================
   SCHEMA — auto-creates tables on first run
   ========================================================================== */

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id          TEXT PRIMARY KEY,
    serviceId   TEXT NOT NULL,
    serviceName TEXT NOT NULL,
    departmentId TEXT NOT NULL,
    departmentName TEXT,
    status      TEXT NOT NULL DEFAULT 'Received',
    formData    TEXT NOT NULL DEFAULT '{}',
    citizenName TEXT NOT NULL,
    citizenEmail TEXT DEFAULT '',
    submittedAt TEXT NOT NULL,
    updatedAt   TEXT NOT NULL,
    notes       TEXT NOT NULL DEFAULT '[]',
    routedTo    TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS emergency_contacts (
    id       TEXT PRIMARY KEY,
    label    TEXT NOT NULL,
    number   TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'MDRRMO'
  );

  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT
  );
`);

/* ==========================================================================
   SEED default emergency contacts if table is empty
   ========================================================================== */

const ecCount = sqlite.prepare("SELECT COUNT(*) AS cnt FROM emergency_contacts").get();
if (ecCount.cnt === 0) {
  const insertEC = sqlite.prepare(
    "INSERT INTO emergency_contacts (id, label, number, category) VALUES (@id, @label, @number, @category)"
  );
  const seedEC = sqlite.transaction((contacts) => {
    for (const c of contacts) insertEC.run(c);
  });
  seedEC([
    { id: "mdrrmo-smart", label: "Smart", number: "0949 151 3810", category: "MDRRMO" },
    { id: "mdrrmo-globe", label: "Globe", number: "0905 547 7522", category: "MDRRMO" },
  ]);
}

/* ==========================================================================
   PREPARED STATEMENTS (compiled once, reused for every call)
   ========================================================================== */

const stmts = {
  getAllRequests:   sqlite.prepare("SELECT * FROM requests ORDER BY submittedAt DESC"),
  getRequestById:  sqlite.prepare("SELECT * FROM requests WHERE id = ?"),
  insertRequest:   sqlite.prepare(`
    INSERT INTO requests (id, serviceId, serviceName, departmentId, departmentName, status, formData, citizenName, citizenEmail, submittedAt, updatedAt, notes, routedTo)
    VALUES (@id, @serviceId, @serviceName, @departmentId, @departmentName, @status, @formData, @citizenName, @citizenEmail, @submittedAt, @updatedAt, @notes, @routedTo)
  `),
  updateRequest:   sqlite.prepare(`
    UPDATE requests
    SET serviceId = @serviceId, serviceName = @serviceName, departmentId = @departmentId,
        departmentName = @departmentName, status = @status, formData = @formData,
        citizenName = @citizenName, citizenEmail = @citizenEmail,
        updatedAt = @updatedAt, notes = @notes, routedTo = @routedTo
    WHERE id = @id
  `),
  deleteRequest:   sqlite.prepare("DELETE FROM requests WHERE id = ?"),

  // Emergency contacts
  getAllEC:         sqlite.prepare("SELECT * FROM emergency_contacts"),
  deleteAllEC:     sqlite.prepare("DELETE FROM emergency_contacts"),
  insertEC:        sqlite.prepare(
    "INSERT INTO emergency_contacts (id, label, number, category) VALUES (@id, @label, @number, @category)"
  ),

  // Meta
  getMeta:         sqlite.prepare("SELECT value FROM meta WHERE key = ?"),
  setMeta:         sqlite.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)"),
};

/* ==========================================================================
   HELPERS — serialize/deserialize JSON columns
   ========================================================================== */

/** Convert a SQLite row to the JS object format the server/client expects */
function rowToRequest(row) {
  if (!row) return null;
  return {
    id: row.id,
    serviceId: row.serviceId,
    serviceName: row.serviceName,
    departmentId: row.departmentId,
    departmentName: row.departmentName,
    status: row.status,
    formData: JSON.parse(row.formData),
    citizenName: row.citizenName,
    citizenEmail: row.citizenEmail,
    submittedAt: row.submittedAt,
    updatedAt: row.updatedAt,
    notes: JSON.parse(row.notes),
    routedTo: JSON.parse(row.routedTo),
  };
}

/** Convert a JS request object to flat params for SQLite */
function requestToRow(req) {
  return {
    id: req.id,
    serviceId: req.serviceId,
    serviceName: req.serviceName,
    departmentId: req.departmentId,
    departmentName: req.departmentName || "",
    status: req.status,
    formData: JSON.stringify(req.formData),
    citizenName: req.citizenName,
    citizenEmail: req.citizenEmail || "",
    submittedAt: req.submittedAt,
    updatedAt: req.updatedAt,
    notes: JSON.stringify(req.notes || []),
    routedTo: JSON.stringify(req.routedTo || []),
  };
}

/* ==========================================================================
   PUBLIC API — same interface as old db.js
   ========================================================================== */

function getRequests() {
  return stmts.getAllRequests.all().map(rowToRequest);
}

function getRequestById(id) {
  return rowToRequest(stmts.getRequestById.get(id));
}

function createRequest(request) {
  stmts.insertRequest.run(requestToRow(request));
  return request;
}

function updateRequest(id, updates) {
  const existing = rowToRequest(stmts.getRequestById.get(id));
  if (!existing) return null;
  Object.assign(existing, updates);
  existing.updatedAt = new Date().toISOString();
  stmts.updateRequest.run(requestToRow(existing));
  return existing;
}

function deleteRequest(id) {
  const result = stmts.deleteRequest.run(id);
  return result.changes > 0;
}

/* ---- Emergency Contacts ---- */

function getEmergencyContacts() {
  return stmts.getAllEC.all();
}

function updateEmergencyContacts(contacts) {
  const tx = sqlite.transaction((list) => {
    stmts.deleteAllEC.run();
    for (const c of list) {
      stmts.insertEC.run({
        id: c.id || (c.category + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6)),
        label: c.label,
        number: c.number,
        category: c.category || "MDRRMO",
      });
    }
  });
  tx(contacts);
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
   EXPORTS — identical to old db.js
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
