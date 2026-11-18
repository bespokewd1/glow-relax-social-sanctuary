import React from "react";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile, readdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { OG_CARDS } from "../src/lib/og-cards";
import { OG_ASSETS, SITE } from "../src/lib/site";

const WIDTH = 1200;
const HEIGHT = 630;
const TEMPLATE_VERSION = 1;
const outputDirectory = resolve("public/og");
const fontFiles = await Promise.all(Object.values(OG_ASSETS.fonts).map((file) => readFile(file)));
const [displayFont, regularFont, boldFont] = fontFiles;
// Include the renderer's source as well as template version to invalidate any visual edit.
const template = await readFile(new URL(import.meta.url));
const manifest: Record<
  string,
  { src: string; width: number; height: number; type: string; alt: string }
> = {};
const expectedFiles = new Set<string>();
await mkdir(outputDirectory, { recursive: true });

for (const card of OG_CARDS) {
  const inputPath = OG_ASSETS.photos[card.photo];
  if (!inputPath) throw new Error(`No local photo configured for ${card.key}: ${card.photo}`);
  const source = await readFile(inputPath);
  const photo = await sharp(source)
    .rotate()
    .resize(500, HEIGHT, { fit: "cover", position: "attention" })
    .jpeg({ quality: 92 })
    .toBuffer();
  const hash = createHash("sha256")
    .update(String(TEMPLATE_VERSION))
    .update(template)
    .update(JSON.stringify(card))
    .update(SITE.name)
    .update(SITE.address.city)
    .update(SITE.address.regionFull)
    .update(SITE.url)
    .update(source);
  for (const font of fontFiles) hash.update(font);
  const filename = `${card.key}-${hash.digest("hex").slice(0, 12)}.png`;
  expectedFiles.add(filename);
  const headlineLength = card.headline.length;
  const fontSize = headlineLength > 65 ? 54 : headlineLength > 45 ? 62 : 74;
  const svg = await satori(
    <div
      style={{
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        background: "#f8f3ed",
        color: "#2d332b",
        fontFamily: "Mulish",
        position: "relative",
      }}
    >
      <img
        src={`data:image/jpeg;base64,${photo.toString("base64")}`}
        width={500}
        height={HEIGHT}
        style={{ position: "absolute", right: 0, top: 0 }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 24,
          top: 24,
          bottom: 24,
          width: 452,
          border: "1px solid rgba(255,255,255,0.75)",
        }}
      />
      <div
        style={{
          display: "flex",
          width: 700,
          height: HEIGHT,
          boxSizing: "border-box",
          background: "#f8f3ed",
          padding: "38px 48px 34px",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #d7c9b9",
            paddingBottom: 23,
          }}
        >
          <div
            style={{
              fontFamily: "Cormorant Garamond",
              fontWeight: 500,
              color: "#34452f",
              fontSize: 43,
              letterSpacing: -1,
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              display: "flex",
              width: 120,
              textAlign: "right",
              fontSize: 13,
              lineHeight: 1.5,
              color: "#665b50",
            }}
          >{`${SITE.address.city}, ${SITE.address.regionFull}`}</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 27,
            color: "#97665e",
            fontSize: 14,
            letterSpacing: 2.8,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {card.label}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            paddingTop: 10,
            paddingBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Cormorant Garamond",
              fontWeight: 500,
              fontSize,
              lineHeight: 1.02,
              letterSpacing: -1.3,
              whiteSpace: "pre-wrap",
            }}
          >
            {card.headline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 21,
              lineHeight: 1.45,
              color: "#665b50",
              marginTop: 22,
            }}
          >
            {card.detail}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #d7c9b9",
            paddingTop: 21,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#34452f",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {card.action}
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginLeft: 10 }}>
              <path d="M4 12h15m-6-6 6 6-6 6" stroke="#34452f" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div style={{ fontSize: 13, color: "#665b50" }}>{new URL(SITE.url).hostname}</div>
        </div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Cormorant Garamond", data: displayFont, weight: 500, style: "normal" },
        { name: "Mulish", data: regularFont, weight: 400, style: "normal" },
        { name: "Mulish", data: boldFont, weight: 700, style: "normal" },
      ],
    },
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  if (png.length >= 2 * 1024 * 1024) throw new Error(`${card.key}: card exceeds 2 MiB`);
  await writeFile(resolve(outputDirectory, filename), png);
  manifest[card.path] = {
    src: `/og/${filename}`,
    width: WIDTH,
    height: HEIGHT,
    type: "image/png",
    alt: card.alt,
  };
}

// Remove only generated PNGs from this dedicated, resolved output directory.
for (const filename of await readdir(outputDirectory)) {
  if (/^[a-z0-9-]+-[a-f0-9]{12}\.png$/.test(filename) && !expectedFiles.has(filename)) {
    await unlink(resolve(outputDirectory, filename));
  }
}
await writeFile("src/lib/og-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Exported ${OG_CARDS.length} OG cards at ${WIDTH} x ${HEIGHT}. No network requests required.`,
);
