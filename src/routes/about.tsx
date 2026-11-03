import { createFileRoute, Link } from "@tanstack/react-router";
import { IMAGES, SITE } from "@/lib/site";
import santiaga from "@/assets/santiaga-patoy-rmt.png.asset.json";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, Placeholder, CtaBand } from "@/components/site/blocks";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      path: "/about",
      title: "About Glow & Relax | Santiaga Patoy, RMT in Cold Lake",
      description: "Meet Santiaga Patoy, RMT, and Glow & Relax, a new massage and beauty studio inside Marina Mall in Cold Lake, Alberta, focused on comfort and personal care.",
    }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A New Studio for Massage, Wellness & Self Care"
        image={IMAGES.stillLife}
        imageAlt="Massage oil and eucalyptus on linen"
        intro="Glow & Relax is a massage and beauty studio inside Marina Mall in Cold Lake, Alberta. We created it as a calm, welcoming place where you can take a little time for yourself."
      />
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl">Our Approach</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Every appointment is shaped around you — your comfort, your preferences and what you'd like to feel when you leave. We keep things simple, unhurried and personal.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Alongside massage, we offer brow, lash and permanent lip-colour services, so you can care for both body and look in one place.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/massage-cold-lake" className="btn btn-primary">Massage</Link>
              <Link to="/brows-lashes-cold-lake" className="btn btn-outline">Beauty Services</Link>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl">Meet Your Therapist</h2>
            <figure className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <img src={santiaga.url} alt={`${SITE.therapist.name}, RMT at Glow & Relax in Cold Lake`} width={240} height={240} loading="lazy" className="h-48 w-48 shrink-0 rounded-full object-cover" />
              <figcaption>
                <p className="font-display text-2xl">{SITE.therapist.name}, RMT</p>
                <p className="text-sm text-muted-foreground">{SITE.therapist.title}</p>
              </figcaption>
            </figure>
            <div className="mt-6"><Placeholder>Santiaga's biography, qualifications and specialties will be added once confirmed.</Placeholder></div>
          </div>
        </div>
      </Section>
      <Section className="bg-card">
        <img src={IMAGES.candle} alt="Spa towel, lotion and tulips" loading="lazy" className="aspect-[21/9] w-full rounded-md object-cover" width={1600} height={700} />
      </Section>
      <CtaBand />
    </>
  );
}
