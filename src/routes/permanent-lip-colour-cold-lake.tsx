import { createFileRoute, Link } from "@tanstack/react-router";
import { IMAGES, isOpen, OPENING_DATE_LABEL } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, Placeholder, CallBookButtons, Faq, CtaBand } from "@/components/site/blocks";

export const Route = createFileRoute("/permanent-lip-colour-cold-lake")({
  head: () =>
    pageHead({
      path: "/permanent-lip-colour-cold-lake",
      title: "Permanent Lip Colour in Cold Lake, Alberta | Glow & Relax",
      description: "Explore permanent lip colour in Cold Lake, including consultation, preparation and aftercare at Glow & Relax.",
    }),
  component: LipsPage,
});

const STEPS = [
  { t: "Service overview", d: "Permanent lip colour uses cosmetic pigment to add soft, longer-lasting colour and definition to the lips. Results vary from person to person." },
  { t: "Consultation", d: "Every lip colour service begins with a consultation to discuss the shade and look you'd like, review your suitability and answer questions." },
  { t: "Preparation", d: "Specific preparation instructions will be provided at your consultation." },
  { t: "Aftercare", d: "You'll receive written aftercare guidance to follow after your appointment." },
  { t: "Healing considerations", d: "Lips go through a healing period after treatment, and colour can look different while healing. Details will be discussed during your consultation." },
];

function LipsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Permanent makeup"
        title="Permanent Lip Colour in Cold Lake, Alberta"
        image={IMAGES.lips}
        imageAlt="Close-up of lip colour being applied"
        intro={
          <>
            <p>A softer, longer-lasting lip colour that starts with a relaxed, no-pressure consultation.</p>
            {!isOpen("beauty") && <p className="mt-4 text-base font-semibold text-foreground">Beauty services begin {OPENING_DATE_LABEL}.</p>}
          </>
        }
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-3xl md:text-4xl">What to Know</h2>
            <p className="mt-4 text-muted-foreground">Procedure-specific details are being finalized and will be confirmed by your technician.</p>
            <div className="mt-8"><CallBookButtons /></div>
          </div>
          <ol className="space-y-8">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-5 border-b pb-8">
                <span className="font-display text-3xl text-blush">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-2xl">{s.t}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section className="bg-card">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-3xl md:text-4xl">Permanent Lip Colour FAQ</h2>
          <Faq
            items={[
              { q: "Do I need a consultation first?", a: "Yes — a consultation is the first step, so we can discuss your goals and suitability." },
              { q: "How long does it last?", a: <Placeholder>Longevity information will be confirmed by the technician.</Placeholder> },
              { q: "What does healing look like?", a: <Placeholder>Healing details will be shared during your consultation.</Placeholder> },
              { q: "How much does it cost?", a: "Please contact us for pricing." },
              { q: "Where can I read more?", a: <>See our article <Link className="underline" to="/blog/$slug" params={{ slug: "before-permanent-lip-colour" }}>What to Know Before Permanent Lip Colour</Link>.</> },
            ]}
          />
        </div>
      </Section>
      <CtaBand title="Curious About Lip Colour?" text="Call to book a consultation and ask any questions you have." />
    </>
  );
}
