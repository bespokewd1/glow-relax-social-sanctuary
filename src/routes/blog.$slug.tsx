import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPost, formatDate } from "@/lib/blog";
import { pageHead } from "@/lib/seo";
import { CtaBand } from "@/components/site/blocks";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Article not found | Glow & Relax" }, { name: "robots", content: "noindex" }] };
    const h = pageHead({ path: `/blog/${params.slug}`, title: `${loaderData.seoTitle} | Glow & Relax`, description: loaderData.description, type: "article" });
    // Drafts stay out of search until reviewed.
    if (loaderData.draft) h.meta.push({ name: "robots", content: "noindex" });
    return h;
  },
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  return (
    <>
      <article className="container-site max-w-3xl py-14 md:py-20">
        <Link to="/blog" className="text-sm text-primary">← All articles</Link>
        <p className="mt-6 text-sm text-muted-foreground">{formatDate(post.date)}</p>
        {post.draft && <p className="mt-2 inline-block bg-accent px-2 py-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">Draft — pending review</p>}
        <h1 className="mt-4 text-4xl md:text-5xl">{post.title}</h1>
        <img src={post.image} alt={post.imageAlt} className="mt-8 aspect-[3/2] w-full rounded-md object-cover" width={1200} height={800} />
        <div className="prose-site mt-10" dangerouslySetInnerHTML={{ __html: post.body }} />
        <div className="mt-10 border-t pt-8">
          <Link to={post.related.to} className="btn btn-outline">{post.related.label}</Link>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
