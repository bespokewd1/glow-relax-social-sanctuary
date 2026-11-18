import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Pass the approved original file; preserve the whole design without cropping.
const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/prepare-logo.mjs <approved-logo.png>");

const destination = new URL("../public/images/logo/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const width of [80, 160, 320]) {
  const info = await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(fileURLToPath(new URL(`glow-relax-${width}.webp`, destination)));
  console.log(`${width}: ${info.width} x ${info.height}, ${info.size} bytes`);
}
