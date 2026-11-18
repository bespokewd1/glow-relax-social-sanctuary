# Old project OG image workflow

Inspected: 2026-11-18, read-only.

Reference project: `F:/projects/part-time/glow-and-relax`.

## What exists

The current old-project implementation composes branded cards in code, renders them to static PNGs, and presents the resulting images on a development-only noindex gallery. It does not screenshot HTML sections on the gallery page. This describes the files currently on disk; it does not establish whether an earlier version used a different process.

No AI image creation or external image API is involved in this pipeline. Existing photographs, a logo, fonts, and authored text make up the artwork.

## Source files and responsibilities

All paths in this table are relative to the reference project.

| File | Responsibility |
| --- | --- |
| `docs/seo-and-social-images.md` | Documents the workflow, editing controls, fallbacks, preview, builds, and checks. |
| `src/lib/seo.ts` | Defines 1200 x 630 dimensions, card copy, source assets, page/service mapping, fallback rules, alt text, and hashed image URLs. |
| `src/lib/og-image.tsx` | Shared visual layout, Satori SVG rendering, and Sharp PNG conversion. |
| `src/pages/og/[card].png.ts` | Enumerates cards and serves their image bytes; the static build emits `/og/<key>-<hash>.png` files. |
| `src/pages/dev/[preview].astro` | Development gallery at `/dev/og/`, with `noindex, follow`; displays finished PNGs and links to full-size files and their pages. |
| `src/data/seo-pages.json` | Main-page SEO text, card photos, complete-card overrides, and alt-text settings. |
| `src/content/services/*.md` | Service titles/photos and optional SEO/image overrides. |
| `src/layouts/BaseLayout.astro` | Publishes absolute social image URLs, dimensions, PNG MIME type, alt text, canonical, and OG/X metadata. |
| `scripts/check-seo.mjs` | Checks built pages and image files without contacting social platforms. |

## How a card becomes an image

1. `getOgCards()` builds card descriptors for seven main pages, every service, and a global fallback. Descriptors include label, headline, detail, action, photo, route, and alt text.
2. The code reads local photo, logo, and font bytes. The URL hash includes card inputs, brand values, asset bytes, and `TEMPLATE_VERSION`.
3. `renderOgImage()` prepares the photo and logo with Sharp. Satori renders the authored JSX layout to SVG with local fonts. Sharp converts that SVG into a 1200 x 630 PNG.
4. The static image route writes each PNG as part of the production build. Existing files in `dist/og/` confirm image artifacts are present; this investigation did not rebuild or validate them.
5. Page metadata references the corresponding absolute PNG URL. X uses the same image as OG.
6. The preview gallery displays those same image outputs. It is a review/download utility, not the source of a browser screenshot export.

## Layout and design

- Warm cream canvas `#faf6ea`, dark text `#30352f`, green `#435b47`, and rose accents `#734c52` / `#a87579`.
- Left text panel is 700 pixels wide with 54-pixel horizontal padding; right photo source panel is 520 x 630. The panels overlap by 20 pixels.
- Logo, business name, and location appear at the top. A category label precedes a large headline and supporting detail. The bottom contains an action line, arrow, and hostname.
- Uses local Fraunces and Mona Sans fonts. Headline size changes according to text length: 68, 60, or 52 pixels.
- Photo is cropped to cover its panel using attention positioning. A thin inset border frames the photo area.
- An uploaded complete-card override bypasses the branded composition. It is fitted inside 1200 x 630 with cream padding to preserve its content.
- Card artwork text is independent of SEO titles and descriptions, allowing copy to fit the composition.

These design values document the old project. Any future implementation here should follow this project's current design and `SITE` business data rather than copy the old palette, fonts, or facts automatically.

## Noindex and production behavior

The gallery declares `<meta name="robots" content="noindex, follow" />`. Its `getStaticPaths()` returns no preview route in production, so `/dev/og/` is absent from the production build as well as the sitemap. Public PNGs remain available to social crawlers.

The reference documentation lists `npm run start` for local preview, `npm run build` for static output, and `npm run check:seo` for output validation. These commands were read from the reference project; they were not run during this investigation.

## Existing validation worth adapting

The old checker inspects seven main routes plus services. It checks one title with the brand once, nonempty distinct descriptions, matching social descriptions, distinct absolute OG image URLs on the production domain, matching X images, dimension/type/alt tags, actual PNG dimensions, page-specific `og:url`, expected card count, files below 2 MiB, and preview exclusion from the build and sitemap. It also contains a project-specific Cupping H1 assertion.

It does not implement the complete screenshot baseline: for example, it has no title/OG-description length checks or `og:site_name`/`twitter:card` assertions. It also does not cover this project's blog routes or perform live crawler checks. Adapt its approach rather than assuming its checker covers every requirement here.

## Possible direction for this project

Reuse the separation of card content, shared visual composition, static export, noindex preview, and rendered-output checks. Keep this project's `src/lib/site.ts`, `src/lib/blog.ts`, and `pageHead()` conventions. No renderer, dependencies, routes, metadata, or images were changed or added as part of this investigation.
