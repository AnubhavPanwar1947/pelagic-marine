import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const paths = ["/services/optimoor/", "/services/orcaflex/"];
const baseUrl = process.env.BASE_URL || "http://localhost:3000/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const href of paths) {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(new URL(href.slice(1), baseUrl).href, {
      waitUntil: "networkidle",
    });
    const state = await page.evaluate(() => {
      const article = document.querySelector(".service-topic-article");
      const ps = article
        ? [...article.querySelectorAll("p.type-copy")]
        : [];
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const clipped = [...document.querySelectorAll("*")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1 || r.left < -1);
      });
      const back = article?.querySelector('a[href="/services/"]');
      return {
        paragraphCount: ps.length,
        overflowX: sw > vw + 0.5,
        clippedCount: clipped.length,
        backLink: Boolean(back),
        h1: document.querySelector("h1")?.textContent?.trim(),
      };
    });
    results.push({ href, width: w, ...state });
  }
}

await page.setViewportSize({ width: 1280, height: 900 });
for (const href of paths) {
  await page.goto(new URL(href.slice(1), baseUrl).href, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => {
    document.body.style.zoom = "200%";
  });
  await page.waitForTimeout(150);
  const state = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const ps = document.querySelectorAll(".service-topic-article p.type-copy");
    return {
      paragraphCount: ps.length,
      overflowX: sw > vw + 0.5,
    };
  });
  results.push({ href, width: "1280@200%zoom", ...state });
  await page.evaluate(() => {
    document.body.style.zoom = "";
  });
}

const failures = results.filter(
  (r) =>
    r.overflowX ||
    r.paragraphCount < 2 ||
    !r.backLink ||
    (typeof r.width === "number" && r.clippedCount > 8),
);

const out = {
  baseUrl,
  pass: failures.length === 0,
  failures,
  results,
};
const outPath = path.join(process.cwd(), "scripts", "optimoor-orcaflex-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ pass: out.pass, failures: out.failures, outPath }, null, 2));

await browser.close();
process.exit(out.pass ? 0 : 1);
