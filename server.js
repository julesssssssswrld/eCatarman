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

// ── Helper: parse multipart form data (for file uploads) ─────────────────
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] || "";
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) return reject(new Error("No boundary in content-type"));
    const boundary = "--" + boundaryMatch[1];

    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const parts = [];
      const boundaryBuf = Buffer.from(boundary);
      let start = 0;

      // Split by boundary
      while (true) {
        const idx = buffer.indexOf(boundaryBuf, start);
        if (idx === -1) break;
        if (start > 0) {
          const partData = buffer.slice(start, idx - 2); // -2 for \r\n
          const headerEnd = partData.indexOf("\r\n\r\n");
          if (headerEnd !== -1) {
            const headers = partData.slice(0, headerEnd).toString();
            const body = partData.slice(headerEnd + 4);
            const nameMatch = headers.match(/name="([^"]+)"/);
            const filenameMatch = headers.match(/filename="([^"]+)"/);
            const typeMatch = headers.match(/Content-Type:\s*(.+)/i);
            parts.push({
              name: nameMatch ? nameMatch[1] : "unknown",
              filename: filenameMatch ? filenameMatch[1] : null,
              contentType: typeMatch ? typeMatch[1].trim() : null,
              data: body,
            });
          }
        }
        start = idx + boundaryBuf.length + 2; // +2 for \r\n
      }
      resolve(parts);
    });
    req.on("error", reject);
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

// =====================================================================
//  RATE LIMITER — In-memory, per-IP, per-route
// =====================================================================
const rateLimitStore = {};   // { "ip:route": { count, resetAt } }

/**
 * Check rate limit. Returns true if request is allowed, false if blocked.
 * @param {string} ip     — client IP
 * @param {string} route  — route key (e.g. "/api/email")
 * @param {number} limit  — max requests per window
 * @param {number} windowMs — window duration in ms
 */
function rateLimit(ip, route, limit, windowMs) {
  const key = ip + ":" + route;
  const now = Date.now();

  if (!rateLimitStore[key] || now > rateLimitStore[key].resetAt) {
    rateLimitStore[key] = { count: 1, resetAt: now + windowMs };
    return { allowed: true, remaining: limit - 1 };
  }

  rateLimitStore[key].count++;

  if (rateLimitStore[key].count > limit) {
    const retryAfter = Math.ceil((rateLimitStore[key].resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter: retryAfter };
  }

  return { allowed: true, remaining: limit - rateLimitStore[key].count };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in rateLimitStore) {
    if (now > rateLimitStore[key].resetAt) delete rateLimitStore[key];
  }
}, 5 * 60 * 1000);

// ── Helper: get client IP ────────────────────────────────────────────────
function getClientIP(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
         req.socket.remoteAddress || "unknown";
}

// ── Helper: send 429 Too Many Requests ───────────────────────────────────
function sendRateLimited(res, retryAfter) {
  res.writeHead(429, {
    "Content-Type": "application/json",
    "Retry-After": String(retryAfter),
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify({
    error: "Too many requests. Please try again in " + retryAfter + " seconds.",
    retryAfter: retryAfter,
  }));
}

// =====================================================================
//  DUPLICATE SUBMISSION TRACKER
// =====================================================================
const recentSubmissions = {}; // { "citizenName:serviceId": timestamp }
const DUPLICATE_WINDOW_MS = 60 * 1000; // 60 seconds

function isDuplicateSubmission(citizenName, serviceId) {
  const key = (citizenName || "").toLowerCase() + ":" + serviceId;
  const now = Date.now();
  if (recentSubmissions[key] && (now - recentSubmissions[key]) < DUPLICATE_WINDOW_MS) {
    return true;
  }
  recentSubmissions[key] = now;
  return false;
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0];
  const clientIP = getClientIP(req);

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
  //  RATE LIMIT — Apply to sensitive endpoints
  // =====================================================================

  // Login page & admin routes: 10 requests per 60 seconds
  if (urlPath === "/admin" || urlPath === "/dashboard") {
    const rl = rateLimit(clientIP, "admin", 10, 60 * 1000);
    if (!rl.allowed) {
      console.log(`🚫 Rate limited: ${clientIP} on ${urlPath}`);
      return sendRateLimited(res, rl.retryAfter);
    }
  }

  // Email endpoints: 5 emails per 60 seconds
  if (urlPath.startsWith("/api/email/") && req.method === "POST") {
    const rl = rateLimit(clientIP, "email", 5, 60 * 1000);
    if (!rl.allowed) {
      console.log(`🚫 Rate limited: ${clientIP} on email API`);
      return sendRateLimited(res, rl.retryAfter);
    }
  }

  // Request creation: 10 per 60 seconds
  if (urlPath === "/api/requests" && req.method === "POST") {
    const rl = rateLimit(clientIP, "requests-post", 10, 60 * 1000);
    if (!rl.allowed) {
      console.log(`🚫 Rate limited: ${clientIP} on request creation`);
      return sendRateLimited(res, rl.retryAfter);
    }
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

      // Duplicate submission check
      if (isDuplicateSubmission(request.citizenName, request.serviceId)) {
        console.log(`⚠️  Duplicate blocked: ${request.citizenName} — ${request.serviceName}`);
        return sendJSON(res, 409, {
          error: "duplicate",
          message: "A similar request was already submitted. Please wait before submitting again.",
        });
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
  //  FILE UPLOAD API
  // =====================================================================

  // ── POST /api/upload — Upload supporting documents ──────────────────
  if (urlPath === "/api/upload" && req.method === "POST") {
    try {
      const parts = await parseMultipart(req);
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const savedFiles = [];
      const ALLOWED_TYPES = [
        "application/pdf",
        "image/jpeg", "image/jpg", "image/png", "image/webp",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB per file

      for (const part of parts) {
        if (!part.filename) continue;
        if (!ALLOWED_TYPES.includes(part.contentType)) {
          return sendJSON(res, 400, { error: `File type not allowed: ${part.contentType}` });
        }
        if (part.data.length > MAX_SIZE) {
          return sendJSON(res, 400, { error: `File too large: ${part.filename} (max 10MB)` });
        }

        const ext = path.extname(part.filename).toLowerCase();
        const safeName = Date.now() + "-" + Math.random().toString(36).substring(2, 8) + ext;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, part.data);

        savedFiles.push({
          originalName: part.filename,
          storedName: safeName,
          url: "/uploads/" + safeName,
          size: part.data.length,
          type: part.contentType,
        });
        console.log(`📎 Uploaded: ${part.filename} → ${safeName}`);
      }

      sendJSON(res, 200, { files: savedFiles });
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
    return;
  }

  // ── Serve uploaded files: /uploads/* ─────────────────────────────────
  if (urlPath.startsWith("/uploads/") && req.method === "GET") {
    const fileName = path.basename(urlPath);
    const filePath = path.join(__dirname, "uploads", fileName);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(fileName).toLowerCase();
      const mime = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end("File not found");
    }
    return;
  }

  // =====================================================================
  //  EMERGENCY CONTACTS API
  // =====================================================================

  // ── GET /api/emergency-contacts — List all emergency contacts ────────
  if (urlPath === "/api/emergency-contacts" && req.method === "GET") {
    sendJSON(res, 200, db.getEmergencyContacts());
    return;
  }

  // ── PUT /api/emergency-contacts — Update all emergency contacts ──────
  if (urlPath === "/api/emergency-contacts" && req.method === "PUT") {
    try {
      const contacts = await parseBody(req);
      if (!Array.isArray(contacts)) {
        return sendJSON(res, 400, { error: "Must be an array of contacts" });
      }
      const updated = db.updateEmergencyContacts(contacts);
      console.log(`📞 Emergency contacts updated (${updated.length} entries)`);
      sendJSON(res, 200, { success: true, contacts: updated });
    } catch (err) {
      sendJSON(res, 500, { error: err.message });
    }
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
  console.log(`📁 Database: ${path.resolve("ecatarman.sqlite")} (SQLite)`);
});
