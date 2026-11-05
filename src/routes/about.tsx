import { createFileRoute, Link } from "@tanstack/react-router";
import { IMAGES, SITE } from "@/lib/site";
import santiaga from "@/assets/santiaga-patoy-rmt-photo.png.asset.json";
import { pageHead } from "@/lib/seo";
import { Section, CtaBand } from "@/components/site/blocks";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      path: "/about",
      title: "About Santiaga Mullen-Patoy, RMT | Glow & Relax Cold Lake",
      description:
        "Meet Santiaga Mullen-Patoy, RMT and owner of Glow & Relax, a massage and beauty studio inside Marina Mall in Cold Lake, Alberta — personalized massage therapy in a welcoming space.",
    }),
  component: About,
});

function About() {
  return (
    <>
      <Section className="pt-8 md:pt-12">
        <div className="grid gap-12 md:grid-cols-[0.75fr_1.25fr] md:items-start">
          <figure>
            <img
              src={santiaga.url}
              alt={`${SITE.therapist.name}, RMT at Glow & Relax in Cold Lake`}
              width={900}
              height={1125}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-md object-cover object-top"
            />
            <figcaption className="mt-4">
              <p className="font-display text-2xl">{SITE.therapist.name}, RMT</p>
              <p className="text-sm text-muted-foreground">{SITE.therapist.role} • {SITE.therapist.title}</p>
            </figcaption>
          </figure>

          <div>
            <h1 className="text-4xl md:text-5xl">About Me</h1>
            <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Hi, I'm {SITE.therapist.name}, the owner of Glow &amp; Relax in Cold Lake, Alberta.
              </p>
              <p>
                I'm passionate about helping people feel their best through personalized massage therapy. Whether you're
                dealing with muscle tension, everyday stress, or simply need time to unwind, my goal is to help you feel
                relaxed, refreshed, and cared for.
              </p>
              <p>
                I created Glow &amp; Relax to offer a peaceful, welcoming space where every client feels comfortable,
                valued, and respected.
              </p>
            </div>
            <div className="mt-8 border-t border-taupe pt-8">
              <h3 className="text-2xl">My Mission</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{SITE.therapist.mission}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/massage-cold-lake" className="btn btn-primary">Massage</Link>
              <Link to="/brows-lashes-cold-lake" className="btn btn-outline">Beauty Services</Link>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-card">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">What I want you to leave with</p>
          <blockquote className="mt-5 font-display text-2xl leading-snug md:text-4xl">
            “Relaxed, refreshed, and cared for — every time.”
          </blockquote>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { t: "Relaxation", d: "Unhurried appointments shaped around your comfort and what you'd like to feel when you leave." },
            { t: "Recovery", d: "Focused massage for muscle tension, everyday stress and the areas that need attention." },
            { t: "Well-being", d: "Care that supports how you feel overall — body and look, in one welcoming place." },
          ].map((p) => (
            <div key={p.t} className="border-t border-taupe pt-6">
              <h3 className="text-2xl">{p.t}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl">Massage &amp; Beauty, Under One Roof</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Alongside massage, we offer brow, lash and permanent lip-colour services, so you can care for both body and
              look in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/permanent-lip-colour-cold-lake" className="btn btn-outline">Permanent Lip Colour</Link>
              <Link to="/contact" className="btn btn-outline">Ask Me Anything</Link>
            </div>
          </div>
          <img src={IMAGES.beauty} alt="Beauty professional shaping a client's eyebrows" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" width={1200} height={900} />
        </div>
      </Section>

      <Section className="bg-card">
        <img src={IMAGES.candle} alt="Spa towel, lotion and tulips" loading="lazy" className="aspect-[21/9] w-full rounded-md object-cover" width={1600} height={700} />
      </Section>
      <CtaBand />
    </>
  );
}
