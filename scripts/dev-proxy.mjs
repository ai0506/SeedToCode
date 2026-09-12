/*
 * 本地联测用的同源外壳。只在开发机上跑，不属于产品运行时。
 *
 * 页面第一版只认同源的 /auth 和 /api，这样 HttpOnly 会话 cookie 天然可用，
 * 不需要为跨域放宽任何东西。但本地开发时静态文件和 Worker 是两个进程，
 * 于是这里把它们拼到一个端口后面：/auth 和 /api 转给 Worker，其余交给 web/。
 *
 *   node scripts/dev-proxy.mjs
 *
 * 端口和 Worker 地址都从环境变量读，没有写死的地址：
 *   SEEDTOCODE_DEV_PORT     这个外壳监听的端口（默认 8123）
 *   SEEDTOCODE_API_TARGET   wrangler dev 的地址（默认 http://127.0.0.1:8787）
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("../", import.meta.url)), "web");
const PORT = Number(process.env.SEEDTOCODE_DEV_PORT || 8123);
const TARGET = process.env.SEEDTOCODE_API_TARGET || "http://127.0.0.1:8787";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function isApi(pathname) {
  return pathname === "/health" || pathname.startsWith("/api/") || pathname.startsWith("/auth/");
}

async function proxy(request, response, url) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (name === "host" || name === "connection" || name === "content-length") continue;
    headers.set(name, Array.isArray(value) ? value.join(", ") : String(value));
  }
  let upstream;
  try {
    upstream = await fetch(TARGET + url.pathname + url.search, {
      method: request.method,
      headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
      redirect: "manual"
    });
  } catch (error) {
    response.writeHead(502, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ code: "SERVER_NOT_CONFIGURED", message: "本地 Worker 没有在运行。" }));
    return;
  }
  const out = {};
  upstream.headers.forEach((value, name) => {
    if (name === "content-encoding" || name === "content-length" || name === "transfer-encoding") return;
    out[name] = value;
  });
  const setCookie = typeof upstream.headers.getSetCookie === "function" ? upstream.headers.getSetCookie() : null;
  if (setCookie && setCookie.length) out["set-cookie"] = setCookie;
  response.writeHead(upstream.status, out);
  response.end(Buffer.from(await upstream.arrayBuffer()));
}

async function serveStatic(response, pathname) {
  const relative = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^(\.\.[/\\])+/, "");
  const file = join(ROOT, relative);
  if (!file.startsWith(ROOT)) { response.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (isApi(url.pathname)) void proxy(request, response, url);
  else void serveStatic(response, url.pathname);
}).listen(PORT, () => {
  console.log(`dev shell on http://localhost:${PORT} (api -> ${TARGET})`);
});
