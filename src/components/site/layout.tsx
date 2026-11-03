import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Phone, X, Facebook, CalendarDays } from "lucide-react";
import logo from "@/assets/glow-and-relax-logo.png.asset.json";
import { SITE, openingNotice } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/massage-cold-lake", label: "Massage" },
  { to: "/brows-lashes-cold-lake", label: "Brows & Lashes" },
  { to: "/permanent-lip-colour-cold-lake", label: "Permanent Lips" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const notice = openingNotice();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      {notice && (
        <div className="bg-ink py-2 text-center text-xs tracking-wide text-ink-foreground">{notice}</div>
      )}
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label="Glow & Relax home">
          <img src={logo.url} alt="Glow and Relax logo" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
          <span className="hidden font-display text-xl leading-none sm:block">
            Glow &amp; Relax
            <span className="mt-1 block font-sans text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">Cold Lake, Alberta</span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="py-2 text-foreground/80 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary underline underline-offset-8" }}
                  activeOptions={{ exact: true }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a href={SITE.phoneHref} className="hidden items-center gap-2 text-sm font-semibold md:flex">
            <Phone className="h-4 w-4 text-blush" aria-hidden /> {SITE.phoneDisplay}
          </a>
          <Link to="/book" className="btn btn-primary hidden !min-h-11 !px-4 sm:inline-flex">
            Book Appointment
          </Link>
          <button
            className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t bg-background lg:hidden">
          <ul className="container-site py-4">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} onClick={() => setOpen(false)} className="block border-b py-3.5 font-display text-xl">
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link to="/book" onClick={() => setOpen(false)} className="btn btn-primary w-full">Book Appointment</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      <a href={SITE.phoneHref} className="flex min-h-14 items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
        <Phone className="h-4 w-4" aria-hidden /> Call Now
      </a>
      <Link to="/book" className="flex min-h-14 items-center justify-center gap-2 bg-primary text-sm font-bold uppercase tracking-wider text-primary-foreground">
        <CalendarDays className="h-4 w-4" aria-hidden /> Book
      </Link>
    </div>
  );
}

export function SiteFooter() {
  const a = SITE.address;
  return (
    <footer className="bg-ink pb-24 pt-16 text-ink-foreground md:pb-10">
      <div className="container-site grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl">Glow &amp; Relax</p>
          <p className="mt-1 text-sm opacity-80">{SITE.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">
            Offering massage, brow, lash and permanent lip-colour services in a welcoming studio inside Marina Mall, Cold Lake.
          </p>
          {SITE.social.facebook && (
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
              <Facebook className="h-5 w-5" aria-hidden /> Follow us on Facebook
            </a>
          )}
        </div>
        <div>
          <h2 className="eyebrow !text-sand">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/massage-cold-lake" className="hover:underline">Massage</Link></li>
            <li><Link to="/brows-lashes-cold-lake" className="hover:underline">Brows &amp; Lashes</Link></li>
            <li><Link to="/permanent-lip-colour-cold-lake" className="hover:underline">Permanent Lip Colour</Link></li>
          </ul>
          <h2 className="eyebrow mt-8 !text-sand">Links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/book" className="hover:underline">Book Appointment</Link></li>
            <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            <li><Link to="/referral-program" className="hover:underline">Referral Program</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow !text-sand">Visit Us</h2>
          <address className="mt-4 text-sm not-italic leading-relaxed">
            {a.venue}<br />{a.street}<br />{a.city}, {a.region} {a.postal}
          </address>
          <h2 className="eyebrow mt-8 !text-sand">Hours</h2>
          {SITE.hours.map((h) => (
            <p key={h.days} className="mt-4 text-sm">{h.days}<br />{h.time}</p>
          ))}
        </div>
        <div>
          <h2 className="eyebrow !text-sand">Phone</h2>
          <a href={SITE.phoneHref} className="mt-4 block text-lg font-semibold">{SITE.phoneDisplay}</a>
          <h2 className="eyebrow mt-8 !text-sand">Policies</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/booking-policy" className="hover:underline">Booking &amp; Cancellation Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 border-t border-ink-foreground/15 pt-6 text-xs opacity-70">
        © {new Date().getFullYear()} Glow &amp; Relax, Cold Lake, Alberta. Website by Bespoke Web Design.
      </div>
    </footer>
  );
}
