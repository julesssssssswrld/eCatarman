/* ==========================================================================
   eCatarman — Server-Side JSON Database
   Persists all request data to db.json on disk
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

// Default structure
const DEFAULT_DB = {
  requests: [],
  demoLoaded: false,
};

/* ---- Read ---- */
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(DEFAULT_DB);
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("⚠ DB read error, resetting:", e.message);
    writeDB(DEFAULT_DB);
    return DEFAULT_DB;
  }
}

/* ---- Write ---- */
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/* ---- Requests CRUD ---- */

function getRequests() {
  return readDB().requests;
}

function getRequestById(id) {
  return getRequests().find((r) => r.id === id) || null;
}

function createRequest(request) {
  const db = readDB();
  db.requests.push(request);
  writeDB(db);
  return request;
}

function updateRequest(id, updates) {
  const db = readDB();
  const idx = db.requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  Object.assign(db.requests[idx], updates);
  db.requests[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.requests[idx];
}

function deleteRequest(id) {
  const db = readDB();
  const before = db.requests.length;
  db.requests = db.requests.filter((r) => r.id !== id);
  writeDB(db);
  return db.requests.length < before;
}

/* ---- Demo Seeder ---- */
function isDemoLoaded() {
  return readDB().demoLoaded;
}

function markDemoLoaded() {
  const db = readDB();
  db.demoLoaded = true;
  writeDB(db);
}

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  isDemoLoaded,
  markDemoLoaded,
};
