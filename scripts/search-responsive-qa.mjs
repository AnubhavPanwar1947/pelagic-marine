import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3456/";
const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];
const routes = [
  "/search/",
  "/team/",
  "/search/?q=Team",
  "/search/?q=Nishchay",
  "/search/?q=Bhanu",
  "/search/?q=Master%20Mariners",
  "/search/?q=naval%20architects",
  "/search/?q=%22Work%20with%20the%20people%22",
  "/search/?q=Optimoor",
];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(new URL(route, BASE).href, { waitUntil: "networkidle" });
    await dismiss(page);

    const metrics = await page.evaluate((vw) => {
      const docScroll = document.documentElement.scrollWidth;
      const bodyScroll = document.body.scrollWidth;
      const outside = [];
      for (const el of document.querySelectorAll("header *, .site-search-page *, footer *")) {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) continue;
        if (rect.left < -1 || rect.right > vw + 1) {
          const cls =
            typeof el.className === "string" ? el.className.split(/\s+/).slice(0, 2).join(".") : "";
          if (cls.includes("sr-only")) continue;
          outside.push({ tag: el.tagName, cls, left: Math.round(rect.left), right: Math.round(rect.right) });
          if (outside.length >= 5) break;
        }
      }
      return { docScroll, bodyScroll, vw: window.innerWidth, outside };
    }, width);

    if (metrics.docScroll > metrics.vw + 0.5) {
      issues.push(`${route} ${width}px: document scrollWidth ${metrics.docScroll} > ${metrics.vw}`);
    }
    if (metrics.bodyScroll > metrics.vw + 0.5) {
      issues.push(`${route} ${width}px: body scrollWidth ${metrics.bodyScroll} > ${metrics.vw}`);
    }
    if (metrics.outside.length) {
      issues.push(
        `${route} ${width}px: clipped elements ${JSON.stringify(metrics.outside)}`,
      );
    }

    await page.close();
  }
}

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "search-responsive-qa-out.json");
const result = { base: BASE, issues, pass: issues.length === 0 };
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
process.exit(issues.length ? 1 : 0);
