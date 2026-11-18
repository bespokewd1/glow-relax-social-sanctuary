# SEO and social cards

Every existing page has its own authored 1200 x 630 PNG card, including policies and draft blog posts. Drafts remain noindex. The global card is a fallback for unexpected routes, not a substitute for known page cards.

## Build and preview

Run the normal development or production build command. Card export runs before the app starts or builds. The exporter uses local copies of the existing photos and fonts, with the business name as a typographic wordmark, so repeated builds do not download imagery.

```powershell
bun run dev
bun run build
```

To regenerate cards without starting or building the app, use `bun run generate:og`.

In development, open `/dev/og`. The gallery displays the final PNGs and provides links to open their full-size files. Review the card headlines and action lines here. The gallery is noindex, excluded from the sitemap, and unavailable in production. The exported PNGs remain public in production for social crawlers.

The card artwork is composed in code. Satori renders the layout to SVG and Sharp converts it to PNG. There is no screenshot capture, external image-generation API, or request-time image renderer. Dependencies used for exporting cards stay in the build tooling.

## Content and design

- Business facts, services, and image-source references belong in `src/lib/site.ts`.
- Blog content, draft status, and blog image references belong in `src/lib/blog.ts`.
- `src/lib/og-cards.ts` defines concise card headlines, labels, supporting copy, action lines, and route mapping. Artwork copy is separate from search metadata so each can fit its purpose.
- `scripts/generate-og.tsx` owns the shared visual composition and static export. Follow the current website's typography and palette when changing it.
- `src/lib/og-manifest.json` is generated. Do not edit it manually.
- `src/lib/seo.ts` publishes the corresponding image descriptors through `pageHead()` and keeps self-canonicals on `https://glowandrelax.ca`.
- `src/lib/seo-origin.ts` resolves image URLs against the current request origin during SSR and the browser origin during navigation. Preview deployments therefore reference their own exported PNGs. Canonical URLs and `og:url` continue to use the production domain.

To replace a photograph, update its central source reference and the corresponding local copy used by the exporter. Keep the source and attribution record with the assets. Review the crop in the gallery. A photo is cropped to its panel without stretching; do not use stock photography as evidence of the actual studio or staff.

`OG_ASSETS` in `src/lib/site.ts` maps remote source URLs to local photo files and identifies local font files. `bun run sync:og-assets` explicitly downloads the mapped photographs again; it requires network access and is a maintenance command, not part of normal builds. Regenerate cards after synchronizing. See `assets/og/README.md` for asset records and font licensing.

Image filenames include a hash of artwork inputs. Changing copy, photos, fonts, branding, or the template version changes the image URL. Unchanged inputs should retain their URLs. Platforms may still cache page metadata, so a deployed inspector rescan may be needed after publishing.

## Validate all pages

Start the app locally, then run the checker against its actual origin:

```powershell
bun run check:og --base-url http://localhost:3000
```

Use the port printed by the development server. To check production behavior against a local production server, append `--production`:

```powershell
bun run check:og --base-url http://localhost:3000 --production
```

The checker fetches rendered HTML, not just source metadata. It verifies all route and blog coverage, unique titles/descriptions/cards, required OG/X fields, title and description targets, canonical URLs, alt text, manifest/file agreement, actual decoded PNG dimensions, HTTP image availability, draft noindex, sitemap coverage, and preview behavior. It fetches the exact absolute URL declared in `og:image`, including its hostname, and checks that it points to the deployment being tested. This prevents local assets from masking an unavailable image on another host. HTTPS is required except for local QA hosts. It writes `.scratch/opengraph-baseline/check-report.json` and exits unsuccessfully if checks fail.

The baseline and original findings are in `.scratch/opengraph-baseline/baseline.md`. The inspector's unidentified ninth passing check is kept unconfirmed. The 60-character title, 125-character shared description, and inherited 2 MiB image guard are project targets rather than universal platform hard limits.

Local verification found that the current framework's `vite preview` integration expects `dist/server/server.js`, while the build emits `.output`. To reproduce the compiled production checks without changing the deployment setup, run `node .scratch/opengraph-baseline/production-check-server.mjs` after building, then use `bun run check:og --base-url http://127.0.0.1:4174 --production`. This QA adapter invokes the compiled Cloudflare handler and supplies its public asset binding from `.output/public`; it is not a deployed Cloudflare emulator.

The report distinguishes verified passes, failures, warnings, and unverified visual checks. Checking that authored headline and action text exist does not prove that the exported text is legible. Review the gallery for cropping, clipping, contrast, and relevant images. Local checks also cannot prove remote crawler access or clear platform caches; perform a representative deployed check after publishing.
