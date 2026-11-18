# OG export assets

These are local inputs for the build-time Satori and Sharp renderer. Normal card
exports use no network requests. Run `npm run sync:og-assets` explicitly after
changing a photograph source in `src/lib/site.ts`, then review and commit the
updated local photo together with that configuration change.

## Photography

`photos/*.jpg` are local JPEG copies of this site's existing Unsplash image
references. The source URL to local path mapping is `OG_ASSETS.photos` in
`src/lib/site.ts`. The same stock-photography limitations apply: these are not
verified photographs of the studio or its staff. No new stock sources or AI
artwork were introduced.

## Typography and brand

The cards use this site's Cormorant Garamond Medium and Mulish Regular/Bold.
Local TTFs came from Google Fonts' CSS response for those families and weights:
`https://fonts.googleapis.com/css?family=Cormorant+Garamond:500%7CMulish:400,700`.
The families are distributed under SIL Open Font License 1.1; the corresponding
license files are in `fonts/` and came from the Google Fonts repository's
`ofl/cormorantgaramond/OFL.txt` and `ofl/mulish/OFL.txt`.

The card uses a typographic business-name wordmark in the current website's
display font. The existing logo JSON points at a hosted asset unavailable to
this export environment (403/404 from the known site origins), so the old
project's different logo was not substituted. A future approved local logo can
be added to the shared renderer and its content hash.
