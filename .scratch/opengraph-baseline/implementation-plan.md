# OG image implementation plan

Recorded: 2026-11-18. Status: implemented and locally verified in development and the compiled production handler.

## Agreed direction

Adopt the old project's authored-card rendering process for this project's OG images. Compose cards from existing photography, brand assets, and text; render the composition to SVG with Satori and convert it to a 1200 x 630 PNG with Sharp. Provide a noindex preview gallery for reviewing and opening the resulting images. A browser screenshot export or AI-created artwork is not part of the process.

Use `baseline.md` as the shared metadata and image checklist, including checks that already passed. Use `old-project-og-workflow.md` as the source implementation reference.

This project uses TanStack Start rather than Astro. Reuse the renderer's responsibilities and build-time workflow, adapting integration to this project's build and deployment. Do not copy Astro routes or the old project's business data and visual styling directly.

## Proposed pipeline

1. Create a typed card registry with a key, page path, headline, label, supporting detail, action line, photo reference, and alt text for each covered route. Include an explicit global fallback.
2. Keep business facts, services, and source image references in `src/lib/site.ts`; read blog content and image references from `src/lib/blog.ts`. Keep concise card artwork copy separate from SEO titles so metadata edits do not unexpectedly break the composition.
3. Reuse this project's current photographs and store local copies for reliable builds. Keep their source references in `src/lib/site.ts`. Export from those local assets so builds and social crawler requests do not depend on remote photo downloads.
4. Build a shared JSX card template reflecting this website's current typography, colors, spacing, and branding. Use an existing photo panel, readable text area, brand identifier, and relevant action line. Adapt long text to fit without clipping; crop photographs without distortion.
5. Load font and logo bytes locally. Prepare photography and the logo using Sharp, render the template to SVG using Satori, and convert the SVG to a static 1200 x 630 PNG using Sharp.
6. Hash the template version, visible text, source asset bytes, and relevant brand data into each output filename. Produce a manifest that maps card keys/routes to URL, width, height, MIME type, and alt text. Avoid timestamps so unchanged inputs keep stable URLs.
7. Integrate card generation before the application build so the generated PNGs are included as public static assets. Keep rendering dependencies out of the browser and deployed request-handling path. Exact build integration and TypeScript script execution need verification before coding.
8. Add a development-only preview gallery showing the exported PNGs at their true aspect ratio, with page labels and links to full-size files. Mark it noindex and keep it unavailable in production and out of the sitemap. Keep the card PNGs publicly available in production.
9. Extend `pageHead()` in `src/lib/seo.ts` to consume card descriptors, publish absolute production OG/X image URLs, and provide image dimensions, MIME type, alt text, and consistent site name. Maintain existing canonical and draft-noindex behavior.
10. Add one route-wide validation command using `baseline.md`. Check rendered metadata, image existence and dimensions, output consistency, and preview exclusion. Report editorial warnings separately from broken metadata/assets. Review each card composition visually and perform a representative deployed crawler check when deployment is in scope.

## Confirmed coverage

Existing route files cover home, about, massage, brows/lashes, permanent lip colour, contact, booking, referral program, blog index, blog details, privacy policy, and booking policy. Do not create standalone pages or cards for individual massage entries unless they have actual page routes or are separately requested.

Every existing page gets its own OG card, including policy pages, utility pages, the blog index, and every blog detail page. Draft blog posts also get their own cards and remain noindex. The global fallback is defensive; it does not replace dedicated cards for known pages.

## User-confirmed requirements

- Scope: a distinct card for every page, including policies and draft posts. Drafts stay noindex.
- Preview availability: development only, matching the old project.
- Image inputs: reuse this project's current photos and store local copies for reliable builds.
- Card copy: implementation may draft concise headlines and action lines from the site's existing content and facts. Present them for review in the gallery.
- Metadata scope: apply the full baseline across all pages, including title length, description length, site-name metadata, all recorded passing checks, and OG/X image metadata. Report any exception explicitly rather than silently omitting a page.

No outstanding product clarification is required to begin implementation. Resolve routine technical choices through repository inspection and current documentation. Gallery copy review is part of reviewing the implemented result.

## Boundaries and verification

Implementation is complete: 16 dedicated page cards plus a global fallback, local photo/font inputs, build-time Satori/Sharp export, a development-only gallery, complete OG/X metadata, shortened metadata copy, and a rendered-output checker. No deployment was performed.

Before implementation, read current official documentation for the libraries/build integration being used through the project's required Context7 workflow. Inspect this project's design and asset availability before choosing final template values. Preserve the Lovable build setup and avoid duplicate framework plugins.

Acceptance should cover: successful production build; PNGs and manifest available in output; relevant card selection for every in-scope route; baseline report for all in-scope pages; visually legible cards without clipping; expected preview indexing/build behavior; and unchanged draft indexing status.

## Verification results

- Production build passes with static PNG assets. Rendering libraries remain in build tooling.
- Development checker passes all 16 page routes and 17 cards with zero failures. See `check-report-development.json`.
- Compiled production handler checker passes the same routes/cards with zero failures, including a 404 for `/dev/og`. See `check-report-production.json`.
- TypeScript check, focused ESLint checks on new tooling/gallery/registry/SEO/config, and the existing 10 tests pass.
- All 17 cards were visually reviewed, with full-size checks of long blog, referral, and about compositions. See `cards-contact-sheet.png`.
- Repeated export with unchanged inputs preserves the generated manifest and image URLs.
- The hosted logo asset was unavailable from the known hosts. The cards use a typographic business-name wordmark in the website's current display font. See `assets/og/README.md`.
- Standard `vite preview` failed because the existing framework preview integration looks for `dist/server/server.js` while the build writes `.output`. Production verification instead used `production-check-server.mjs`, a local QA adapter invoking the actual compiled Cloudflare handler with a filesystem-backed public asset binding. This is not a deployed Cloudflare/browser/crawler test.

The historical screenshots remain the original baseline; the new reports record this implementation's current checks separately.
