import { createFileRoute, Link } from "@tanstack/react-router";
import { MASSAGE_SERVICES, IMAGES, PRICING_LABEL, SITE, isOpen, OPENING_DATE_LABEL } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, SectionTitle, CallBookButtons, Faq, CtaBand } from "@/components/site/blocks";

export const Route = createFileRoute("/massage-cold-lake")({
  head: () =>
    pageHead({
      path: "/massage-cold-lake",
      title: "Massage Services in Cold Lake, AB | Glow & Relax",
      description: "Explore relaxation, deep tissue, Swedish and more massage options at Glow & Relax inside Marina Mall, Cold Lake.",
    }),
  component: MassagePage,
});

const ALL_DURATIONS = [45, 60, 90, 120];

function MassagePage() {
  const open = isOpen("massage");
  return (
    <>
      <PageHeader
        eyebrow="Massage & wellness"
        title="Massage Services in Cold Lake, Alberta"
        image={IMAGES.massage}
        imageAlt="Client receiving a calming back massage"
        intro={
          <>
            <p>Explore massage options at Glow &amp; Relax, located inside Marina Mall in Cold Lake. Choose from a range of treatments designed around comfort, relaxation and individual preferences.</p>
            {!open && <p className="mt-4 text-base font-semibold text-foreground">Massage services begin {OPENING_DATE_LABEL}.</p>}
          </>
        }
      />
      <Section>
        <SectionTitle eyebrow="Treatments" title="Our Massage Options">
          Appointments are offered in {ALL_DURATIONS.join(", ")} minute lengths. Baby massage is a 30-minute session and prenatal massage is 60 minutes. We'll confirm what's right for you when you book.
        </SectionTitle>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {MASSAGE_SERVICES.map((s) => (
            <article key={s.slug} id={s.slug}>
              <img src={s.image} alt="" loading="lazy" className="aspect-[3/2] w-full rounded-md object-cover" width={1200} height={800} />
              <h3 className="mt-5 text-2xl">{s.name}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.description}</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold">Durations:</span>{" "}
                {s.durations.length ? s.durations.map((d) => `${d} min`).join(" · ") : "to be confirmed"}
              </p>
              <p className="mt-1 text-sm text-blush">{PRICING_LABEL}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 border-t pt-10"><CallBookButtons /></div>
      </Section>
      <Section className="bg-card">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="FAQ" title="Massage Questions" />
          <Faq
            items={[
              { q: "Which massage should I choose?", a: <>If you want to unwind, a relaxation or Swedish massage is a good starting point. If you prefer firmer, more focused pressure, ask about deep tissue. Not sure? <a className="underline" href={SITE.phoneHref}>Call us</a> and we'll talk it through. You can also read <Link className="underline" to="/blog/$slug" params={{ slug: "swedish-vs-deep-tissue-massage" }}>Swedish vs. deep tissue</Link>.</> },
              { q: "What happens during my first appointment?", a: "We'll start with a short conversation about your preferences, comfort and any areas to focus on or avoid. You'll have privacy to get comfortable, and you can ask to adjust pressure at any time." },
              { q: "How long are appointments?", a: "Most treatments are offered in 45, 60, 90 and 120 minute lengths. Baby massage is 30 minutes and prenatal massage is 60 minutes. We'll confirm availability when you book." },
              { q: "Do you offer prenatal massage?", a: "Prenatal massage is listed as a service, subject to suitability and therapist qualifications. Please call to discuss before booking." },
              { q: "Where is Glow & Relax located?", a: `Inside Marina Mall Shopping Mall, ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postal}.` },
              { q: "How do I book?", a: <>Call <a className="underline" href={SITE.phoneHref}>{SITE.phoneDisplay}</a>. Online booking is coming soon. Massage appointments are available from {OPENING_DATE_LABEL}.</> },
            ]}
          />
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
