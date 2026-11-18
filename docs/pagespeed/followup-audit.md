# CSS and runtime reduction

Implemented November 18, 2026, following the first [PageSpeed audit](audit.md). Validation used local production builds. Publishing and deployment were outside this pass's scope.

## Changes

`src/styles.css` now scans routes, site components, library content/helpers, and the active accordion component. It no longer generates CSS for the unused UI component library. Routes include the root error/404 views and development OG gallery; library coverage includes blog content and standalone error markup. Existing fonts, animation definitions, colours, and utility definitions are retained. When adopting another component from `components/ui`, add its source path to the stylesheet.

Removed the unused global query client, provider, and router context from `src/router.tsx` and `src/routes/__root.tsx`. The routing test now uses the context-free router. The direct `@tanstack/react-query` dependency and its orphan query-core entry were removed from `package.json` and `bun.lock`, without unrelated lockfile changes. No application query or mutation consumers remain, and the production server build contains no query-library chunks.

## Build sizes

Sizes are measured from production files using the same gzip implementation for each build. Transfer sizes on a host can differ due to compression settings and HTTP headers.

| Asset           | Before, raw | After, raw | Before, gzip | After, gzip | Gzip reduction |
| --------------- | ----------: | ---------: | -----------: | ----------: | -------------: |
| Shared CSS      |    80,894 B |   28,362 B |     14,177 B |     6,340 B |          55.3% |
| Main JavaScript |   373,107 B |  348,472 B |    118,175 B |   111,152 B |           5.9% |
| Combined        |   454,001 B |  376,834 B |    132,352 B |   117,492 B |          11.2% |

The CSS-only build retained the same raw JavaScript size. Its five-byte gzip difference comes from changed build references, rather than a runtime change.

## Timing measurements

Compared three compiled builds through the same local gzip production adapter: baseline, CSS-only, and combined. Lighthouse 13.6.0 with Headless Chrome 157 ran three mobile rounds, alternating baseline → CSS-only → combined in each round. No other browser QA ran concurrently. Third-party images and maps remained live network dependencies.

| Homepage mobile median   | Baseline | CSS-only | Combined |
| ------------------------ | -------: | -------: | -------: |
| Performance score        |       97 |       97 |       97 |
| Largest Contentful Paint |  2.654 s |  2.654 s |  2.566 s |
| First Contentful Paint   |  0.767 s |  0.768 s |  0.765 s |

The combined result reduced median LCP by about 88 ms, or 3.3%. The CSS-only experiment reduced download size without a measurable timing improvement in these runs. The remaining stylesheet request still involves a network round trip. These results support a smaller payload and a modest local LCP improvement; they do not establish a deployed PageSpeed score increase.

All nine homepage mobile runs retained accessibility, best practices, and SEO scores of 100, with zero total blocking time and zero layout shift. The final desktop homepage scored 100 in every category, with 0.563 s LCP. The final mobile Massage page scored 97 for performance and 100 in the other categories, with 2.640 s LCP.

Full measured values and individual rounds are in [followup-results.json](followup-results.json). Raw reports remain under ignored `.scratch/pagespeed/followup/`. These are local lab results, not field Core Web Vitals. Production caching, regional latency, compression, and test variability still need deployment measurements.

## Verification

- Production builds pass for baseline, CSS-only, and combined stages, including the existing OG exports.
- All 14 existing tests pass across three files.
- TypeScript passes against the tracked development route declarations. Production generation intentionally omits the development-only OG route; the generated working file was restored to its tracked development version after building. No generated route-tree change is included in this implementation.
- Existing production HTTP smoke checks pass: 499 checks across all 16 routes, including image/font delivery, canonical URLs, draft noindex behavior, and shared accessibility markup.
- New optional headless browser QA passes on baseline and combined builds: 141 checks each across seven routes at mobile and desktop widths. It exercises mobile menu open/close, client navigation, FAQ accordion open/close, responsive header/action-bar visibility, loaded fonts/images, browser errors, and horizontal overflow.
- Captured bounding boxes and computed styles match across all 14 viewport pages. Eighteen of nineteen screenshots are pixel-identical, including menu and FAQ states. The sole difference is confined to the external map iframe's loading placeholder on desktop Contact; application geometry is unchanged.
- New browser script passes ESLint and syntax checks. Changed runtime/test files pass code lint with the repository's existing formatting rule disabled. No unrelated formatting cleanup was applied.
- Independent source review found no missing active CSS sources, remaining query consumers, or unrelated dependency changes.
- `git diff --check` passes.

## Repeat browser checks

Start a built production handler as described in the [first audit](audit.md#reproduce-locally), using port 4178. Then run:

```powershell
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
node scripts/check-performance-interactions.mjs http://127.0.0.1:4178 .scratch/pagespeed/followup/interactions
```

The script uses Playwright as an optional external QA dependency. If it is not installed where Node can resolve it, set `PLAYWRIGHT_MODULE` to a separately installed Playwright package directory. This work added no browser package to the application dependencies. Output includes viewport/state screenshots and a JSON report. External iframe warnings are reported separately from application errors.

The remaining performance experiments would be a small critical-CSS treatment or hosting the hero image on the same origin. They were not included in this bounded CSS/query cleanup. The existing responsive image, font, business-data, SEO, booking, and draft-publishing behavior remains intact.
