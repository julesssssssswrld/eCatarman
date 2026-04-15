require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const emailService = require("./email");

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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

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
});
