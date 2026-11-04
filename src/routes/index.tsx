import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { SITE, IMAGES, openingNotice } from "@/lib/site";
import santiaga from "@/assets/santiaga-patoy-rmt-photo.png.asset.json";
import { pageHead } from "@/lib/seo";
import { BookButton } from "@/components/site/book-button";
import { Section, SectionTitle, CtaBand, VisitUs, ReviewsSection } from "@/components/site/blocks";

const HERO_SRCSET = [480, 768, 1080, 1400]
  .map((w) => `${IMAGES.hero.replace(/w=\d+/, `w=${w}`).replace("q=70", "q=60")} ${w}w`)
  .join(", ");

export const Route = createFileRoute("/")({
  head: () => {
    const h = pageHead({
      path: "/",
      title: "Glow & Relax | Massage & Beauty Studio in Cold Lake, Alberta",
      description: "Massage, brows, lashes and permanent lip colour in a welcoming studio inside Marina Mall, Cold Lake, Alberta. Call 1-825-734-0539 to book.",
      image: IMAGES.hero,
    });
    return {
      ...h,
      links: [
        ...h.links,
        { rel: "preload", as: "image", href: IMAGES.hero, imageSrcSet: HERO_SRCSET, imageSizes: "(min-width: 1024px) 50vw, 100vw", fetchPriority: "high" },
      ],
    };
  },
  component: Home,
});

const POPULAR = [
  { name: "Relaxation Massage", text: "Gentle, unhurried massage designed around comfort.", to: "/massage-cold-lake" },
  { name: "Deep Tissue Massage", text: "Focused techniques with firmer pressure when appropriate.", to: "/massage-cold-lake" },
  { name: "Brows & Lashes", text: "Brow and lash services to enhance your natural features.", to: "/brows-lashes-cold-lake" },
  { name: "Permanent Lip Colour", text: "Soft, lasting colour, starting with a consultation.", to: "/permanent-lip-colour-cold-lake" },
] as const;

function Home() {
  const notice = openingNotice();
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="grid lg:min-h-[78vh] lg:grid-cols-2">
          <div className="order-2 flex items-center bg-secondary/50 px-5 py-12 md:px-12 lg:order-1 lg:py-20">
            <div className="mx-auto max-w-xl">
              <p className="eyebrow">Massage &amp; Beauty in Cold Lake, Alberta</p>
              <h1 className="mt-5 text-[2.6rem] leading-[1.05] md:text-6xl xl:text-7xl">Relax. Restore. Feel&nbsp;Beautiful.</h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Discover massage, brows, lashes and permanent lip-colour services in a welcoming wellness and beauty studio inside Marina Mall, Cold Lake.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <BookButton>Book an Appointment</BookButton>
                <a href="#services" className="btn btn-outline">Explore Our Services</a>
              </div>
              <p className="mt-8 flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-blush" aria-hidden /> Inside Marina Mall • Cold Lake, Alberta
              </p>
              {notice && <p className="mt-3 border-l-2 border-blush pl-3 text-sm text-muted-foreground">{notice}</p>}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img src={IMAGES.hero} srcSet={HERO_SRCSET} sizes="(min-width: 1024px) 50vw, 100vw" alt="Massage therapist applying oil during a relaxing back massage" className="h-64 w-full object-cover sm:h-96 lg:h-full" width={1800} height={1200} fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* Services */}
      <Section id="services">
        <SectionTitle eyebrow="Our services" title="Massage & Beauty, Under One Roof" />
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { title: "Massage & Wellness", text: "Take time to relax and recharge with massage treatments tailored to your preferences and needs.", cta: "Explore Massage Services", to: "/massage-cold-lake" as const, img: IMAGES.massage, alt: "Therapist's hands massaging a client's back" },
            { title: "Brows, Lashes & Beauty", text: "Enhance your natural beauty with professional brow, lash and permanent lip-colour services.", cta: "Explore Beauty Services", to: "/brows-lashes-cold-lake" as const, img: IMAGES.beauty, alt: "Beauty professional shaping a client's eyebrows" },
          ].map((s) => (
            <article key={s.title} className="group">
              <Link to={s.to} className="block overflow-hidden rounded-md">
                <img src={s.img} alt={s.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" width={1200} height={900} />
              </Link>
              <h3 className="mt-6 text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{s.text}</p>
              <Link to={s.to} className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                {s.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section className="bg-card">
        <SectionTitle eyebrow="Why Glow & Relax" title="A Calm Place to Take Care of Yourself" center />
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { n: "01", t: "Personalized Appointments", d: "Every visit starts with a conversation about what you'd like from your treatment, so your appointment reflects your preferences." },
            { n: "02", t: "A Welcoming, Relaxing Environment", d: "A quiet, comfortable studio where you can slow down — whether you're here for a massage or a beauty service." },
            { n: "03", t: "Convenient Cold Lake Location", d: "Find us inside Marina Mall on 10 Street, with easy access and weekday hours that fit around errands and work." },
          ].map((v) => (
            <div key={v.n} className="border-t border-taupe pt-6">
              <span className="font-display text-2xl text-blush">{v.n}</span>
              <h3 className="mt-2 text-2xl">{v.t}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Popular */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionTitle eyebrow="Popular services" title="Where Most Guests Begin">
              Not sure what to choose? Call us and we'll help you find the right fit.
            </SectionTitle>
            <img src={IMAGES.stillLife} alt="Massage oil bottle with eucalyptus on soft linen" loading="lazy" className="hidden aspect-[4/5] w-full rounded-md object-cover lg:block" width={900} height={1100} />
          </div>
          <ul className="divide-y border-y self-start">
            {POPULAR.map((p) => (
              <li key={p.name}>
                <Link to={p.to} className="group flex items-center justify-between gap-6 py-7">
                  <div>
                    <h3 className="text-2xl transition-colors group-hover:text-primary">{p.name}</h3>
                    <p className="mt-1 text-muted-foreground">{p.text}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-blush transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Meet */}
      <Section className="bg-secondary/40">
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <img
            src={santiaga.url}
            alt={`${SITE.therapist.name}, Registered Massage Therapist at Glow & Relax in Cold Lake`}
            width={1200}
            height={1224}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-md object-cover object-top"
          />
          <div>
            <p className="eyebrow">Meet your therapist</p>
            <h2 className="mt-3 text-3xl md:text-4xl">The Hands Behind Glow &amp; Relax</h2>
            <p className="mt-6 font-display text-2xl">{SITE.therapist.name}, RMT</p>
            <p className="text-sm text-muted-foreground">{SITE.therapist.role} • {SITE.therapist.title}</p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              “I'm passionate about helping people feel their best through personalized massage therapy — whether you're
              dealing with muscle tension, everyday stress, or simply need time to unwind.”
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">More about me <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </Section>

      {/* First visit */}
      <Section>
        <SectionTitle eyebrow="Your first visit" title="Simple From Start to Finish" />
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Choose a service", "Browse massage and beauty services, or call and we'll help you decide."],
            ["Book your time", `Call ${SITE.phoneDisplay} to book. Online booking is coming soon.`],
            ["Arrive a few minutes early", "We'll go over your preferences and any questions before we begin."],
            ["Find the studio", "We're at Unit #7 inside Marina Mall, 901 10 Street, Cold Lake."],
            ["Questions anytime", "Call us during weekday hours — we're happy to help."],
          ].map(([t, d], i) => (
            <li key={t}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary font-display text-lg text-primary">{i + 1}</span>
              <h3 className="mt-4 text-xl">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
        <Link to="/blog/$slug" params={{ slug: "what-to-expect-first-massage" }} className="btn btn-outline mt-10">What to Expect</Link>
      </Section>

      {/* Referral */}
      <section className="bg-ink py-16 text-ink-foreground md:py-20">
        <div className="container-site grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow !text-sand">Referral program</p>
            <h2 className="mt-3 text-3xl md:text-5xl">Share the Relaxation. Save ${SITE.referral.friendReward}.</h2>
            <p className="mt-4 opacity-85">Refer a friend for a massage and enjoy a little extra relaxation together.</p>
          </div>
          <div>
            <ul className="space-y-4">
              <li className="border-l-2 border-blush pl-4">Your friend receives <strong>${SITE.referral.friendReward} off</strong> their eligible massage.</li>
              <li className="border-l-2 border-blush pl-4">You receive <strong>${SITE.referral.referrerReward} off</strong> your next eligible massage after your friend's first completed appointment.</li>
            </ul>
            <Link to="/referral-program" className="btn btn-light mt-8">Referral Terms</Link>
          </div>
        </div>
      </section>

      <Section className="bg-card"><ReviewsSection /></Section>
      <Section><VisitUs /></Section>
      <CtaBand />
    </>
  );
}
