import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { load } from "cheerio";
import sharp from "sharp";
import { POSTS } from "../src/lib/blog";
import { SITE, SITE_ASSETS } from "../src/lib/site";

// Check the compiled production handler, not the development server.
// Usage: npx tsx scripts/check-pagespeed.ts http://127.0.0.1:4176
const base = new URL(process.argv[2] || "http://127.0.0.1:4176");
const canonicalOrigin = new URL(SITE.url);
type Result = { path: string; checks: number; failures: string[] };
type Candidate = { src: string; width: number };
const results: Result[] = [];
const localImages = new Map<string, number | undefined>();
const externalImages = new Map<string, Candidate>();
const localFonts = new Set<string>();

function check(result: Result, condition: unknown, message: string) {
  result.checks++;
  if (!condition) result.failures.push(message);
}

function candidates(srcSet: string): Candidate[] {
  return srcSet.split(",").flatMap((part) => {
    const match = part.trim().match(/^(\S+)\s+(\d+)w$/);
    return match ? [{ src: match[1]!, width: Number(match[2]) }] : [];
  });
}

async function request(url: URL) {
  return fetch(url, { signal: AbortSignal.timeout(30_000), redirect: "manual" });
}

const staticRoutes: string[] = [];
for (const file of await readdir("src/routes")) {
  if (!file.endsWith(".tsx") || file.startsWith("__") || file === "dev.og.tsx") continue;
  const source = await readFile(`src/routes/${file}`, "utf8");
  const route = source.match(/createFileRoute\(["']([^"']+)["']\)/)?.[1];
  if (route && !route.includes("$"))
    staticRoutes.push(route === "/" ? "/" : route.replace(/\/+$/, ""));
}
const sitemap = load(await readFile("public/sitemap.xml", "utf8"), { xml: true });
const sitemapRoutes = sitemap("url > loc")
  .toArray()
  .map((el) => new URL(sitemap(el).text()).pathname);
const paths = [
  ...new Set([...staticRoutes, ...sitemapRoutes, ...POSTS.map((post) => `/blog/${post.slug}`)]),
].sort();

for (const path of paths) {
  const result: Result = { path, checks: 0, failures: [] };
  results.push(result);
  try {
    const response = await request(new URL(path, base));
    check(result, response.status === 200, `HTTP status ${response.status}, expected 200`);
    check(
      result,
      response.headers.get("content-type")?.includes("text/html"),
      "Expected an HTML response",
    );
    const html = await response.text();
    const dom = load(html);
    check(result, dom("h1").length === 1, `Expected one h1, found ${dom("h1").length}`);
    const canonical = dom('link[rel="canonical"]');
    check(
      result,
      canonical.length === 1 && canonical.attr("href") === new URL(path, canonicalOrigin).href,
      "Missing, duplicate, or incorrect self-canonical",
    );
    check(
      result,
      !html.includes("/__l5e/"),
      "Rendered HTML still references unavailable Lovable assets",
    );
    const logo = dom("header img").filter(
      (_, image) => dom(image).attr("src") === SITE_ASSETS.logo.src,
    );
    check(result, logo.length === 1, "Shared header does not render the approved local logo");
    const brandLink = logo.closest("a");
    const visibleBrand = brandLink
      .children("span")
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const visibleLocation = brandLink
      .children("span")
      .children("span")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    check(
      result,
      brandLink.attr("href") === "/" &&
        !brandLink.attr("aria-label") &&
        !brandLink.attr("aria-labelledby"),
      "Header home link must derive its accessible name from its children",
    );
    check(
      result,
      logo.attr("alt") === `${SITE.name} home`,
      "Logo alt must name the business and home destination",
    );
    check(
      result,
      visibleBrand === SITE.name,
      "Header home link lost the visible desktop business name",
    );
    check(
      result,
      visibleLocation === `${SITE.address.city}, ${SITE.address.regionFull}`,
      "Header home link lost the visible desktop location",
    );

    const fontPreloads = dom('link[rel="preload"][as="font"]');
    check(result, fontPreloads.length > 0, "Expected local font preloads");
    fontPreloads.each((index, font) => {
      const element = dom(font);
      const href = element.attr("href");
      const url = href ? new URL(href, base) : undefined;
      check(
        result,
        url?.origin === base.origin && url.pathname.endsWith(".woff2"),
        `Font preload ${index + 1}: expected a local WOFF2 URL`,
      );
      check(
        result,
        element.attr("type") === "font/woff2",
        `Font preload ${index + 1}: expected font/woff2 type`,
      );
      check(
        result,
        element.attr("crossorigin") === "anonymous" || element.attr("crossorigin") === "",
        `Font preload ${index + 1}: missing anonymous crossorigin`,
      );
      if (url?.origin === base.origin) localFonts.add(url.href);
    });

    dom("img").each((index, image) => {
      const element = dom(image);
      const source = element.attr("src") || "";
      const srcSet = element.attr("srcset") || "";
      const imageCandidates = candidates(srcSet);
      const label = `Image ${index + 1} (${element.attr("alt") || source})`;
      check(result, Boolean(source), `${label}: missing src`);
      check(
        result,
        imageCandidates.length >= 2 && imageCandidates.length === srcSet.split(",").length,
        `${label}: missing or invalid responsive width candidates`,
      );
      check(result, Boolean(element.attr("sizes")?.trim()), `${label}: missing sizes`);
      check(
        result,
        Number(element.attr("width")) > 0 && Number(element.attr("height")) > 0,
        `${label}: missing dimensions`,
      );
      for (const candidate of [{ src: source, width: undefined }, ...imageCandidates]) {
        if (!candidate.src) continue;
        const url = new URL(candidate.src, base);
        if (url.origin === base.origin) {
          localImages.set(url.href, candidate.width ?? localImages.get(url.href));
        } else if (
          url.hostname === "images.unsplash.com" &&
          candidate.width &&
          candidate.width >= 640 &&
          !externalImages.has(url.pathname)
        ) {
          externalImages.set(url.pathname, { src: url.href, width: candidate.width });
        }
      }
    });

    const post = POSTS.find((entry) => path === `/blog/${entry.slug}`);
    if (post?.draft) {
      const robots = dom('meta[name="robots"]')
        .toArray()
        .map((el) => dom(el).attr("content") || "")
        .join(",");
      check(result, /\bnoindex\b/i.test(robots), "Draft blog post lost its noindex directive");
    }

    if (path === "/" || path === "/contact") {
      const lists = dom("dl");
      check(result, lists.length === 1, "Expected the shared VisitUs description list");
      const groups = lists.children("div");
      check(
        result,
        groups.length === 3 && lists.children().length === groups.length,
        "Expected exactly three description groups",
      );
      groups.each((index, group) => {
        const children = dom(group).children().toArray();
        check(
          result,
          children.length === 2 && children[0]?.tagName === "dt" && children[1]?.tagName === "dd",
          `Description group ${index + 1}: dt and dd must be direct children`,
        );
        check(
          result,
          dom(group).children("dd").find('svg[aria-hidden="true"]').length === 1,
          `Description group ${index + 1}: decorative icon must be hidden inside dd`,
        );
      });
    }

    if (path === "/") {
      const hero = dom('main img[fetchpriority="high"]');
      const preload = dom('link[rel="preload"][as="image"]').filter(
        (_, link) => dom(link).attr("imagesrcset") === hero.attr("srcset"),
      );
      check(
        result,
        hero.length === 1 && hero.attr("loading") !== "lazy",
        "Homepage hero must remain eager with high fetch priority",
      );
      // React may emit its own equivalent responsive preload in addition to the route head.
      check(result, preload.length >= 1, "Homepage hero needs a matching responsive preload");
      check(
        result,
        preload.toArray().every((link) => dom(link).attr("imagesizes") === hero.attr("sizes")),
        "Hero preload sizes differ from image sizes",
      );
      check(
        result,
        preload
          .toArray()
          .every((link) => !dom(link).attr("href") || dom(link).attr("href") === hero.attr("src")),
        "Hero preload fallback differs from image src",
      );
    }
  } catch (error) {
    result.failures.push(error instanceof Error ? error.message : String(error));
  }
}

async function checkImage(src: string, width?: number) {
  const result: Result = { path: src, checks: 0, failures: [] };
  results.push(result);
  try {
    const response = await request(new URL(src));
    check(result, response.status === 200, `Image returned ${response.status}, expected 200`);
    check(
      result,
      response.headers.get("content-type")?.startsWith("image/"),
      "Image response has incorrect content type",
    );
    const bytes = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(bytes).metadata();
    check(result, Boolean(metadata.width && metadata.height), "Image bytes could not be decoded");
    if (width)
      check(
        result,
        metadata.width === width,
        `Width descriptor ${width}w differs from actual width ${metadata.width}`,
      );
  } catch (error) {
    result.failures.push(error instanceof Error ? error.message : String(error));
  }
}

for (const [src, width] of localImages) await checkImage(src, width);
for (const src of localFonts) {
  const result: Result = { path: src, checks: 0, failures: [] };
  results.push(result);
  try {
    const response = await request(new URL(src));
    check(result, response.status === 200, `Font returned ${response.status}, expected 200`);
    check(
      result,
      response.headers.get("content-type")?.split(";")[0]?.trim() === "font/woff2",
      "Font response must use font/woff2 MIME type",
    );
    const bytes = Buffer.from(await response.arrayBuffer());
    check(
      result,
      bytes.subarray(0, 4).toString("ascii") === "wOF2",
      "Font bytes lack the WOFF2 signature",
    );
  } catch (error) {
    result.failures.push(error instanceof Error ? error.message : String(error));
  }
}
// Exercise the three photos flagged by the saved report, without requesting every external variant.
const representativePhotos = [
  "1512290923902-8a9f81dc236c",
  "1519823551278-64ac92734fb1",
  "1617897903246-719242758050",
];
for (const id of representativePhotos) {
  const candidate = [...externalImages.entries()].find(([pathname]) => pathname.endsWith(id))?.[1];
  if (candidate) await checkImage(candidate.src, candidate.width);
  else
    results.push({
      path: `Unsplash ${id}`,
      checks: 1,
      failures: ["Expected representative responsive image was not rendered"],
    });
}

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl: base.href,
  routes: paths.length,
  draftRoutes: POSTS.filter((post) => post.draft).length,
  localImages: localImages.size,
  localFonts: localFonts.size,
  externalImages: representativePhotos.length,
  checks: results.reduce((sum, result) => sum + result.checks, 0),
  failures: results.flatMap((result) =>
    result.failures.map((message) => ({ path: result.path, message })),
  ),
  results,
};
await mkdir(".scratch/pagespeed", { recursive: true });
await writeFile(".scratch/pagespeed/route-check.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.failures.length) process.exitCode = 1;
