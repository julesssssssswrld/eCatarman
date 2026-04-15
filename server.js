const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

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
};

// Map clean URLs to HTML files
const routes = {
  "/": "/public/index.html",
  "/services": "/public/services.html",
  "/emergency": "/public/emergency.html",
};

const server = http.createServer((req, res) => {
  // Strip query strings
  const urlPath = req.url.split("?")[0];

  // Check for route match first
  let filePath;
  if (routes[urlPath]) {
    filePath = path.join(__dirname, routes[urlPath]);
  } else {
    // Serve static files from /public
    filePath = path.join(__dirname, "public", urlPath);
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // 404 — serve home page as fallback
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
