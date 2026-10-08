import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const NEW_SERVICE = "/services/design-analysis/";
const SEARCH_QUERY = "Design";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height: 900 });
  await page.goto(new URL("/services/", BASE).href, { waitUntil: "networkidle" });
  await dismiss(page);
  const chip = page.locator(`a[href="${NEW_SERVICE}"]`).first();
  if (!(await chip.count())) {
    issues.push(`${width}px: services page missing ${NEW_SERVICE} chip`);
  }
  const metrics = await page.evaluate((vw) => ({
    scrollW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
  }), width);
  if (metrics.scrollW > metrics.vw + 0.5) {
    issues.push(`${width}px: /services/ overflow ${metrics.scrollW} > ${metrics.vw}`);
  }
  await page.close();

  const searchPage = await browser.newPage();
  await searchPage.setViewportSize({ width, height: 900 });
  await searchPage.goto(
    new URL(`/search/?q=${encodeURIComponent(SEARCH_QUERY)}`, BASE).href,
    { waitUntil: "networkidle" },
  );
  await dismiss(searchPage);
  const hasLegacy = await searchPage.evaluate(() =>
    [...document.querySelectorAll("a.site-search-result-row")].some((a) =>
      (a.getAttribute("href") ?? "").includes("/service-"),
    ),
  );
  if (hasLegacy) {
    issues.push(`${width}px: search results still use legacy service-* URLs`);
  }
  const sm = await searchPage.evaluate((vw) => ({
    scrollW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
  }), width);
  if (sm.scrollW > sm.vw + 0.5) {
    issues.push(`${width}px: search overflow`);
  }
  await searchPage.close();
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 1280, height: 900 });
await zoom.goto(new URL(NEW_SERVICE, BASE).href, { waitUntil: "networkidle" });
await dismiss(zoom);
await zoom.evaluate(() => {
  document.body.style.zoom = "200%";
});
await zoom.waitForTimeout(300);
const zm = await zoom.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  vw: window.innerWidth,
  path: location.pathname,
}));
if (!zm.path.includes("design-analysis")) {
  issues.push("1280@200%: design-analysis page did not load");
}
if (zm.scrollW > zm.vw + 0.5) {
  issues.push("1280@200%: design-analysis overflow");
}
await zoom.close();

await browser.close();
console.log(JSON.stringify({ pass: issues.length === 0, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
