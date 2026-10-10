import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { addItem, createState, daysSince, loadState, normalizeState, recordDone, saveState } from "./store.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public");
const MIME = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml" };

function json(response, status, value) {
  const body = JSON.stringify(value);
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) reject(new Error("request body too large"));
    });
    request.on("end", () => resolveBody(body ? JSON.parse(body) : {}));
    request.on("error", reject);
  });
}

function itemView(item) {
  return { ...item, daysSince: daysSince(item) };
}

function safeStaticPath(publicDir, requestPath) {
  const decoded = decodeURIComponent(requestPath === "/" ? "/index.html" : requestPath);
  const candidate = resolve(publicDir, `.${normalize(decoded)}`);
  return candidate === publicDir || candidate.startsWith(`${publicDir}${sep}`) ? candidate : null;
}

export function createAppServer({ dataFile, publicDir = ROOT } = {}) {
  if (!dataFile) throw new Error("dataFile is required");
  mkdirSync(dirname(dataFile), { recursive: true });
  if (!existsSync(dataFile)) writeFileSync(dataFile, JSON.stringify(createState(), null, 2), "utf8");
  let state = normalizeState(JSON.parse(readFileSync(dataFile, "utf8")));

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://127.0.0.1");
      if (url.pathname === "/api/items" && request.method === "GET") return json(response, 200, { items: state.items.map(itemView) });

      if (url.pathname === "/api/items" && request.method === "POST") {
        const body = await readBody(request);
        const intervalDays = body.intervalDays === "" || body.intervalDays === undefined ? null : Number(body.intervalDays);
        state = addItem(state, { name: body.name, intervalDays });
        await saveState(dataFile, state);
        return json(response, 201, { item: itemView(state.items.at(-1)) });
      }

      const doneMatch = /^\/api\/items\/([^/]+)\/done$/.exec(url.pathname);
      if (doneMatch && request.method === "POST") {
        state = recordDone(state, decodeURIComponent(doneMatch[1]));
        await saveState(dataFile, state);
        return json(response, 200, { item: itemView(state.items.find((item) => item.id === decodeURIComponent(doneMatch[1]))) });
      }

      if (url.pathname === "/api/export" && request.method === "GET") return json(response, 200, state);
      if (request.method !== "GET" && request.method !== "HEAD") return json(response, 405, { error: "method not allowed" });

      const file = safeStaticPath(resolve(publicDir), url.pathname);
      if (!file || !existsSync(file)) return response.writeHead(404).end("Not found");
      response.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
      if (request.method === "HEAD") return response.end();
      return createReadStream(file).pipe(response);
    } catch (error) {
      const status = /required|unknown item|positive integer|invalid|JSON|too large/i.test(error.message) ? 400 : 500;
      return json(response, status, { error: error.message });
    }
  });
}

export async function startServer(options) {
  const server = createAppServer(options);
  const port = await new Promise((resolvePort, reject) => {
    server.once("error", reject);
    server.listen(options.port ?? 23456, "127.0.0.1", () => resolvePort(server.address().port));
  });
  return { server, port };
}
