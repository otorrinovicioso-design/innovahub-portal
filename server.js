const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const configuredPort = Number(process.env.PORT || 5500);
const host = process.env.HOST || "localhost";
const preferredPort = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 5500;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8"
};

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const filePath = path.normalize(path.join(root, pathname));
    const relativePath = path.relative(root, filePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("No encontrado");
        return;
      }
      res.writeHead(200, {
        "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
      });
      res.end(data);
    });
  });
}

function listen(port, attempts = 0) {
  const server = createServer();
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts < 20) listen(port + 1, attempts + 1);
    else throw error;
  });
  server.listen(port, host, () => {
    const url = "http://" + host + ":" + port;
    console.log("Innova Hub Local activo: " + url);
    if (process.env.NO_OPEN !== "1") {
      require("child_process").execFile("open", [url]);
    }
  });
}

listen(preferredPort);
