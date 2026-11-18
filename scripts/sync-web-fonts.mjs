import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Pin the same Latin WOFF2 font binaries observed in the homepage Lighthouse run.
// This is an explicit maintenance command, never part of the production build.
const destination = new URL("../public/fonts/", import.meta.url);
const sources = [
  [
    "cormorant-garamond-latin.woff2",
    "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtKky2F7g.woff2",
  ],
  ["mulish-latin.woff2", "https://fonts.gstatic.com/s/mulish/v18/1Ptvg83HX_SGhgqk3wotYKNnBQ.woff2"],
  [
    "Cormorant-Garamond-OFL.txt",
    "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt",
  ],
  ["Mulish-OFL.txt", "https://raw.githubusercontent.com/google/fonts/main/ofl/mulish/OFL.txt"],
];

await mkdir(destination, { recursive: true });
for (const [name, source] of sources) {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`${response.status} downloading ${source}`);
  const downloaded = Buffer.from(await response.arrayBuffer());
  const bytes = name.endsWith(".txt")
    ? Buffer.from(downloaded.toString().replace(/[ \t]+$/gm, ""))
    : downloaded;
  if (name.endsWith(".woff2") && bytes.subarray(0, 4).toString() !== "wOF2") {
    throw new Error(`Invalid WOFF2 file: ${name}`);
  }
  if (name.endsWith(".txt") && !bytes.toString().includes("SIL OPEN FONT LICENSE")) {
    throw new Error(`Missing font license: ${name}`);
  }
  await writeFile(new URL(name, destination), bytes);
  console.log(
    `${name}: ${bytes.length} bytes, sha256 ${createHash("sha256").update(bytes).digest("hex")}`,
  );
}
