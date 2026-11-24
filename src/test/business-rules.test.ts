import { describe, expect, it } from "vitest";
import { SITE, openingNotice, isOpen, whatsappUrl } from "@/lib/site";

describe("business rules", () => {
  it("phone links dial +18257340539", () => expect(SITE.phoneHref).toBe("tel:+18257340539"));
  it("referral is $20 for both friend and referrer", () => {
    expect(SITE.referral.friendReward).toBe(20);
    expect(SITE.referral.referrerReward).toBe(20);
  });
  it.each(["beauty", "massage"] as const)("%s opens December 1st, 2026, not November 15", (kind) => {
    expect(isOpen(kind, new Date("2026-11-15T12:00:00-07:00"))).toBe(false);
    expect(isOpen(kind, new Date("2026-12-01T06:59:59Z"))).toBe(false);
    expect(isOpen(kind, new Date("2026-12-01T07:00:00Z"))).toBe(true);
  });
  it("opening notice disappears after both openings", () => {
    expect(openingNotice(new Date("2026-12-02T12:00:00-07:00"))).toBeNull();
  });
});

import { MASSAGE_SERVICES as _MS, PMU } from "@/lib/site";
const bySlug = (slug: string) => _MS.find((s) => s.slug === slug)?.durations;

test("baby massage is 30 minutes only", () => {
  expect(bySlug("baby")).toEqual([30]);
});

test("prenatal massage offers 60, 90 and 120 minutes", () => {
  expect(bySlug("prenatal")).toEqual([60, 90, 120]);
});

test("Swedish durations remain unchanged", () => {
  expect(bySlug("swedish")).toEqual([45, 60, 90, 120]);
  expect(_MS.find((s) => s.slug === "swedish")?.prices).toBeUndefined();
});

it.each([
  ["deep-tissue", [[60, 120], [90, 150], [120, 200]]],
  ["relaxation", [[60, 105], [90, 150], [120, 200]]],
  ["hot-stone", [[60, 130], [90, 175], [120, 245]]],
  ["prenatal", [[60, 120], [90, 160], [120, 240]]],
  ["baby", [[30, 75]]],
  ["cupping", [[60, 110], [90, 150]]],
] as const)("%s has exactly the owner-approved prices and durations", (slug, expected) => {
  const service = _MS.find((s) => s.slug === slug);
  expect(service?.prices?.map((price) => [price.duration, price.amount])).toEqual(expected);
  expect(service?.durations).toEqual(expected.map(([duration]) => duration));
});

test("baby massage is for children 5 years and under", () => {
  expect(_MS.find((s) => s.slug === "baby")?.name).toBe("Baby Massage (5 Years & Under)");
});

test("the PMU package/service costs $300 with the approved services", () => {
  expect(PMU.price).toBe(300);
  expect(PMU.services).toEqual(["Ombre / Powder Brows", "Eyeliner / Shadow", "Lip Blush"]);
});

test("Facebook promotion reuses the confirmed business page", () => {
  expect(SITE.social.facebook).toBe("https://www.facebook.com/glowandrelaxrmt");
});

test("therapist is Santiaga Mullen-Patoy, RMT and owner", () => {
  expect(SITE.therapist.name).toBe("Santiaga Mullen-Patoy");
  expect(SITE.therapist.role).toBe("Owner");
  expect(SITE.therapist.title).toContain("Registered Massage Therapist");
  expect(SITE.therapist.mission).toContain("personalized massage therapy");
});

test("WhatsApp uses 780-710-0539 with the approved booking prefill", () => {
  expect(SITE.whatsapp.display).toBe("780-710-0539");
  expect(whatsappUrl).toBe(
    "https://wa.me/17807100539?text=Hello%20Glow%20%26%20Relax%20Massage!%20I%20would%20like%20to%20inquire%20about%20your%20massage%20services%20and%20book%20an%20appointment.",
  );
});

test("direct billing info directs insurance questions to Santiaga", () => {
  expect(SITE.directBilling.heading).toBe("Direct Billing Available!");
  expect(SITE.directBilling.text).toContain("eligible insurance providers");
  expect(SITE.directBilling.note).toContain("Santiaga");
});
