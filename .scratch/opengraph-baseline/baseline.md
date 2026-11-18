# Open Graph baseline for all pages

Recorded: 2026-11-18. Status: historical screenshot baseline; implementation results are recorded separately in `implementation-plan.md` and the check reports.

## Purpose and evidence

Use one shared checklist to validate every public, indexable page locally rather than manually submitting every URL to an Open Graph inspector. Metadata and image-file checks can be automated later. Visual review and occasional deployed crawler checks are still needed to verify composition, accessibility to crawlers, and caching.

Evidence: the four PNG screenshots in `docs/opengraph/`, named `Screenshot 2026-11-18 065541.png`, `065547.png`, `065552.png`, and `065556.png`. These show the same homepage audit at different scroll positions, not four page audits. The selected preview is Facebook; other platform previews are not shown. The hostname displayed is the workers.dev preview hostname.

The inspector reports 1 error, 3 warnings, and 9 passes. Eight passing check labels are fully readable across the screenshots. The ninth passing check is not fully visible, so its identity and result must not be invented.

## Observed findings, including passes

| Check | Observed result | Shared baseline |
| --- | --- | --- |
| `og:image` aspect ratio | Error: 1800 x 1200, or 3:2 | Use a 1200 x 630 card, approximately 1.91:1. Actual file dimensions must match declared dimensions. |
| Image headline or CTA | Warning: no clear headline or CTA detected | Review a branded, page-specific headline and relevant action line. This is an editorial target from the inspector, not a validity requirement. |
| `og:description` length | Warning: 138 characters; inspector says social previews often show about 125 | Target at most 125 characters for social copy; put essential information first. Treat this as a project target, not a universal hard limit. |
| HTML `<title>` length | Warning: 68 characters; inspector suggests about 60 | Target at most 60 characters, including any appended brand. |
| `og:title` presence | Pass: title present, reported as 60 characters | Nonempty, page-specific title on every page. |
| `og:title` length | Pass: 60 characters | Target at most 60 characters. |
| Search `description` | Pass: present, 138 characters, described as within the recommended range | Nonempty, factual, page-specific search description. The screenshots establish 138 as a passing example, not a complete allowed range. |
| `twitter:card` | Pass: `summary_large_image` | Use `summary_large_image`. |
| `twitter:title` | Pass: present, 60 characters | Nonempty, page-specific title; target at most 60 characters. |
| `twitter:description` | Pass: present, 138 characters, described as suitable | Nonempty, relevant description. A shared description can use the stricter social target above. |
| `twitter:image` | Pass: present | Set a fetchable image URL and use the same card as Open Graph unless intentionally overridden. |
| `og:site_name` | Pass: `Glow & Relax` | Set the current business name consistently, sourced from `src/lib/site.ts`. |
| Ninth passing check | Counted in the inspector total, label not fully visible | Unconfirmed. Do not record an assumed pass. |

## Interpretation and limits

- HTML title and OG title are separate checks. The audit reports different lengths while the preview shows a full title. Inspect rendered tags before assuming why they differ.
- The same 138-character description passes the search and X checks but triggers the OG warning. Apply the agreed project target without calling every longer description invalid.
- The photograph clearly communicates massage but contains no visible brand identity. Use the current website's design for future card artwork.
- Recompose or crop source photography for the card ratio; do not stretch a 3:2 photo into 1200 x 630.
- These are historical homepage findings, not proof of the current source or deployment state, and not verified results for other pages.

## Additional checks for the future site-wide validator

These extend the screenshot baseline. They are not claimed as screenshot passes.

- Discover all public routes, including service and published blog detail pages. Explicitly account for noindex drafts and utility routes.
- Inspect rendered HTML for one effective value per required tag. Check the final HTML title after brand suffixes, not just the source string.
- Check `description`, `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`, `og:image`, and the X tags listed above.
- Check production self-canonicals and `og:url` against `https://glowandrelax.ca`, preserving each page's path.
- Require absolute HTTPS image URLs. Check that the referenced image exists, decodes, and is actually 1200 x 630.
- Include accurate `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`, and `twitter:image:alt`. Match image URLs and alt text across OG and X where appropriate.
- Use unique titles and descriptions for distinct page content. Use a relevant card per page or an explicit, documented fallback.
- Review each card for readable text, adequate contrast, safe spacing, relevant photography, consistent branding, and no clipped text or distorted photos.
- Exclude any card preview utility from indexing and the sitemap. Keep the PNG assets publicly fetchable.
- If adopting the old renderer's size guard, check each PNG is below 2 MiB. This is an inherited implementation target, not a screenshot metric.
- Produce a per-route report distinguishing failures, editorial warnings, passes, and unverified checks. Passing a local report does not prove remote crawlers fetched the deployment.

## Project constraints

Business facts and source image references belong in `src/lib/site.ts`; blog content belongs in `src/lib/blog.ts`. Keep metadata integration through `pageHead()` in `src/lib/seo.ts`. Draft posts remain noindex until reviewed. Do not copy business facts from the old project without reconciling them with this project's source of truth.

See `old-project-og-workflow.md` for the inspected reference implementation. The user subsequently authorized implementation and validation; see `implementation-plan.md` for the confirmed requirements and results.
