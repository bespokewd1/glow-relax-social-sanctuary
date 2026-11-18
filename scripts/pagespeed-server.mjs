// Local production adapter for repeatable Lighthouse audits. Does not deploy.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const buildRoot = resolve(process.env.PSI_BUILD_ROOT || ".output");
const publicRoot = resolve(buildRoot, "public");
const port = Number(process.env.PSI_PORT || 4175);
const { default: worker } = await import(
  pathToFileURL(resolve(buildRoot, "server/index.mjs")).href
);
const types = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".css": "text/css",
  ".js": "text/javascript",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};
const assets = {
  async fetch(request) {
    const target = resolve(publicRoot, `.${decodeURIComponent(new URL(request.url).pathname)}`);
    if (!target.startsWith(publicRoot + sep)) return new Response("Not found", { status: 404 });
    try {
      return new Response(await readFile(target), {
        headers: { "content-type": types[extname(target)] || "application/octet-stream" },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
};
createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, {
      headers: incoming.headers,
    });
    const response = await worker.fetch(
      request,
      { ASSETS: assets },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const headers = Object.fromEntries(response.headers);
    let body = Buffer.from(await response.arrayBuffer());
    if (
      /text|javascript|json|xml/.test(headers["content-type"] || "") &&
      incoming.headers["accept-encoding"]?.includes("gzip")
    ) {
      body = gzipSync(body);
      headers["content-encoding"] = "gzip";
      headers.vary = "Accept-Encoding";
      delete headers["content-length"];
    }
    outgoing.writeHead(response.status, headers);
    outgoing.end(incoming.method === "HEAD" ? undefined : body);
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500).end();
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Production audit server: http://127.0.0.1:${port} (${buildRoot})`),
);
