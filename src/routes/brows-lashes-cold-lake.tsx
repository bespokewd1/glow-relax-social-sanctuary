import { createFileRoute, Link } from "@tanstack/react-router";
import { IMAGES, PRICING_LABEL, isOpen } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, Placeholder, CallBookButtons, CtaBand, StockNote } from "@/components/site/blocks";

export const Route = createFileRoute("/brows-lashes-cold-lake")({
  head: () =>
    pageHead({
      path: "/brows-lashes-cold-lake",
      title: "Eyebrow & Lash Services in Cold Lake | Glow & Relax",
      description: "Brow and lash services inside Marina Mall, Cold Lake, Alberta. Beauty appointments begin November 15, 2026. Call 1-825-734-0539.",
      image: IMAGES.beauty,
    }),
  component: BrowsPage,
});

/** Add confirmed treatments here: { name, description, duration, price } */
const BROW_SERVICES: { name: string; description: string }[] = [];
const LASH_SERVICES: { name: string; description: string }[] = [];

function ServiceGroup({ title, intro, items, img, alt }: { title: string; intro: string; items: { name: string; description: string }[]; img: string; alt: string }) {
  return (
    <div className="grid items-start gap-10 md:grid-cols-2">
      <div>
        <img src={img} alt={alt} loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" width={1200} height={900} />
        <StockNote />
      </div>
      <div>
        <h2 className="text-3xl md:text-4xl">{title}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-6 space-y-4">
          {items.length ? (
            items.map((s) => (
              <div key={s.name} className="border-b pb-4">
                <h3 className="text-xl">{s.name}</h3>
                <p className="text-muted-foreground">{s.description}</p>
                <p className="text-sm text-blush">{PRICING_LABEL}</p>
              </div>
            ))
          ) : (
            <Placeholder>The full list of treatments, durations and pricing will be posted here shortly. Call us to ask what's available.</Placeholder>
          )}
        </div>
      </div>
    </div>
  );
}

function BrowsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Brows & lashes"
        title="Eyebrow & Lash Services in Cold Lake"
        intro={
          <>
            <p>Thoughtful brow and lash services designed to complement your natural features, offered in our studio inside Marina Mall.</p>
            {!isOpen("beauty") && <p className="mt-4 text-base font-semibold text-foreground">Beauty services begin November 15, 2026.</p>}
          </>
        }
      />
      <Section>
        <ServiceGroup title="Eyebrow Services" intro="Brow appointments begin with a conversation about the shape and look you'd like, so the result suits you." items={BROW_SERVICES} img={IMAGES.beauty} alt="Beauty professional working on a client's brows" />
      </Section>
      <Section className="bg-card">
        <ServiceGroup title="Eyelash Services" intro="Lash services focused on comfort and a look that feels like you." items={LASH_SERVICES} img={IMAGES.facial} alt="Client relaxing during a beauty treatment" />
      </Section>
      <Section>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-muted-foreground">
            Getting ready for your first appointment? Read <Link className="text-primary underline" to="/blog/$slug" params={{ slug: "preparing-first-eyebrow-appointment" }}>how to prepare</Link>, or explore <Link className="text-primary underline" to="/permanent-lip-colour-cold-lake">permanent lip colour</Link>.
          </p>
          <CallBookButtons />
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
