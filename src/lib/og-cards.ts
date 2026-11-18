import { IMAGES, SITE } from "./site";
import { POSTS } from "./blog";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  key: string;
  path: string;
  label: string;
  headline: string;
  detail: string;
  action: string;
  photo: string;
  alt: string;
}

type CardInput = Omit<OgCard, "alt">;
function card(input: CardInput): OgCard {
  return {
    ...input,
    alt: `${SITE.name}: ${input.headline.replace(/\n/g, " ")} Branded ${input.label.toLowerCase()} card with illustrative photography.`,
  };
}

/** Artwork copy is intentionally separate from search titles and descriptions. */
export const OG_CARDS: OgCard[] = [
  card({
    key: "global",
    path: "global",
    label: "Massage & beauty",
    headline: "Time to relax.\nSpace to be you.",
    detail: `${SITE.address.city}, ${SITE.address.regionFull}`,
    action: "Explore our services",
    photo: IMAGES.hero,
  }),
  card({
    key: "home",
    path: "/",
    label: "Massage & beauty",
    headline: "Relax. Restore.\nFeel beautiful.",
    detail: `Your massage and beauty studio in ${SITE.address.city}.`,
    action: "Find your appointment",
    photo: IMAGES.hero,
  }),
  card({
    key: "about",
    path: "/about",
    label: "Meet your therapist",
    headline: "Personal care.\nA welcoming space.",
    detail: `${SITE.therapist.name}, ${SITE.therapist.title}`,
    action: "Get to know us",
    photo: IMAGES.massage,
  }),
  card({
    key: "massage",
    path: "/massage-cold-lake",
    label: "Massage services",
    headline: "Your time\nto unwind.",
    detail: `Massage care in ${SITE.address.city}, tailored to your needs.`,
    action: "Explore massage options",
    photo: IMAGES.massage,
  }),
  card({
    key: "brows-lashes",
    path: "/brows-lashes-cold-lake",
    label: "Brows & lashes",
    headline: "A little care\nfor your look.",
    detail: `Brow and lash services in ${SITE.address.city}.`,
    action: "Explore beauty services",
    photo: IMAGES.beauty,
  }),
  card({
    key: "lip-colour",
    path: "/permanent-lip-colour-cold-lake",
    label: "Permanent lip colour",
    headline: "Colour starts\nwith a conversation.",
    detail: "Talk through your goals, preparation and aftercare.",
    action: "Explore lip colour",
    photo: IMAGES.lips,
  }),
  card({
    key: "contact",
    path: "/contact",
    label: "Contact & location",
    headline: "Let’s plan\nyour visit.",
    detail: `${SITE.address.street}, ${SITE.address.city}`,
    action: "Find us and get in touch",
    photo: IMAGES.towels,
  }),
  card({
    key: "book",
    path: "/book",
    label: "Appointments",
    headline: "Make time\nfor yourself.",
    detail: "Massage, brows, lashes and permanent lip colour.",
    action: SITE.bookingUrl ? "Book your appointment" : "Call to book",
    photo: IMAGES.hero,
  }),
  card({
    key: "referral",
    path: "/referral-program",
    label: "Referral program",
    headline: "Share a little\nrelaxation.",
    detail: `Your friend gets $${SITE.referral.friendReward} off an eligible massage. You get $${SITE.referral.referrerReward} off your next one.`,
    action: "See how referrals work",
    photo: IMAGES.stillLife,
  }),
  card({
    key: "blog",
    path: "/blog",
    label: "The journal",
    headline: "A little insight.\nA little self-care.",
    detail: "Read about massage, beauty and preparing for your visit.",
    action: "Explore the journal",
    photo: IMAGES.candle,
  }),
  card({
    key: "privacy",
    path: "/privacy-policy",
    label: "Privacy policy",
    headline: "Your privacy\nmatters here.",
    detail: "How we collect, use and protect personal information.",
    action: "Read our privacy policy",
    photo: IMAGES.towels,
  }),
  card({
    key: "booking-policy",
    path: "/booking-policy",
    label: "Booking policy",
    headline: "A clear plan\nfor your appointment.",
    detail: "Booking, rescheduling and cancellation information.",
    action: "Read the booking policy",
    photo: IMAGES.stillLife,
  }),
  ...POSTS.map((post) =>
    card({
      key: `blog-${post.slug}`,
      path: `/blog/${post.slug}`,
      label: post.draft ? "The journal · Draft" : "The journal",
      headline: post.title,
      detail: `Massage and beauty insights from ${SITE.name}.`,
      action: "Read the article",
      photo: post.image,
    }),
  ),
];
