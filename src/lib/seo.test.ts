import { describe, expect, it, vi } from "vitest";
import manifest from "./og-manifest.json";
import { SITE } from "./site";

const request = vi.hoisted(() => ({ origin: "https://preview.workers.dev" }));
vi.mock("./seo-origin", () => ({ getSocialImageOrigin: () => request.origin }));
import { pageHead } from "./seo";

describe("social image deployment origin", () => {
  it.each(["https://preview.workers.dev", SITE.url, "http://localhost:3000"])(
    "uses %s for image URLs while retaining production canonicals",
    (origin) => {
      request.origin = origin;
      const head = pageHead({ path: "/", title: "Home", description: "Home description" });
      const meta = (key: string) =>
        head.meta.find((tag) => tag["property"] === key || tag["name"] === key)?.["content"];
      const expectedImage = new URL(manifest["/"].src, origin).href;
      expect(meta("og:image")).toBe(expectedImage);
      expect(meta("og:image:secure_url")).toBe(expectedImage);
      expect(meta("twitter:image")).toBe(expectedImage);
      expect(meta("og:url")).toBe(`${SITE.url}/`);
      expect(head.links).toEqual([{ rel: "canonical", href: `${SITE.url}/` }]);
    },
  );

  it("does not reuse another request's image origin for a detail page", () => {
    request.origin = "https://first.workers.dev";
    pageHead({ path: "/", title: "Home", description: "Home description" });
    request.origin = "https://second.workers.dev";
    const head = pageHead({ path: "/about", title: "About", description: "About description" });
    expect(head.meta.find((tag) => tag["property"] === "og:image")?.["content"]).toBe(
      new URL(manifest["/about"].src, request.origin).href,
    );
  });
});
