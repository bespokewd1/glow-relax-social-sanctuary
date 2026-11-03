import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { Placeholder } from "@/components/site/blocks";

export const Route = createFileRoute("/booking-policy")({
  head: () =>
    pageHead({
      path: "/booking-policy",
      title: "Booking & Cancellation Policy | Glow & Relax",
      description: "Booking, rescheduling and cancellation information for appointments at Glow & Relax in Cold Lake, Alberta.",
    }),
  component: Policy,
});

function Policy() {
  return (
    <article className="container-site max-w-3xl py-14 md:py-20">
      <h1 className="text-4xl md:text-5xl">Booking &amp; Cancellation Policy</h1>
      <div className="prose-site mt-8">
        <h2>Booking</h2>
        <p>Appointments can be booked by calling <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>. Online booking is coming soon.</p>
        <h2>Rescheduling & cancellations</h2>
      </div>
      <Placeholder>Notice period, late-arrival and missed-appointment terms will be added once confirmed by the owner.</Placeholder>
    </article>
  );
}
