// Local QA adapter for the compiled Cloudflare handler and public asset binding.
// Run from the repository root after building; this does not deploy the app.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import worker from "../../.output/server/index.mjs";

const publicRoot = resolve(".output/public");
const types = { ".png": "image/png", ".xml": "application/xml", ".css": "text/css", ".js": "text/javascript", ".ico": "image/x-icon", ".txt": "text/plain" };
const assets = {
  async fetch(request) {
    const target = resolve(publicRoot, `.${decodeURIComponent(new URL(request.url).pathname)}`);
    if (!target.startsWith(publicRoot + sep)) return new Response("Not found", { status: 404 });
    try {
      return new Response(await readFile(target), { headers: { "content-type": types[extname(target)] || "application/octet-stream" } });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
};
createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(`http://127.0.0.1:4174${incoming.url}`, { headers: incoming.headers });
    const response = await worker.fetch(request, { ASSETS: assets }, { waitUntil() {}, passThroughOnException() {} });
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500).end();
  }
}).listen(4174, "127.0.0.1", () => console.log("Compiled production QA handler: http://127.0.0.1:4174"));
