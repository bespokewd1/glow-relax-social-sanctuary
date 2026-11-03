/**
 * Central business configuration. Edit values here — every page reads from this file.
 */
export const SITE = {
  name: "Glow & Relax",
  tagline: "Massage & Beauty Studio in Cold Lake, Alberta",
  url: "https://glowandrelax.ca",
  phoneDisplay: "1-825-734-0539",
  phoneHref: "tel:+18257340539",
  email: null as string | null, // add when confirmed
  address: {
    venue: "Marina Mall Shopping Mall",
    street: "Unit #7, 901 10 Street",
    city: "Cold Lake",
    region: "AB",
    regionFull: "Alberta",
    postal: "T9M 1H8",
    country: "CA",
  },
  hours: [{ days: "Monday–Friday", time: "9:00 AM–4:30 PM" }],
  hoursSchema: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "16:30" },
  mapQuery: "Marina Mall, 901 10 Street, Cold Lake, AB T9M 1H8",
  social: {
    facebook: "https://www.facebook.com/glowandrelaxrmt",
    instagram: null as string | null,
  },
  /** Real Google review link — set when the Google Business Profile is live. */
  googleReviewUrl: null as string | null,
  /** Booking provider (Calendly / Jane). null = pending, site shows "Call to Book". */
  bookingUrl: null as string | null,
  referral: {
    friendReward: 20,
    referrerReward: 20,
    service: "massage",
  },
};

export const OPENINGS = {
  beauty: "2026-11-15",
  massage: "2026-12-01",
};

export function isOpen(kind: keyof typeof OPENINGS, now: Date = new Date()) {
  return now >= new Date(`${OPENINGS[kind]}T00:00:00-07:00`);
}

/** Returns the pre-launch notice, or null once both services have opened. */
export function openingNotice(now: Date = new Date()): string | null {
  const parts: string[] = [];
  if (!isOpen("beauty", now)) parts.push("Beauty services from November 15");
  if (!isOpen("massage", now)) parts.push("Massage services from December 1");
  return parts.length ? parts.join(" • ") : null;
}

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`;
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;

export const fullAddress = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postal}`;

export type Duration = 45 | 60 | 90 | 120;

export interface MassageService {
  slug: string;
  name: string;
  description: string;
  /** Confirm with owner — only listed durations are shown. */
  durations: Duration[];
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

export const MASSAGE_SERVICES: MassageService[] = [
  { slug: "deep-tissue", name: "Deep Tissue Massage", description: "More focused massage techniques using firmer pressure when appropriate.", durations: [], image: IMAGES.deepTissue },
  { slug: "relaxation", name: "Relaxation Massage", description: "Gentle massage designed for comfort and relaxation.", durations: [], image: IMAGES.massage },
  { slug: "swedish", name: "Swedish Massage", description: "Traditional massage featuring flowing massage strokes.", durations: [], image: IMAGES.oil },
  { slug: "prenatal", name: "Prenatal Massage", description: "Massage tailored to pregnancy, subject to suitability and therapist qualifications.", durations: [], image: IMAGES.towels },
  { slug: "baby", name: "Baby Massage", description: "Specialized infant massage service — exact format and eligibility to be confirmed.", durations: [], image: IMAGES.stillLife },
  { slug: "hot-stone", name: "Hot Stone Massage", description: "Massage incorporating warmed stones.", durations: [], image: IMAGES.hotStone },
  { slug: "cupping", name: "Cupping Massage", description: "Treatment incorporating cupping techniques.", durations: [], image: IMAGES.candle },
];

export const PRICING_LABEL = "Contact us for pricing";
