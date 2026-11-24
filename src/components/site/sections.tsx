import { Facebook, Phone, ShieldCheck } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "./whatsapp-float";

export function DirectBillingSection({ className = "bg-secondary/40" }: { className?: string }) {
  return (
    <section className={`border-y py-12 md:py-16 ${className}`}>
      <div className="container-site">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 rounded-md border bg-card p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="eyebrow">Insurance coverage</p>
            <h2 className="mt-1.5 text-2xl md:text-3xl">{SITE.directBilling.heading}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{SITE.directBilling.text}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{SITE.directBilling.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhatsAppBookingSection() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <div className="container-site flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-lg">
          <p className="eyebrow !text-sand">Book via WhatsApp</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Ready to Relax? 💆‍♀️</h2>
          <p className="mt-3 text-lg opacity-95">Your time to unwind and recharge starts here.</p>
          <p className="mt-2 opacity-85">Have questions or ready to book your massage? Send us a message on WhatsApp!</p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light whitespace-nowrap">
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" /> Message Us on WhatsApp
          </a>
          <a href={SITE.phoneHref} className="btn btn-outline whitespace-nowrap">
            <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function FollowUsSection() {
  if (!SITE.social.facebook) return null;
  return (
    <section className="border-t bg-card py-12 md:py-16">
      <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-xl">
          <p className="eyebrow">Stay connected</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Follow Us on Facebook!</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Stay connected with Glow &amp; Relax Massage for the latest news, updates, promotions, and announcements.
          </p>
        </div>
        <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline shrink-0">
          <Facebook className="h-4 w-4 shrink-0" aria-hidden /> Follow Us on Facebook
        </a>
      </div>
    </section>
  );
}