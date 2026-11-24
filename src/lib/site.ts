/**
 * Central business configuration. Edit values here — every page reads from this file.
 */
export const SITE = {
  name: "Glow & Relax",
  tagline: "Massage & Beauty Studio in Cold Lake, Alberta",
  url: "https://glowandrelax.ca",
  phoneDisplay: "1-825-734-0539",
  phoneHref: "tel:+18257340539",
  whatsapp: {
    display: "780-710-0539",
    digits: "17807100539",
    prefill: "Hello Glow & Relax Massage! I would like to inquire about your massage services and book an appointment.",
  },
  directBilling: {
    heading: "Direct Billing Available!",
    text: "We offer direct billing for eligible insurance providers. Please contact us to confirm your coverage and eligibility.",
    note: "For direct billing inquiries, please ask Santiaga.",
  },
  email: null as string | null, // add when confirmed
  address: {
    venue: "Marina Mall Shopping Mall",
    street: "#7 901 10 St.",
    note: "Inside the mall",
    city: "Cold Lake",
    region: "AB",
    regionFull: "Alberta",
    postal: "T9M 1H8",
    country: "CA",
  },
  hours: [{ days: "Monday–Friday", time: "9:00 AM–4:30 PM" }],
  hoursSchema: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "16:30" },
  mapQuery: "Marina Mall Shopping Mall, #7 901 10 St., Cold Lake, AB T9M 1H8",
  social: {
    facebook: "https://www.facebook.com/glowandrelaxrmt",
    instagram: null as string | null,
  },
  /** Real Google review link — set when the Google Business Profile is live. */
  googleReviewUrl: null as string | null,
  /** Booking provider (Calendly / Jane). null = pending, site shows "Call to Book". */
  bookingUrl: null as string | null,
  therapist: {
    name: "Santiaga Mullen-Patoy",
    title: "Registered Massage Therapist (RMT)",
    role: "Owner",
    mission:
      "To provide compassionate, professional, and personalized massage therapy that promotes relaxation, supports recovery, and enhances overall well-being.",
  },
  referral: {
    friendReward: 20,
    referrerReward: 20,
    service: "massage",
  },
};

/** Approved local brand assets. Portrait stays hidden until an approved photo is available. */
export const SITE_ASSETS = {
  logo: {
    src: "/images/logo/glow-relax-320.webp",
    srcSet: "/images/logo/glow-relax-80.webp 80w, /images/logo/glow-relax-160.webp 160w, /images/logo/glow-relax-320.webp 320w",
    width: 320,
    height: 210,
  },
};

export const OPENINGS = {
  beauty: "2026-12-01",
  massage: "2026-12-01",
};
export const OPENING_DATE_LABEL = "December 1st, 2026";

export function isOpen(kind: keyof typeof OPENINGS, now: Date = new Date()) {
  return now >= new Date(`${OPENINGS[kind]}T00:00:00-07:00`);
}

/** Returns the pre-launch notice, or null once both services have opened. */
export function openingNotice(now: Date = new Date()): string | null {
  if (!isOpen("beauty", now) || !isOpen("massage", now)) return `All Services start ${OPENING_DATE_LABEL}`;
  return null;
}

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`;
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;
export const whatsappUrl = `https://wa.me/${SITE.whatsapp.digits}?text=${encodeURIComponent(SITE.whatsapp.prefill)}`;

export const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postal}`;

export type Duration = 30 | 45 | 60 | 90 | 120;

export interface MassageService {
  slug: string;
  name: string;
  description: string;
  /** Owner-approved appointment lengths and prices. */
  durations: Duration[];
  prices?: { duration: Duration; amount: number }[];
  image: string;
}

/** Stock photos (Unsplash) — placeholders, not photos of the studio. Swap freely. */
const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
export const IMAGES = {
  hero: u("1544161515-4ab6ce6db874", 1800),
  massage: u("1519823551278-64ac92734fb1"),
  beauty: u("1512290923902-8a9f81dc236c"),
  hotStone: u("1600334089648-b0d9d3028eb2"),
  deepTissue: u("1591343395082-e120087004b4"),
  oil: u("1515377905703-c4788e51af15"),
  lips: u("1487412947147-5cebf100ffc2"),
  facial: u("1570172619644-dfd03ed5d881"),
  stillLife: u("1617897903246-719242758050"),
  towels: u("1620733723572-11c53f73a416"),
  candle: u("1540555700478-4be289fbecef"),
};

/** Local OG export inputs. Run sync:og-assets after changing a source photograph. */
export const OG_ASSETS = {
  photos: Object.fromEntries(Object.entries(IMAGES).map(([key, source]) => [source, `assets/og/photos/${key}.jpg`])),
  fonts: {
    display: "assets/og/fonts/CormorantGaramond-Medium.ttf",
    regular: "assets/og/fonts/Mulish-Regular.ttf",
    bold: "assets/og/fonts/Mulish-Bold.ttf",
  },
};

export const MASSAGE_SERVICES: MassageService[] = [
  { slug: "deep-tissue", name: "Deep Tissue Massage", description: "More focused massage techniques using firmer pressure when appropriate.", durations: [60, 90, 120], prices: [{ duration: 60, amount: 120 }, { duration: 90, amount: 150 }, { duration: 120, amount: 200 }], image: IMAGES.deepTissue },
  { slug: "relaxation", name: "Relaxation Massage", description: "Gentle massage designed for comfort and relaxation.", durations: [60, 90, 120], prices: [{ duration: 60, amount: 105 }, { duration: 90, amount: 150 }, { duration: 120, amount: 200 }], image: IMAGES.massage },
  { slug: "prenatal", name: "Prenatal Massage", description: "Massage tailored to pregnancy, subject to suitability and therapist qualifications.", durations: [60, 90, 120], prices: [{ duration: 60, amount: 120 }, { duration: 90, amount: 160 }, { duration: 120, amount: 240 }], image: IMAGES.towels },
  { slug: "baby", name: "Baby Massage (5 Years & Under)", description: "Specialized massage for children 5 years and under.", durations: [30], prices: [{ duration: 30, amount: 75 }], image: IMAGES.stillLife },
  { slug: "hot-stone", name: "Hot Stone Massage", description: "Massage incorporating warmed stones.", durations: [60, 90, 120], prices: [{ duration: 60, amount: 130 }, { duration: 90, amount: 175 }, { duration: 120, amount: 245 }], image: IMAGES.hotStone },
  { slug: "cupping", name: "Cupping Massage", description: "Treatment incorporating cupping techniques.", durations: [60, 90], prices: [{ duration: 60, amount: 110 }, { duration: 90, amount: 150 }], image: IMAGES.candle },
];

export const PMU = {
  name: "Permanent Makeup (PMU)",
  services: ["Ombre / Powder Brows", "Eyeliner / Shadow", "Lip Blush"],
  price: 300,
};

export const PRICING_LABEL = "Contact us for pricing";
