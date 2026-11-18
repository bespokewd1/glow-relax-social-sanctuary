import { SITE } from "./site";
import generatedImages from "./og-manifest.json";
import { getSocialImageOrigin } from "./seo-origin";

export interface SocialImage {
  src: string;
  width: number;
  height: number;
  type: string;
  alt: string;
}

const images = generatedImages as Record<string, SocialImage>;

/** Builds per-page head metadata with self-referencing canonical. */
export function pageHead(opts: {
  path: string;
  title: string;
  description: string;
  type?: string;
}) {
  const path = opts.path === "/" ? "/" : opts.path.replace(/\/+$/, "");
  const url = new URL(path, SITE.url).href;
  const image = images[path] ?? images["global"];
  if (!image)
    throw new Error(`Missing generated social image for ${path}. Run the OG image export.`);
  const imageUrl = new URL(image.src, getSocialImageOrigin()).href;
  const meta: Record<string, string>[] = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE.name },
    { property: "og:locale", content: "en_CA" },
    { property: "og:image", content: imageUrl },
    { property: "og:image:secure_url", content: imageUrl },
    { property: "og:image:width", content: String(image.width) },
    { property: "og:image:height", content: String(image.height) },
    { property: "og:image:type", content: image.type },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: image.alt },
  ];
  return { meta, links: [{ rel: "canonical", href: url }] };
}
