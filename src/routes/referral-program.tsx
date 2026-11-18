import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { pageHead } from "@/lib/seo";
import { PageHeader, Section, Placeholder, CtaBand } from "@/components/site/blocks";

export const Route = createFileRoute("/referral-program")({
  head: () =>
    pageHead({
      path: "/referral-program",
      title: `Refer a Friend & Save $${SITE.referral.friendReward} | Glow & Relax Cold Lake`,
      description: `Refer a friend for an eligible massage: they get $${SITE.referral.friendReward} off, and you get $${SITE.referral.referrerReward} off your next massage at Glow & Relax.`,
    }),
  component: Referral,
});

function Referral() {
  const r = SITE.referral;
  const steps = [
    "Tell your friend about Glow & Relax.",
    "Your friend books and completes an eligible massage.",
    `Your friend receives $${r.friendReward} off their eligible massage.`,
    `You receive $${r.referrerReward} off your next eligible massage.`,
  ];
  return (
    <>
      <PageHeader eyebrow="Referral program" title={`Refer a Friend & Save $${r.friendReward}`} intro="Share the relaxation with someone you know — and enjoy a little extra for yourself." />
      <Section>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s} className="border-t border-taupe pt-5">
              <span className="font-display text-3xl text-blush">{i + 1}</span>
              <p className="mt-2 text-lg">{s}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section className="bg-card">
        <div className="max-w-2xl">
          <h2 className="text-3xl">Program Details</h2>
          <div className="mt-6"><Placeholder>Full referral terms will be published here once approved by the owner.</Placeholder></div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
