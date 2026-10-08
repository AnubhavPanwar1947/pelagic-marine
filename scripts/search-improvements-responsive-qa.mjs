import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const QUERIES = [
  "the loadicator",
  "Naval Architecture",
  "FEA",
  "CFD",
  "mooring loadicator",
  "surveys",
];
const REMOVED = [
  "/services/naval-architecture-design/",
  "/services/engineering/",
  "/services/inspection-audits-surveying/",
  "/services/mooring-compatibility/",
  "/services/loadicator/",
];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

const issues = [];
const browser = await chromium.launch({ headless: true });

for (const width of WIDTHS) {
  for (const path of ["/", "/services/", "/services/finite-element-analysis/"]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(new URL(path, BASE).href, { waitUntil: "networkidle" });
    await dismiss(page);
    const m = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    }));
    if (m.scrollW > m.vw + 0.5) {
      issues.push(`${width}px ${path}: overflow ${m.scrollW} > ${m.vw}`);
    }
    await page.close();
  }

  for (const q of QUERIES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(new URL(`/search/?q=${encodeURIComponent(q)}`, BASE).href, {
      waitUntil: "networkidle",
    });
    await dismiss(page);
    const bad = await page.evaluate((removed) => {
      const norm = (h) => (h.endsWith("/") ? h : `${h}/`);
      return [...document.querySelectorAll("a.site-search-result-row")].some((a) =>
        removed.includes(norm(a.getAttribute("href") ?? "")),
      );
    }, REMOVED);
    if (bad) issues.push(`${width}px search "${q}": removed category URL`);
    const sm = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
    }));
    if (sm.scrollW > sm.vw + 0.5) {
      issues.push(`${width}px search "${q}": overflow`);
    }
    const input = page.locator('input[type="search"], input[name="q"]').first();
    if (!(await input.count())) {
      issues.push(`${width}px search "${q}": missing search input`);
    }
    await page.close();
  }
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 1280, height: 900 });
await zoom.goto(new URL("/search/?q=FEA", BASE).href, { waitUntil: "networkidle" });
await dismiss(zoom);
await zoom.evaluate(() => {
  document.body.style.zoom = "200%";
});
await zoom.waitForTimeout(300);
const zm = await zoom.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  vw: window.innerWidth,
}));
if (zm.scrollW > zm.vw + 0.5) {
  issues.push("1280@200% search FEA: overflow");
}
await zoom.close();
await browser.close();

console.log(JSON.stringify({ pass: issues.length === 0, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
