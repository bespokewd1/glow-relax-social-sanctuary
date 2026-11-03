import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    pageHead({
      path: "/privacy-policy",
      title: "Privacy Policy | Glow & Relax",
      description: "How Glow & Relax in Cold Lake, Alberta collects, uses and protects personal information.",
    }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="container-site max-w-3xl py-14 md:py-20">
      <h1 className="text-4xl md:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Draft — to be reviewed before launch.</p>
      <div className="prose-site mt-8">
        <h2>Information we collect</h2>
        <p>When you call or book with us, we may collect your name, phone number and details needed to provide your appointment.</p>
        <h2>How we use it</h2>
        <p>We use your information only to schedule and provide services, and to contact you about your appointments. We do not sell personal information.</p>
        <h2>Third-party services</h2>
        <p>This website may use Google Maps and, in future, an online booking provider and privacy-conscious analytics. These services have their own privacy policies.</p>
        <h2>Your choices</h2>
        <p>You may request access to or correction of your personal information by calling {SITE.phoneDisplay}.</p>
        <h2>Contact</h2>
        <p>{SITE.name}, {SITE.address.venue}, {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postal}.</p>
      </div>
    </article>
  );
}
