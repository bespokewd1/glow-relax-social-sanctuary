// Optional browser QA without adding a project dependency.
// Install Playwright separately, or set PLAYWRIGHT_MODULE to its package directory.
// Usage: node scripts/check-performance-interactions.mjs <base-url> [output-directory]
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = new URL(process.argv[2] || "http://127.0.0.1:4178");
const output = resolve(process.argv[3] || ".scratch/pagespeed/followup/interactions");
const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(
  modulePath ? pathToFileURL(resolve(modulePath, "index.mjs")).href : "playwright"
);
const executablePath = process.env.CHROME_PATH;
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});
await mkdir(output, { recursive: true });
const report = {
  baseUrl: base.href,
  checkedAt: new Date().toISOString(),
  checks: 0,
  failures: [],
  warnings: [],
  pages: [],
};
function check(condition, message, page) {
  report.checks++;
  if (!condition) report.failures.push({ page, message });
}
const routes = [
  "/",
  "/contact",
  "/about",
  "/massage-cold-lake",
  "/brows-lashes-cold-lake",
  "/permanent-lip-colour-cold-lake",
  "/blog/what-to-expect-first-massage",
];
const devices = { mobile: { width: 412, height: 823 }, desktop: { width: 1350, height: 940 } };
try {
  for (const [device, viewport] of Object.entries(devices)) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    for (const route of routes) {
      const page = await context.newPage();
      const label = `${device} ${route}`;
      page.on("pageerror", (error) => check(false, `Browser exception: ${error.message}`, label));
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        const location = message.location().url;
        if (!location || location.startsWith(base.origin))
          check(false, `Console error: ${message.text()}`, label);
        else report.warnings.push({ page: label, message: message.text(), source: location });
      });
      try {
        const response = await page.goto(new URL(route, base).href, {
          waitUntil: "load",
          timeout: 30_000,
        });
        check(response?.status() === 200, `HTTP status ${response?.status()}`, label);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(
          () =>
            [...document.images]
              .filter(
                (image) =>
                  image.getBoundingClientRect().top < innerHeight &&
                  image.getBoundingClientRect().bottom > 0,
              )
              .every((image) => image.complete),
          undefined,
          { timeout: 15_000 },
        );
        const state = await page.evaluate(() => {
          const box = (selector) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              display: style.display,
              color: style.color,
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              position: style.position,
            };
          };
          const images = [...document.images].filter(
            (image) =>
              image.getBoundingClientRect().top < innerHeight &&
              image.getBoundingClientRect().bottom > 0,
          );
          return {
            overflow: document.documentElement.scrollWidth - innerWidth,
            headings: document.querySelectorAll("h1").length,
            fonts: {
              body: document.fonts.check('400 16px "Mulish"'),
              heading: document.fonts.check('500 32px "Cormorant Garamond"'),
            },
            images: images.map((image) => ({
              src: image.currentSrc,
              loaded: image.complete && image.naturalWidth > 0,
            })),
            boxes: Object.fromEntries(
              [
                "body",
                "header",
                "main",
                "h1",
                "main img",
                ".eyebrow",
                'nav[aria-label="Main"]',
                "body > div.fixed",
              ].map((selector) => [selector, box(selector)]),
            ),
          };
        });
        check(state.headings === 1, "Expected one h1", label);
        check(state.overflow <= 1, `Horizontal overflow ${state.overflow}px`, label);
        check(state.fonts.body && state.fonts.heading, "Expected web fonts did not load", label);
        for (const image of state.images)
          check(image.loaded, `Visible image failed: ${image.src}`, label);
        check(
          (await page.getByRole("navigation", { name: "Main", exact: true }).isVisible()) ===
            (device === "desktop"),
          "Main navigation has wrong responsive visibility",
          label,
        );
        check(
          (await page.getByRole("button", { name: "Open menu", exact: true }).isVisible()) ===
            (device === "mobile"),
          "Menu toggle has wrong responsive visibility",
          label,
        );
        const actionBar = page.locator("body > div.fixed");
        check(
          (await actionBar.isVisible()) === (device === "mobile"),
          "Mobile action bar has wrong responsive visibility",
          label,
        );
        const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
        const screenshot = `${device}-${slug}.png`;
        await page.screenshot({ path: resolve(output, screenshot), animations: "disabled" });
        report.pages.push({ device, route, screenshot, ...state });

        if (route === "/") {
          if (device === "mobile") {
            await page.getByRole("button", { name: "Open menu", exact: true }).click();
            await page
              .getByRole("navigation", { name: "Mobile", exact: true })
              .waitFor({ state: "visible" });
            check(
              (await page
                .getByRole("button", { name: "Close menu", exact: true })
                .getAttribute("aria-expanded")) === "true",
              "Mobile menu did not expand",
              label,
            );
            await page.screenshot({
              path: resolve(output, "mobile-menu-open.png"),
              animations: "disabled",
            });
            await page.getByRole("button", { name: "Close menu", exact: true }).click();
            await page
              .getByRole("navigation", { name: "Mobile", exact: true })
              .waitFor({ state: "hidden" });
            check(
              (await page
                .getByRole("button", { name: "Open menu", exact: true })
                .getAttribute("aria-expanded")) === "false",
              "Mobile menu did not collapse",
              label,
            );
            await page.getByRole("button", { name: "Open menu", exact: true }).click();
          }
          await page.evaluate(() => {
            window.__performanceNavigationMarker = "retained";
          });
          const navigation = page.getByRole("navigation", {
            name: device === "mobile" ? "Mobile" : "Main",
            exact: true,
          });
          await navigation.getByRole("link", { name: "Contact", exact: true }).click();
          await page.waitForURL(new URL("/contact", base).href);
          await page.waitForFunction(() =>
            document.querySelector("h1")?.textContent.includes("Contact"),
          );
          check(
            (await page.evaluate(() => window.__performanceNavigationMarker)) === "retained",
            "Navigation reloaded the document instead of using the router",
            label,
          );
          check(
            (await page.locator("h1").textContent())?.includes("Contact"),
            "Client navigation did not render Contact",
            label,
          );
          if (device === "mobile")
            check(
              (await page.getByRole("navigation", { name: "Mobile", exact: true }).count()) === 0,
              "Navigation left mobile menu open",
              label,
            );
        }
        if (route === "/massage-cold-lake" || route === "/permanent-lip-colour-cold-lake") {
          const question =
            route === "/massage-cold-lake"
              ? "Which massage should I choose?"
              : "Do I need a consultation first?";
          const trigger = page.getByRole("button", { name: question, exact: true });
          await trigger.scrollIntoViewIfNeeded();
          await trigger.click();
          await page.waitForFunction(
            (text) =>
              [...document.querySelectorAll("button")].some(
                (button) =>
                  button.textContent.includes(text) &&
                  button.getAttribute("aria-expanded") === "true",
              ),
            question,
          );
          const contentId = await trigger.getAttribute("aria-controls");
          const panel = page.locator(`[id="${contentId}"]`);
          await panel.waitFor({ state: "visible" });
          check(await panel.isVisible(), "FAQ panel did not become visible", label);
          check((await panel.boundingBox())?.height > 20, "FAQ panel has no visible height", label);
          await page.screenshot({
            path: resolve(output, `${device}-${slug}-faq-open.png`),
            animations: "disabled",
          });
          await trigger.click();
          await page.waitForFunction(
            (text) =>
              [...document.querySelectorAll("button")].some(
                (button) =>
                  button.textContent.includes(text) &&
                  button.getAttribute("aria-expanded") === "false",
              ),
            question,
          );
          await panel.waitFor({ state: "hidden" });
          check(!(await panel.isVisible()), "FAQ panel did not close", label);
        }
      } catch (error) {
        check(false, error.message, label);
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(resolve(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(
  JSON.stringify({
    checks: report.checks,
    pages: report.pages.length,
    failures: report.failures,
    warnings: report.warnings,
    output,
  }),
);
if (report.failures.length) process.exitCode = 1;
