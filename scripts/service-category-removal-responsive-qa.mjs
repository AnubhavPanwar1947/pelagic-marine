import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const REMOVED_CATEGORY_PATHS = [
  "/services/naval-architecture-design/",
  "/services/engineering/",
  "/services/inspection-audits-surveying/",
  "/services/mooring-compatibility/",
  "/services/loadicator/",
];
const SEARCH_QUERIES = [
  "Naval Architecture",
  "Engineering",
  "Inspection",
  "Mooring",
  "Loadicator",
];
const SAMPLE_SERVICE = "/services/design-analysis/";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

function overflowIssue(label, metrics) {
  if (metrics.scrollW > metrics.vw + 0.5) {
    return `${label}: overflow ${metrics.scrollW} > ${metrics.vw}`;
  }
  return null;
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const width of WIDTHS) {
  const paths = ["/", "/services/", SAMPLE_SERVICE, "/search/"];
  for (const path of paths) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    const url = path === "/search/"
      ? new URL(`/search/?q=${encodeURIComponent("Engineering")}`, BASE).href
      : new URL(path, BASE).href;
    await page.goto(url, { waitUntil: "networkidle" });
    await dismiss(page);
    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    }));
    const o = overflowIssue(`${width}px ${path}`, metrics);
    if (o) issues.push(o);

    if (path === "/") {
      const badHome = await page.evaluate((removed) => {
        return [...document.querySelectorAll("a[href]")].some((a) => {
          const h = a.getAttribute("href") ?? "";
          return removed.some((r) => h === r || h === r.replace(/\/$/, ""));
        });
      }, REMOVED_CATEGORY_PATHS);
      if (badHome) issues.push(`${width}px: home links to removed category URL`);
    }

    if (path === "/search/") {
      const badSearch = await page.evaluate((removed) => {
        const norm = (h) => (h.endsWith("/") ? h : `${h}/`);
        return [...document.querySelectorAll("a.site-search-result-row")].some((a) => {
          const h = norm(a.getAttribute("href") ?? "");
          return removed.includes(h);
        });
      }, REMOVED_CATEGORY_PATHS);
      if (badSearch) issues.push(`${width}px: search shows removed category URL`);
    }

    await page.close();
  }

  const menuPage = await browser.newPage();
  await menuPage.setViewportSize({ width, height: 900 });
  await menuPage.goto(new URL("/services/", BASE).href, { waitUntil: "networkidle" });
  await dismiss(menuPage);
  const badServicesNav = await menuPage.evaluate((removed) => {
    return [...document.querySelectorAll("a[href]")].some((a) => {
      const h = a.getAttribute("href") ?? "";
      return removed.some((r) => h === r);
    });
  }, REMOVED_CATEGORY_PATHS);
  if (badServicesNav) issues.push(`${width}px: /services/ links to removed category URL`);
  const metricsSvc = await menuPage.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
  }));
  const oSvc = overflowIssue(`${width}px /services/ (nav check)`, metricsSvc);
  if (oSvc) issues.push(oSvc);
  await menuPage.close();
}

for (const oldPath of REMOVED_CATEGORY_PATHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  const resp = await page.goto(new URL(oldPath, BASE).href, { waitUntil: "networkidle" });
  await dismiss(page);
  const finalPath = await page.evaluate(() => location.pathname);
  const normalized = finalPath.endsWith("/") ? finalPath : `${finalPath}/`;
  if (normalized !== "/services/") {
    issues.push(`redirect ${oldPath} ended at ${finalPath} (expected /services/)`);
  }
  await page.close();
}

for (const query of SEARCH_QUERIES) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(new URL(`/search/?q=${encodeURIComponent(query)}`, BASE).href, {
    waitUntil: "networkidle",
  });
  await dismiss(page);
  const bad = await page.evaluate((removed) => {
    return [...document.querySelectorAll("a.site-search-result-row")].some((a) => {
      const h = a.getAttribute("href") ?? "";
      return removed.some((r) => h === r);
    });
  }, REMOVED_CATEGORY_PATHS);
  if (bad) issues.push(`search "${query}" lists removed category URL`);
  await page.close();
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 1280, height: 900 });
await zoom.goto(new URL("/services/", BASE).href, { waitUntil: "networkidle" });
await dismiss(zoom);
await zoom.evaluate(() => {
  document.body.style.zoom = "200%";
});
await zoom.waitForTimeout(300);
const zm = await zoom.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  vw: window.innerWidth,
}));
const zo = overflowIssue("1280@200% /services/", zm);
if (zo) issues.push(zo);
await zoom.close();

await browser.close();

const out = { issues, pass: issues.length === 0 };
console.log(JSON.stringify(out, null, 2));
process.exit(issues.length ? 1 : 0);
