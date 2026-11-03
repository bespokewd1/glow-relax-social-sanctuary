<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- All business facts (phone, address, hours, services, images, booking URL, social, referral, openings) live in `src/lib/site.ts`; pages read from it so edits happen in one place.
- Blog posts live in `src/lib/blog.ts`; drafts render with noindex until reviewed.
- Per-page SEO via `pageHead()` in `src/lib/seo.ts` (self-canonical on glowandrelax.ca).
