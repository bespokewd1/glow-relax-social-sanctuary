# Web fonts

These are the exact Latin WOFF2 binaries observed in the saved local homepage
Lighthouse baseline on November 18, 2026. The original stylesheet requested
Cormorant Garamond 500/600 and Mulish 400/600/700 with `display=swap`:

https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Mulish:wght@400;600;700&display=swap

Google Fonts serves one variable Latin file per family for those weights. The
local `@font-face` declarations expose the requested weight ranges and preserve
Google's Latin Unicode range. Characters outside that range use the site's
existing fallback fonts. These files are separate from the TTF inputs used for
Open Graph card generation.

Both families use the SIL Open Font License 1.1. The complete copyright notices
and licenses are included in `Cormorant-Garamond-OFL.txt` and `Mulish-OFL.txt`.
The font binaries are unmodified.

Run `node scripts/sync-web-fonts.mjs` from the repository root to restore the
versioned Google-hosted binaries and their upstream license texts. The script
records each source URL and prints SHA-256 checksums. No download occurs during
the normal build.

| File                           |  Bytes | SHA-256                                                          |
| ------------------------------ | -----: | ---------------------------------------------------------------- |
| cormorant-garamond-latin.woff2 | 37,776 | 5d618c462b7a5b74f442e1548880086af71764d9cc7d35c16ab45353da934621 |
| mulish-latin.woff2             | 29,896 | 14cc0eabadfeb1af90ba3b304aa71074d5f13f2807fa899a1efcbc13c3275cbc |

The root layout preloads these two fonts because both families render text in
the initial viewport. `font-display: swap` keeps text visible during loading.
