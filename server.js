require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const emailService = require("./email");
const db = require("./db");

const PORT = 3000;

// Initialize email service
emailService.init();

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

// Map clean URLs to HTML files
const routes = {
  "/": "/public/index.html",
  "/services": "/public/services.html",
  "/emergency": "/public/emergency.html",
  "/admin": "/public/admin.html",
  "/dashboard": "/public/dashboard.html",
};

// ── Helper: parse JSON body ──────────────────────────────────────────────
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(e); }
    });
  });
}

// ── Helper: send JSON response ───────────────────────────────────────────
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0];

  // ── CORS preflight ───────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // =====================================================================
  //  DATABASE API — Request CRUD
  // =====================================================================

  // ── GET /api/requests — List all requests ───────────────────────────
  if (urlPath === "/api/requests" && req.method === "GET") {
    sendJSON(res, 200, db.getRequests());
    return;
  }

  // ── GET /api/requests/:id — Get single request ──────────────────────
  if (urlPath.startsWith("/api/requests/") && req.method === "GET") {
    const id = urlPath.split("/api/requests/")[1];
    const request = db.getRequestById(id);
    if (!request) return sendJSON(res, 404, { error: "Request not found" });
    sendJSON(res, 200, request);
    return;
  }

  // ── POST /api/requests — Create new request ─────────────────────────
  if (urlPath === "/api/requests" && req.method === "POST") {
    try {
      const request = await parseBody(req);
      if (!request.id || !request.serviceId) {
        return sendJSON(res, 400, { error: "Missing required fields" });
      }
      const created = db.createRequest(request);
      console.log(`📝 New request: ${created.id} — ${created.serviceName}`);
      sendJSON(res, 201, created);
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
    return;
  }

  // ── PUT /api/requests/:id — Update request ──────────────────────────
  if (urlPath.startsWith("/api/requests/") && req.method === "PUT") {
    try {
      const id = urlPath.split("/api/requests/")[1];
      const updates = await parseBody(req);
      const updated = db.updateRequest(id, updates);
      if (!updated) return sendJSON(res, 404, { error: "Request not found" });
      console.log(`✏️  Updated: ${id} — status: ${updated.status}`);
      sendJSON(res, 200, updated);
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
    return;
  }

  // ── DELETE /api/requests/:id — Delete request ───────────────────────
  if (urlPath.startsWith("/api/requests/") && req.method === "DELETE") {
    const id = urlPath.split("/api/requests/")[1];
    const deleted = db.deleteRequest(id);
    if (!deleted) return sendJSON(res, 404, { error: "Request not found" });
    console.log(`🗑️  Deleted: ${id}`);
    sendJSON(res, 200, { success: true });
    return;
  }

  // ── POST /api/seed — Seed demo data ─────────────────────────────────
  if (urlPath === "/api/seed" && req.method === "POST") {
    try {
      const { requests, force } = await parseBody(req);
      if (!force && db.isDemoLoaded()) {
        return sendJSON(res, 200, { seeded: false, message: "Demo already loaded" });
      }
      if (Array.isArray(requests)) {
        requests.forEach((r) => db.createRequest(r));
        db.markDemoLoaded();
        console.log(`🌱 Seeded ${requests.length} demo requests`);
      }
      sendJSON(res, 200, { seeded: true, count: requests.length });
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
    return;
  }

  // ── GET /api/demo-status — Check if demo data is loaded ─────────────
  if (urlPath === "/api/demo-status" && req.method === "GET") {
    sendJSON(res, 200, { demoLoaded: db.isDemoLoaded() });
    return;
  }

  // =====================================================================
  //  EMAIL API
  // =====================================================================

  // ── API: Send submission confirmation email ──────────────────────────
  if (urlPath === "/api/email/submission" && req.method === "POST") {
    try {
      const { email, citizenName, serviceName, deptName, txnId } = await parseBody(req);
      if (!email || !txnId) {
        return sendJSON(res, 400, { error: "Missing email or txnId" });
      }
      const result = await emailService.sendSubmissionConfirmation(email, citizenName, serviceName, deptName, txnId);
      sendJSON(res, 200, { success: true, ...result });
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
    return;
  }

  // ── API: Send status update email ────────────────────────────────────
  if (urlPath === "/api/email/status" && req.method === "POST") {
    try {
      const { email, citizenName, serviceName, newStatus, txnId, note } = await parseBody(req);
      if (!email || !txnId || !newStatus) {
        return sendJSON(res, 400, { error: "Missing required fields" });
      }
      const result = await emailService.sendStatusUpdate(email, citizenName, serviceName, newStatus, txnId, note);
      sendJSON(res, 200, { success: true, ...result });
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
    return;
  }

  // ── API: Send route notification email ───────────────────────────────
  if (urlPath === "/api/email/route" && req.method === "POST") {
    try {
      const { email, citizenName, serviceName, fromDept, toDept, txnId } = await parseBody(req);
      if (!email || !txnId) {
        return sendJSON(res, 400, { error: "Missing required fields" });
      }
      const result = await emailService.sendRouteNotification(email, citizenName, serviceName, fromDept, toDept, txnId);
      sendJSON(res, 200, { success: true, ...result });
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
    return;
  }

  // ── API: Check email config status ───────────────────────────────────
  if (urlPath === "/api/email/status-check" && req.method === "GET") {
    sendJSON(res, 200, {
      configured: !!(process.env.EMAIL_USER && process.env.EMAIL_USER !== "your-email@gmail.com"),
      sender: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{3}).*(@.*)/, "$1***$2") : null,
    });
    return;
  }

  // ── Static file serving ──────────────────────────────────────────────
  let filePath;
  if (routes[urlPath]) {
    filePath = path.join(__dirname, routes[urlPath]);
  } else {
    filePath = path.join(__dirname, "public", urlPath);
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        fs.readFile(
          path.join(__dirname, "public", "index.html"),
          (err404, fallback) => {
            if (err404) {
              res.writeHead(500);
              res.end("Internal Server Error");
              return;
            }
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(fallback);
          }
        );
      } else {
        res.writeHead(500);
        res.end("Internal Server Error");
      }
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Catarman Portal running at http://localhost:${PORT}`);
  console.log(`📁 Database: ${path.resolve("db.json")}`);
});
