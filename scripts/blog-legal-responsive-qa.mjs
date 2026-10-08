import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const NEW_PAGES = [
  "/marine-insights/",
  "/marine-insights/computational-fluid-dynamics/",
  "/privacy-policy/",
  "/cookies-policy/",
  "/terms-and-conditions/",
  "/disclaimer/",
  "/standard-terms-and-conditions-of-engagement/",
];
const REDIRECTS = [
  ["/news/", "/marine-insights/"],
  ["/privacy/", "/privacy-policy/"],
  ["/engagement/", "/standard-terms-and-conditions-of-engagement/"],
];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height: 900 });
  await page.goto(new URL("/", BASE).href, { waitUntil: "networkidle" });
  await dismiss(page);
  const footer = await page.evaluate(() => {
    const links = [...document.querySelectorAll("footer a[href]")].map((a) =>
      a.getAttribute("href"),
    );
    const scrollW = document.documentElement.scrollWidth;
    return { links, scrollW, vw: window.innerWidth };
  });
  for (const bad of ["/privacy", "/cookies", "/terms", "/engagement", "/news"]) {
    if (footer.links.some((h) => h === bad || h === `${bad}/`)) {
      issues.push(`${width}px: footer still links to ${bad}`);
    }
  }
  if (footer.scrollW > footer.vw + 0.5) {
    issues.push(`${width}px: home footer overflow`);
  }
  await page.close();

  for (const route of NEW_PAGES) {
    const p = await browser.newPage();
    await p.setViewportSize({ width, height: 900 });
    await p.goto(new URL(route, BASE).href, { waitUntil: "networkidle" });
    await dismiss(p);
    const m = await p.evaluate((vw) => ({
      scrollW: document.documentElement.scrollWidth,
      vw: window.innerWidth,
      path: location.pathname,
    }), width);
    if (m.scrollW > m.vw + 0.5) {
      issues.push(`${width}px: ${route} overflow ${m.scrollW} > ${m.vw}`);
    }
    await p.close();
  }
}

for (const [from, to] of REDIRECTS) {
  const page = await browser.newPage();
  await page.goto(new URL(from, BASE).href, { waitUntil: "networkidle" });
  const finalPath = new URL(page.url()).pathname.replace(/\/$/, "") + "/";
  const expected = to.replace(/\/$/, "") + "/";
  if (finalPath !== expected) {
    issues.push(`redirect ${from} → got ${finalPath}, expected ${expected}`);
  }
  await page.close();
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 1280, height: 900 });
await zoom.goto(
  new URL("/standard-terms-and-conditions-of-engagement/", BASE).href,
  { waitUntil: "networkidle" },
);
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
  issues.push("1280@200% engagement: overflow");
}
await zoom.close();

await browser.close();
console.log(JSON.stringify({ pass: issues.length === 0, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
