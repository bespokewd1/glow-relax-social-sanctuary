import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS, formatDate } from "@/lib/blog";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section } from "@/components/site/blocks";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageHead({
      path: "/blog",
      title: "Wellness & Beauty Tips | Glow & Relax Blog, Cold Lake",
      description: "Helpful articles on massage, brows, lashes and permanent lip colour from Glow & Relax in Cold Lake, Alberta.",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const [first, ...rest] = POSTS;
  return (
    <>
      <PageHeader eyebrow="Journal" title="Blog & Wellness Tips" intro="Practical, easy-to-read guides to help you get the most from your massage and beauty appointments." />
      <Section>
        <Link to="/blog/$slug" params={{ slug: first.slug }} className="group grid gap-8 border-b pb-12 md:grid-cols-2">
          <img src={first.image} alt={first.imageAlt} className="aspect-[3/2] w-full rounded-md object-cover" width={1200} height={800} />
          <div className="self-center">
            <p className="text-sm text-muted-foreground">{formatDate(first.date)}{first.draft && " · Draft"}</p>
            <h2 className="mt-3 text-3xl group-hover:text-primary md:text-4xl">{first.title}</h2>
            <p className="mt-4 text-muted-foreground">{first.description}</p>
          </div>
        </Link>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group">
              <img src={p.image} alt={p.imageAlt} loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" width={800} height={600} />
              <p className="mt-4 text-xs text-muted-foreground">{formatDate(p.date)}{p.draft && " · Draft"}</p>
              <h2 className="mt-2 text-xl group-hover:text-primary">{p.title}</h2>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
