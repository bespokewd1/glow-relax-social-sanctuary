import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { load } from "cheerio";
import sharp from "sharp";
import { OG_CARDS } from "../src/lib/og-cards";
import { POSTS } from "../src/lib/blog";
import { SITE } from "../src/lib/site";

type ImageDescriptor = { src: string; width: number; height: number; type: string; alt: string };
type Result = {
  path: string;
  passes: string[];
  failures: string[];
  warnings: string[];
  unverified: string[];
};
const args = process.argv.slice(2);
const baseArgument = args.find((arg) => arg.startsWith("--base-url="))?.slice(11);
const baseIndex = args.indexOf("--base-url");
const baseUrl = new URL(
  baseArgument || (baseIndex >= 0 ? args[baseIndex + 1] : undefined) || "http://localhost:3000",
);
const production = args.includes("--production");
const manifest = JSON.parse(await readFile("src/lib/og-manifest.json", "utf8")) as Record<
  string,
  ImageDescriptor
>;
const results: Result[] = [];
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
const images = new Map<string, string>();

function result(path: string): Result {
  const entry = { path, passes: [], failures: [], warnings: [], unverified: [] };
  results.push(entry);
  return entry;
}
function check(entry: Result, condition: unknown, message: string) {
  (condition ? entry.passes : entry.failures).push(message);
}
function unique(entry: Result, values: Map<string, string>, value: string, label: string) {
  if (!value) return;
  check(
    entry,
    !values.has(value),
    `${label} is distinct${values.has(value) ? ` from ${values.get(value)}` : ""}`,
  );
  values.set(value, entry.path);
}
async function fetchPage(path: string) {
  return fetch(new URL(path, baseUrl), { signal: AbortSignal.timeout(30_000), redirect: "manual" });
}
async function validatePng(buffer: Buffer, entry: Result, label: string) {
  check(
    entry,
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    `${label}: PNG signature`,
  );
  const metadata = await sharp(buffer).metadata();
  check(
    entry,
    metadata.width === 1200 && metadata.height === 630,
    `${label}: actual dimensions are 1200 x 630`,
  );
  check(entry, buffer.length < 2 * 1024 * 1024, `${label}: below inherited 2 MiB project target`);
  await sharp(buffer).raw().toBuffer();
  entry.passes.push(`${label}: image fully decodes`);
}

const coverage = result("coverage");
const staticRoutes = (await readdir("src/routes"))
  .filter(
    (file) =>
      file.endsWith(".tsx") &&
      !file.startsWith("__") &&
      !file.includes("$") &&
      file !== "dev.og.tsx",
  )
  .map((file) =>
    file === "index.tsx"
      ? "/"
      : `/${file
          .slice(0, -4)
          .replace(/\.index$/, "")
          .replaceAll(".", "/")}`,
  );
const expectedPaths = [...staticRoutes, ...POSTS.map((post) => `/blog/${post.slug}`)].sort();
const cardPaths = OG_CARDS.filter((card) => card.path !== "global")
  .map((card) => card.path)
  .sort();
check(
  coverage,
  new Set(cardPaths).size === cardPaths.length,
  "Registry has no duplicate page paths",
);
check(
  coverage,
  JSON.stringify(cardPaths) === JSON.stringify(expectedPaths),
  "Every route and blog post, including drafts and policies, has exactly one dedicated card",
);
check(
  coverage,
  Object.keys(manifest).sort().join("\n") === [...cardPaths, "global"].sort().join("\n"),
  "Manifest covers all pages plus global fallback, with no obsolete entries",
);

for (const card of OG_CARDS) {
  const entry = result(card.path);
  try {
    const image = manifest[card.path];
    if (!image) throw new Error("No manifest descriptor");
    check(
      entry,
      image.width === 1200 && image.height === 630 && image.type === "image/png",
      "Manifest dimensions and MIME type meet baseline",
    );
    check(entry, image.alt.trim().length > 20, "Manifest has descriptive image alt text");
    check(entry, /^\/og\/[a-zA-Z0-9_-]+\.png$/.test(image.src), "Image has a public /og/ PNG path");
    if (!/^\/og\/[a-zA-Z0-9_-]+\.png$/.test(image.src)) throw new Error("Unsafe image path");
    await validatePng(await readFile(resolve("public", image.src.slice(1))), entry, "Local asset");
    check(
      entry,
      Boolean(card.headline.trim() && card.action.trim()),
      "Authored headline and action line are present",
    );
    entry.unverified.push(
      "Visual composition, text clipping, legibility, and photographic relevance require gallery review.",
    );
    if (card.path === "global") continue;

    unique(entry, images, image.src, "Dedicated image URL");
    const response = await fetchPage(card.path);
    check(entry, response.status === 200, "Rendered page returns HTTP 200");
    if (response.status !== 200)
      throw new Error(`Cannot inspect page HTML: HTTP ${response.status}`);
    const $ = load(await response.text());
    const meta = (key: string) => {
      const tags = $("head meta").filter(
        (_, el) => $(el).attr("name") === key || $(el).attr("property") === key,
      );
      check(entry, tags.length === 1, `Exactly one ${key} tag`);
      const value = tags.first().attr("content")?.trim() || "";
      check(entry, Boolean(value), `${key} is nonempty`);
      return value;
    };
    const titleElements = $("head title");
    const title = titleElements.text().trim();
    check(entry, titleElements.length === 1 && Boolean(title), "Exactly one nonempty HTML title");
    check(
      entry,
      [...title].length <= 60,
      `HTML title is within 60-character project target (${[...title].length})`,
    );
    unique(entry, titles, title, "HTML title");
    const description = meta("description");
    check(
      entry,
      [...description].length <= 125,
      `Search description meets shared 125-character project target (${[...description].length})`,
    );
    unique(entry, descriptions, description, "Description");
    const ogTitle = meta("og:title");
    const xTitle = meta("twitter:title");
    check(
      entry,
      [...ogTitle].length <= 60 && [...xTitle].length <= 60,
      "OG and X titles meet 60-character project target",
    );
    check(entry, ogTitle === title && xTitle === title, "HTML, OG, and X titles match");
    const ogDescription = meta("og:description");
    const xDescription = meta("twitter:description");
    check(
      entry,
      [...ogDescription].length <= 125 && [...xDescription].length <= 125,
      "OG and X descriptions meet shared 125-character project target",
    );
    check(
      entry,
      ogDescription === description && xDescription === description,
      "Search, OG, and X descriptions match",
    );
    const post = POSTS.find((post) => card.path === `/blog/${post.slug}`);
    check(
      entry,
      meta("og:type") === (post ? "article" : "website"),
      "OG type matches page content",
    );
    check(entry, meta("og:site_name") === SITE.name, "OG site name matches central business data");
    check(entry, meta("og:locale") === "en_CA", "OG locale is en_CA");
    check(entry, meta("twitter:card") === "summary_large_image", "X card uses a large image");
    const canonical = new URL(card.path, SITE.url).href;
    const links = $('head link[rel="canonical"]');
    check(
      entry,
      links.length === 1 && links.attr("href") === canonical,
      "Exactly one production self-canonical",
    );
    check(entry, meta("og:url") === canonical, "OG URL matches production self-canonical");
    const expectedImageUrl = new URL(image.src, baseUrl).href;
    const imageUrl = meta("og:image");
    const parsedImageUrl = new URL(imageUrl);
    const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(parsedImageUrl.hostname);
    check(
      entry,
      parsedImageUrl.protocol === "https:" || (localHost && parsedImageUrl.protocol === "http:"),
      "Social image uses absolute HTTPS URL, with HTTP allowed for local QA",
    );
    check(
      entry,
      imageUrl === expectedImageUrl && meta("twitter:image") === imageUrl,
      "OG and X use this deployment's dedicated image URL",
    );
    check(entry, meta("og:image:secure_url") === imageUrl, "OG secure image URL matches image URL");
    check(
      entry,
      meta("og:image:width") === "1200" && meta("og:image:height") === "630",
      "OG dimension tags match actual PNG",
    );
    check(entry, meta("og:image:type") === "image/png", "OG image type is PNG");
    check(
      entry,
      meta("og:image:alt") === image.alt && meta("twitter:image:alt") === image.alt,
      "OG and X image alt text match manifest",
    );
    const robots = $("head meta")
      .filter((_, el) => ["robots", "googlebot"].includes($(el).attr("name") || ""))
      .map((_, el) => $(el).attr("content") || "")
      .get()
      .join(",");
    check(
      entry,
      post?.draft ? /\bnoindex\b/i.test(robots) : !/\bnoindex\b/i.test(robots),
      post?.draft ? "Draft remains noindex" : "Public page is not accidentally noindex",
    );
    // Fetch the declared absolute URL, never replace its host with the test origin.
    // A local file passing cannot hide an unreachable production-domain image.
    const imageResponse = await fetchPage(imageUrl);
    check(entry, imageResponse.status === 200, "Image is served publicly over HTTP");
    check(
      entry,
      /image\/png/i.test(imageResponse.headers.get("content-type") || ""),
      "Served image MIME type is image/png",
    );
    if (imageResponse.status === 200)
      await validatePng(Buffer.from(await imageResponse.arrayBuffer()), entry, "Served asset");
  } catch (error) {
    entry.failures.push(error instanceof Error ? error.message : String(error));
  }
}

const utility = result("preview-and-sitemap");
try {
  const response = await fetchPage("/dev/og");
  if (production) {
    check(utility, response.status === 404, "Development gallery returns 404 in production");
  } else {
    check(utility, response.status === 200, "Development gallery is available");
    const $ = load(await response.text());
    check(
      utility,
      /\bnoindex\b/i.test($('meta[name="robots"]').attr("content") || ""),
      "Development gallery is noindex",
    );
    const displayed = new Set(
      $("img")
        .map((_, el) => $(el).attr("src"))
        .get(),
    );
    check(
      utility,
      Object.values(manifest).every((image) => displayed.has(image.src)),
      "Gallery displays every card including global fallback",
    );
  }
  const sitemapResponse = await fetchPage("/sitemap.xml");
  check(utility, sitemapResponse.status === 200, "Sitemap is served");
  const sitemap = load(await sitemapResponse.text(), { xmlMode: true });
  const locations = sitemap("loc")
    .map((_, el) => sitemap(el).text())
    .get();
  check(
    utility,
    !locations.some((url) => new URL(url).pathname.startsWith("/dev/")),
    "Development gallery is absent from sitemap",
  );
  for (const path of expectedPaths) {
    const post = POSTS.find((post) => path === `/blog/${post.slug}`);
    const included = locations.includes(new URL(path, SITE.url).href);
    check(
      utility,
      post?.draft ? !included : included,
      `${path}: ${post?.draft ? "draft excluded from" : "public page included in"} sitemap`,
    );
  }
} catch (error) {
  utility.failures.push(error instanceof Error ? error.message : String(error));
}

const failureCount = results.reduce((count, entry) => count + entry.failures.length, 0);
const report = {
  mode: production ? "production" : "development",
  pages: cardPaths.length,
  cards: OG_CARDS.length,
  failureCount,
  warningCount: results.reduce((count, entry) => count + entry.warnings.length, 0),
  limitations: [
    "Local rendered HTML and served image checks do not establish deployed crawler access or cache freshness.",
    "Image headline/action presence is checked from authored card data, not OCR. Visual review is still required.",
    "The screenshot inspector's ninth passing check is unidentified and is not represented as a verified pass.",
    "Character limits and the 2 MiB size guard are project targets, not universal platform validity rules.",
  ],
  results,
};
await mkdir(".scratch/opengraph-baseline", { recursive: true });
await writeFile(
  ".scratch/opengraph-baseline/check-report.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
for (const entry of results) {
  console.log(
    `${entry.failures.length ? "FAIL" : "PASS"} ${entry.path}: ${entry.passes.length} checks passed`,
  );
  for (const message of entry.failures) console.error(`  ${message}`);
}
console.log(
  `${cardPaths.length} pages, ${OG_CARDS.length} cards, ${failureCount} failures. Report: .scratch/opengraph-baseline/check-report.json`,
);
process.exitCode = failureCount ? 1 : 0;
