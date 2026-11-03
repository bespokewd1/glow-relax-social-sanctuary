import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { MapPin, Clock, Phone, Star, Facebook } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE, directionsUrl, mapEmbedUrl } from "@/lib/site";

export function PageHeader({ eyebrow, title, intro, image, imageAlt }: { eyebrow: string; title: string; intro?: ReactNode; image?: string; imageAlt?: string }) {
  return (
    <section className="border-b bg-secondary/40">
      <div className="container-site grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl">{title}</h1>
          {intro && <div className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{intro}</div>}
        </div>
        {image && (
          <img src={image} alt={imageAlt ?? ""} className="aspect-[4/3] w-full rounded-md object-cover" width={1200} height={900} />
        )}
      </div>
    </section>
  );
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, children, center }: { eyebrow?: string; title: string; children?: ReactNode; center?: boolean }) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl md:text-4xl">{title}</h2>
      {children && <div className="mt-4 leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-taupe bg-card p-5 text-sm text-muted-foreground">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-blush">Details coming soon</span>
      {children}
    </div>
  );
}

export function CallBookButtons({ light }: { light?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link to="/book" className={`btn ${light ? "btn-light" : "btn-primary"}`}>Book Appointment</Link>
      <a href={SITE.phoneHref} className="btn btn-outline">
        <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phoneDisplay}
      </a>
    </div>
  );
}

export function CtaBand({ title = "Ready for Your Moment of Relaxation?", text = "Explore our massage and beauty services and book a time that works for you." }: { title?: string; text?: string }) {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <div className="container-site flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl">{title}</h2>
          <p className="mt-3 opacity-85">{text}</p>
        </div>
        <CallBookButtons light />
      </div>
    </section>
  );
}

export function HoursList() {
  return (
    <ul className="space-y-1">
      {SITE.hours.map((h) => (
        <li key={h.days}>{h.days}: {h.time}</li>
      ))}
      <li className="text-muted-foreground">Saturday & Sunday: Closed</li>
    </ul>
  );
}

export function VisitUs({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const a = SITE.address;
  const H = headingLevel;
  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <p className="eyebrow">Find us</p>
        <H className="mt-3 text-3xl md:text-4xl">Visit Us in Cold Lake</H>
        <p className="mt-3 text-muted-foreground">Located inside Marina Mall.</p>
        <dl className="mt-8 space-y-6">
          <div className="flex gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-blush" aria-hidden />
            <div><dt className="sr-only">Address</dt><dd><address className="not-italic">{a.venue}<br />{a.street}<br />{a.city} {a.region} {a.postal}<br /><span className="text-muted-foreground">{a.note}</span></address></dd></div>
          </div>
          <div className="flex gap-4">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-blush" aria-hidden />
            <div><dt className="sr-only">Hours</dt><dd><HoursList /></dd></div>
          </div>
          <div className="flex gap-4">
            <Phone className="mt-1 h-5 w-5 shrink-0 text-blush" aria-hidden />
            <div><dt className="sr-only">Phone</dt><dd><a href={SITE.phoneHref} className="font-semibold underline-offset-4 hover:underline">{SITE.phoneDisplay}</a></dd></div>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get Directions</a>
          <a href={SITE.phoneHref} className="btn btn-outline">Call Now</a>
        </div>
      </div>
      <div className="lg:col-span-3">
        <iframe
          title="Map showing Glow & Relax inside Marina Mall, Cold Lake"
          src={mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full rounded-md border lg:h-full lg:min-h-[26rem]"
        />
      </div>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <Accordion type="single" collapsible className="border-t">
      {items.map((it, i) => (
        <AccordionItem key={i} value={`q${i}`}>
          <AccordionTrigger className="py-5 text-left font-display text-xl hover:no-underline">{it.q}</AccordionTrigger>
          <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** Approved, genuine reviews only. Leave empty until real reviews are collected. */
export interface Review { author: string; text: string; source: "Google" }
export const APPROVED_REVIEWS: Review[] = [];

export function ReviewsSection() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">Client reviews</p>
      <h2 className="mt-3 text-3xl md:text-4xl">Share Your Experience</h2>
      {APPROVED_REVIEWS.length > 0 ? (
        <div className="mt-10 grid gap-6 text-left md:grid-cols-2">
          {APPROVED_REVIEWS.map((r) => (
            <figure key={r.author} className="border bg-card p-6">
              <blockquote className="leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">— {r.author}, via {r.source}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We're a new studio and look forward to welcoming our first clients. After your visit, we'd be grateful if you shared your experience on Google.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 rounded-md border border-dashed border-taupe bg-card p-6">
            <div className="flex gap-1 text-sand" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5" />)}</div>
            {SITE.googleReviewUrl ? (
              <a href={SITE.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Leave a Google Review</a>
            ) : (
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Google reviews coming soon</p>
            )}
            {SITE.social.facebook && (
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline">
                <Facebook className="h-4 w-4" aria-hidden /> Follow along on Facebook
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
