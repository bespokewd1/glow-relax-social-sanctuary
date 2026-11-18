import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Facebook } from "lucide-react";
import { SITE } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, VisitUs } from "@/components/site/blocks";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      path: "/contact",
      title: "Contact & Location | Glow & Relax, Marina Mall, Cold Lake",
      description: "Find Glow & Relax inside Marina Mall, Cold Lake. View our address, hours, directions and ways to get in touch.",
    }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact & location" title="Contact Glow & Relax" intro={<>Questions or ready to book? Call <a href={SITE.phoneHref} className="font-semibold text-foreground underline">{SITE.phoneDisplay}</a> during weekday hours.</>} />
      <Section><VisitUs /></Section>
      <Section className="bg-card">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="mx-auto flex flex-col items-center rounded-md border bg-background p-8 text-center">
            <QRCodeSVG value={SITE.phoneHref} size={200} level="M" marginSize={2} title="QR code to call Glow & Relax" />
            <p className="mt-4 font-display text-2xl">Scan to Call Glow &amp; Relax</p>
            <p className="text-sm text-muted-foreground">{SITE.phoneDisplay}</p>
            <button onClick={() => window.print()} className="btn btn-outline mt-5 print:hidden">Print QR Code</button>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl">Other Ways to Reach Us</h2>
            <p className="mt-4 text-muted-foreground">An online enquiry form and email address are coming soon. For now, the fastest way to reach us is by phone.</p>
            {SITE.social.facebook && (
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-6">
                <Facebook className="h-4 w-4" aria-hidden /> Message us on Facebook
              </a>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
