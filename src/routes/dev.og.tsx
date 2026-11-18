import { createFileRoute, notFound } from "@tanstack/react-router";
import { OG_CARDS } from "@/lib/og-cards";
import manifest from "@/lib/og-manifest.json";
import { POSTS } from "@/lib/blog";

export const Route = createFileRoute("/dev/og")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Social card preview | Glow & Relax" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OgGallery,
});

function OgGallery() {
  const images = manifest as Record<string, { src: string; alt: string }>;
  const drafts = new Set(POSTS.filter((post) => post.draft).map((post) => `/blog/${post.slug}`));
  return (
    <section className="container-site py-12">
      <p className="eyebrow">Development only</p>
      <h1 className="mt-3 text-4xl">Social card preview</h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Review the headline, photograph, and action line for every page. Each card is a 1200 × 630
        PNG. Open a card to save the full-size image. Draft articles remain noindex.
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {OG_CARDS.map((card) => {
          const image = images[card.path];
          if (!image)
            return <p key={card.key}>Missing export for {card.path}. Run the card export again.</p>;
          return (
            <article key={card.key}>
              <h2 className="text-2xl">{card.label}</h2>
              <p className="mb-3 mt-1 text-sm text-muted-foreground">
                {card.path === "global" ? "Global fallback" : card.path}
                {drafts.has(card.path) ? " · Draft · noindex" : ""}
              </p>
              <a
                href={image.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open full-size ${card.label} card`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={630}
                  loading="lazy"
                  className="h-auto w-full border"
                />
              </a>
              <p className="mt-3 text-sm">
                {card.headline.replace(/\n/g, " ")} · {card.action}
              </p>
              <div className="mt-2 flex gap-4 text-sm text-primary underline">
                <a href={image.src} download>
                  Download PNG
                </a>
                {card.path !== "global" && <a href={card.path}>View page</a>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
