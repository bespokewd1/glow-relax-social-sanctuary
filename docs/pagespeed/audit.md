# PageSpeed audit and implementation

For the subsequent CSS and runtime reduction, see the [follow-up audit](followup-audit.md).

Reviewed and implemented on November 18, 2026. Validation used local production builds. Publishing and deployment were outside this work's scope.

## Scope and changes

The saved mobile and desktop screenshots test the homepage on the workers.dev deployment. Their findings also apply to shared components and other image-heavy routes. Their scores are historical evidence, not measurements of this local change.

- Restored the approved green-and-ivory logo from the older `glow-and-relax` project. The 80/160/320px WebP variants are 1,170/3,026/7,430 bytes. The complete design remains visible. `SITE_ASSETS` in `src/lib/site.ts` supplies header and structured-data references.
- Temporarily removed the unavailable therapist portrait from Home and About, as agreed. Therapist information remains visible, without an empty image column. No unverified portrait was substituted.
- Added reusable responsive image candidates and layout-specific `sizes` for Home, About, service headers/cards, blog listing, and blog posts. Unsplash crops match the existing visible aspect ratios. Original photograph selections remain centralized in `src/lib/site.ts`. Below-fold photos remain lazy; confirmed primary images receive high priority. The existing homepage hero preload remains aligned with its image.
- Added a darker blush text token while retaining the lighter decorative colour. Calculated normal-text contrast ranges from 5.00:1 on sand to 6.47:1 on card backgrounds. Dark sections retain their light labels.
- Repaired the shared VisitUs description list on Home and Contact. Terms and descriptions are direct children of each grouping wrapper. Decorative icons sit inside descriptions.
- Corrected About's Mission heading level and removed the header link's overriding accessible name. Its name now derives from visible content and the logo's home alt text.
- Self-hosted the same two Latin WOFF2 font binaries, with font-display swap, critical preloads, source records, and complete OFL licenses. This removes the Google Fonts stylesheet dependency. Open Graph font inputs are unchanged.

## Measurements

Lighthouse 13.6.0 with Headless Chrome 157 audited compiled production builds through the same local Node adapter. Mobile uses Lighthouse's default mobile profile; desktop uses its desktop preset. Both adapters gzip text resources. Original and changed builds use separate localhost ports. External Unsplash and map requests remain live network dependencies.

These are individual lab runs, not field Core Web Vitals. Network timing, local execution, Lighthouse simulation, and the adapter's handling of caching differ from deployed PageSpeed Insights. Small score changes should not be treated as statistically established improvements or regressions.

| Page                    | Mobile performance before → after | Desktop performance before → after | Mobile LCP before → after | Accessibility before → after, both devices |
| ----------------------- | --------------------------------- | ---------------------------------- | ------------------------- | ------------------------------------------ |
| Home                    | 94 → 97                           | 100 → 100                          | 2.96s → 2.66s             | 88 → 100                                   |
| Contact                 | 100 → 100                         | 100 → 100                          | 1.44s → 0.76s             | 90 → 100                                   |
| About                   | 94 → 100                          | 100 → 100                          | 2.95s → 0.76s             | 94 → 100                                   |
| Massage                 | 95 → 97                           | 100 → 100                          | 2.89s → 2.57s             | 96 → 100                                   |
| First massage blog post | 99 → 98                           | 100 → 100                          | 2.11s → 2.43s             | 100 → 100                                  |

Best practices increased from 96 to 100 on all five tested pages and both devices. SEO remains 100 on the four public pages and 69 on the draft blog post. Draft noindex behavior is intentional and preserved.

The blog's initial mobile result appeared one point lower. A targeted repeat returned baseline 95 with 2.87s LCP and updated 98 with 2.42s LCP. The updated article image was smaller, and its measured render delay was lower. There is no consistent regression across these runs; more repeated deployment measurements would be needed to establish a trend. The final article image also has an explicit high-priority hint because Lighthouse confirmed it is the LCP element.

The font comparison isolated the updated homepage before and after self-hosting. Mobile first paint fell from 1.44s to 0.77s and LCP from 2.81s to 2.66s. This justified keeping the font change. Final homepage layout shift was zero on both devices and total blocking time remained zero. Home and Massage mobile LCP still sit slightly above the 2.5s good threshold in these local simulations.

## Image transfer checks

The three photos flagged by the saved report were downloaded with the same AVIF accept header before and after resizing. These are representative desktop candidates at 1x density, not guaranteed savings for every device or full-page transfer totals.

| Photo      | Original response | Responsive candidate | New response |
| ---------- | ----------------: | -------------------- | -----------: |
| Beauty     |      53,759 bytes | 640×480              | 27,869 bytes |
| Massage    |      40,065 bytes | 640×480              | 14,254 bytes |
| Still life |     207,783 bytes | 480×600              | 31,519 bytes |
| Total      |     301,607 bytes |                      | 73,642 bytes |

Combined transfer fell by 227,965 bytes, approximately 76%. Lighthouse's final homepage image-delivery insight reports no remaining estimated image waste in the tested viewport.

## Verification

- Production build passes, including all 17 Open Graph card exports.
- Existing test suite passes: 10 tests across two files.
- TypeScript check passes.
- Production smoke check passes 499 checks across all 16 routes, including five drafts, three local logo variants, two local fonts, and three external image candidates. It checks status, canonical URLs, headings, responsive markup, decoded image widths, WOFF2 signatures, font preloads, description-list structure, and draft noindex rules.
- Mobile and desktop Lighthouse audits completed for Home, Contact, About, Massage, and one blog post. The final shared header check no longer reports the accessible-name mismatch.
- Inspected Lighthouse viewport images for mobile and desktop. Full-document screenshots can distort viewport-height-dependent sections when Lighthouse resizes the viewport, so viewport filmstrip images were used to assess the hero layout.
- New scripts and the image helper pass ESLint. Focused lint on changed source passes with the formatting rule disabled, apart from the existing component-export warning in blocks.tsx. Repository-wide lint remains blocked by formatting and CRLF errors: the captured run reported 6,413 Prettier errors and seven component-export warnings. No unrelated formatting cleanup was applied. Local audit build artifacts are excluded from ESLint.
- `git diff --check` passes.

## Remaining findings

The main script still has about 51KiB of code unused during a single homepage load. Inspection found framework hydration/routing and query-provider code, rather than evidence that large unrelated UI libraries were entering the homepage bundle. Removing framework code based solely on this coverage report is not justified. The query provider has no current application consumers and can be evaluated in a separate measured change.

The local adapter does not reproduce deployment cache headers. Its cache warnings should not be interpreted as a production cache audit. A deployment PageSpeed run remains necessary to verify production caching and latency after these local changes are published.

The portrait remains intentionally hidden until an approved photograph is available. Unsplash remains an external dependency for content photos. The existing business configuration, booking behavior, canonical domain, and draft publishing rules are preserved.

## Reproduce locally

Build first, then leave the production audit adapter running in one terminal:

```powershell
npm run build
$env:PSI_PORT = '4176'
node scripts/pagespeed-server.mjs
```

In a second terminal:

```powershell
node --import tsx scripts/check-pagespeed.ts http://127.0.0.1:4176
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npx --yes lighthouse@13.6.0 http://127.0.0.1:4176/ --chrome-flags='--headless --no-sandbox' --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.scratch/pagespeed/home-mobile.json
```

Add `--preset=desktop` for desktop. Change the path for other routes. The adapter defaults to `.output`; `PSI_BUILD_ROOT` can select a saved build. Complete raw reports and local baseline output remain under ignored `.scratch/pagespeed/`. Compact results are retained in `audit-results.json` alongside this report.

Restore font downloads with `node scripts/sync-web-fonts.mjs`. Recreate logo variants with `node scripts/prepare-logo.mjs <approved-original.png>`.

Reference guidance: [responsive images](https://web.dev/articles/serve-responsive-images), [font delivery](https://web.dev/articles/font-best-practices), [LCP optimization](https://web.dev/articles/optimize-lcp), [description-list structure](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl), [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli).
