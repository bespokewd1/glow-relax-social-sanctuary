import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";
import { OG_ASSETS } from "../src/lib/site";

// Explicit maintenance command only. Normal builds read checked-in local photos.
for (const [source, destination] of Object.entries(OG_ASSETS.photos)) {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`Cannot download OG photo: ${source} (${response.status})`);
  const photo = await sharp(Buffer.from(await response.arrayBuffer()))
    .rotate()
    .jpeg({ quality: 92 })
    .toBuffer();
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, photo);
  console.log(`Saved ${destination}`);
}
