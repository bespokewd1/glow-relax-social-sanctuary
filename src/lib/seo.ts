import { SITE } from "./site";

/** Builds per-page head metadata with self-referencing canonical. */
export function pageHead(opts: { path: string; title: string; description: string; type?: string; image?: string }) {
  const url = `${SITE.url}${opts.path}`;
  const meta: Record<string, string>[] = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
  ];
  if (opts.image) {
    meta.push({ property: "og:image", content: opts.image }, { name: "twitter:image", content: opts.image });
  }
  return { meta, links: [{ rel: "canonical", href: url }] };
}
