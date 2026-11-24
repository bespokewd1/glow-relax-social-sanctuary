import { createFileRoute, Link } from "@tanstack/react-router";
import { MASSAGE_SERVICES, PMU, PRICING_LABEL, OPENING_DATE_LABEL, isOpen } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, SectionTitle } from "@/components/site/blocks";
import { DirectBillingSection, WhatsAppBookingSection, FollowUsSection } from "@/components/site/sections";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead({
      path: "/pricing",
      title: "Pricing | Glow & Relax Massage & Beauty in Cold Lake",
      description: "View approved massage therapy and permanent makeup pricing at Glow & Relax inside Marina Mall, Cold Lake, Alberta.",
    }),
  component: PricingPage,
});

function PricingPage() {
  const open = isOpen("massage") && isOpen("beauty");
  return (
    <>
      <PageHeader
        eyebrow="Rates & treatments"
        title="Service Pricing"
        intro={
          <>
            <p>Clear, straightforward pricing for our massage therapy and permanent makeup treatments inside Marina Mall, Cold Lake.</p>
            {!open && <p className="mt-4 text-base font-semibold text-foreground">All services start {OPENING_DATE_LABEL}.</p>}
          </>
        }
      />

      <Section>
        <SectionTitle eyebrow="Massage therapy" title="Massage Services & Rates">
          Choose the treatment and session length that best fits your needs.{" "}
          <Link to="/massage-cold-lake" className="text-primary underline underline-offset-4">Explore full massage details</Link>.
        </SectionTitle>

        <div className="divide-y border-y">
          {MASSAGE_SERVICES.map((service) => (
            <article key={service.slug} className="grid gap-4 py-6 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-8">
              <div>
                <h3 className="text-2xl">{service.name}</h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">{service.description}</p>
              </div>
              <div className="md:text-right">
                {service.prices ? (
                  <ul className="space-y-1.5 text-sm md:inline-block md:min-w-52 md:text-left" aria-label={`${service.name} prices`}>
                    {service.prices.map((price) => (
                      <li key={price.duration} className="flex items-center justify-between gap-6 border-b border-border/60 pb-1.5 last:border-b-0 last:pb-0">
                        <span className="text-muted-foreground">{price.duration} minutes</span>
                        <span className="font-semibold text-foreground">${price.amount}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm">
                    <p className="font-semibold text-blush-foreground">{PRICING_LABEL}</p>
                    <p className="mt-1 text-muted-foreground">Durations: {service.durations.map((d) => `${d} min`).join(" · ")}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-card">
        <SectionTitle eyebrow="Beauty & permanent makeup" title={PMU.name}>
          Available treatments starting with a personal consultation.{" "}
          <Link to="/brows-lashes-cold-lake" className="text-primary underline underline-offset-4">Brows &amp; lashes</Link>{" · "}
          <Link to="/permanent-lip-colour-cold-lake" className="text-primary underline underline-offset-4">Permanent lip colour</Link>.
        </SectionTitle>

        <div className="grid gap-6 rounded-md border bg-background p-6 md:grid-cols-[1.4fr_1fr] md:items-center md:p-8">
          <div>
            <h3 className="text-2xl">{PMU.name}</h3>
            <ul className="mt-3 space-y-1.5 text-muted-foreground">
              {PMU.services.map((service) => (
                <li key={service} className="border-l-2 border-blush pl-3">{service}</li>
              ))}
            </ul>
          </div>
          <div className="border-t pt-4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="eyebrow">Package / service rate</p>
            <p className="mt-2 font-display text-4xl text-foreground">${PMU.price}</p>
            <p className="mt-1 text-sm text-blush-foreground">PMU Package/Service Price: ${PMU.price}</p>
          </div>
        </div>
      </Section>

      <DirectBillingSection />
      <WhatsAppBookingSection />
      <FollowUsSection />
    </>
  );
}