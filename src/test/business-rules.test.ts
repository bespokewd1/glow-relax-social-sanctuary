import { describe, expect, it } from "vitest";
import { SITE, openingNotice, isOpen } from "@/lib/site";

describe("business rules", () => {
  it("phone links dial +18257340539", () => expect(SITE.phoneHref).toBe("tel:+18257340539"));
  it("referral is $20 for both friend and referrer", () => {
    expect(SITE.referral.friendReward).toBe(20);
    expect(SITE.referral.referrerReward).toBe(20);
  });
  it("beauty opens Nov 15 2026, massage Dec 1 2026", () => {
    expect(isOpen("beauty", new Date("2026-11-14T12:00:00-07:00"))).toBe(false);
    expect(isOpen("beauty", new Date("2026-11-15T12:00:00-07:00"))).toBe(true);
    expect(isOpen("massage", new Date("2026-11-30T12:00:00-07:00"))).toBe(false);
    expect(isOpen("massage", new Date("2026-12-01T12:00:00-07:00"))).toBe(true);
  });
  it("opening notice disappears after both openings", () => {
    expect(openingNotice(new Date("2026-12-02T12:00:00-07:00"))).toBeNull();
  });
});

import { MASSAGE_SERVICES as _MS } from "@/lib/site";
test("every massage offers 45, 60, 90 and 120 minutes", () => {
  for (const s of _MS) expect(s.durations).toEqual([45, 60, 90, 120]);
});
