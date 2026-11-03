import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { SITE, isOpen } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, HoursList } from "@/components/site/blocks";

export const Route = createFileRoute("/book")({
  head: () =>
    pageHead({
      path: "/book",
      title: "Book an Appointment | Glow & Relax, Cold Lake",
      description: "Book massage, brow, lash or permanent lip-colour appointments at Glow & Relax in Cold Lake. Call 1-825-734-0539 to book.",
    }),
  component: Book,
});

function Book() {
  return (
    <>
      <PageHeader eyebrow="Appointments" title="Book an Appointment" intro="Online booking is coming soon. In the meantime, call us and we'll find a time that works for you." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-md border bg-card p-8 md:p-10">
            {SITE.bookingUrl ? (
              <iframe title="Online booking" src={SITE.bookingUrl} className="h-[48rem] w-full" />
            ) : (
              <>
                <p className="eyebrow">Call to book</p>
                <h2 className="mt-3 text-3xl md:text-4xl">Speak With Us Directly</h2>
                <a href={SITE.phoneHref} className="btn btn-primary mt-6 w-full !text-base sm:w-auto">
                  <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phoneDisplay}
                </a>
                <div className="mt-8 text-sm"><p className="mb-1 font-semibold">Phone hours</p><HoursList /></div>
                <p className="mt-6 text-xs text-muted-foreground">Online booking integration: pending setup.</p>
              </>
            )}
          </div>
          <div className="space-y-6">
            <div className="border-l-2 border-blush pl-5">
              <h2 className="text-2xl">Beauty services</h2>
              <p className="mt-1 text-muted-foreground">{isOpen("beauty") ? "Now booking." : "Appointments available from November 15, 2026."}</p>
              <Link to="/brows-lashes-cold-lake" className="mt-2 inline-block text-sm text-primary underline">Brows &amp; lashes</Link>{" · "}
              <Link to="/permanent-lip-colour-cold-lake" className="text-sm text-primary underline">Permanent lip colour</Link>
            </div>
            <div className="border-l-2 border-blush pl-5">
              <h2 className="text-2xl">Massage services</h2>
              <p className="mt-1 text-muted-foreground">{isOpen("massage") ? "Now booking." : "Appointments available from December 1, 2026."}</p>
              <Link to="/massage-cold-lake" className="mt-2 inline-block text-sm text-primary underline">View massage options</Link>
            </div>
            <p className="text-sm text-muted-foreground">Please review our <Link to="/booking-policy" className="underline">booking &amp; cancellation policy</Link>.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
