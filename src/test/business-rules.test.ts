import { describe, expect, it } from "vitest";
import { SITE, openingNotice, isOpen } from "@/lib/site";

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

import { MASSAGE_SERVICES as _MS } from "@/lib/site";
const bySlug = (slug: string) => _MS.find((s) => s.slug === slug)?.durations;

test("baby massage is 30 minutes only", () => {
  expect(bySlug("baby")).toEqual([30]);
});

test("prenatal massage is 60 minutes only", () => {
  expect(bySlug("prenatal")).toEqual([60]);
});

test("the other massages offer 45, 60, 90 and 120 minutes", () => {
  for (const s of _MS.filter((s) => s.slug !== "baby" && s.slug !== "prenatal")) {
    expect(s.durations).toEqual([45, 60, 90, 120]);
  }
});

test("therapist is Santiaga Mullen-Patoy, RMT and owner", () => {
  expect(SITE.therapist.name).toBe("Santiaga Mullen-Patoy");
  expect(SITE.therapist.role).toBe("Owner");
  expect(SITE.therapist.title).toContain("Registered Massage Therapist");
  expect(SITE.therapist.mission).toContain("personalized massage therapy");
});
