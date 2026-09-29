import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const outDir = path.join(process.cwd(), "scripts", "footer-logo-screenshots");
fs.mkdirSync(outDir, { recursive: true });

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

function footerMeasure(page) {
  return page.evaluate(() => {
    const brand = document.querySelector(".site-footer-brand");
    const hero = brand?.getBoundingClientRect();
    const full = document.querySelector(".site-footer-brand .brand-logo-full-svg");
    const fullImg = document.querySelector(".site-footer-brand .brand-logo-full-svg img");
    const circle = document.querySelector(
      ".site-footer-brand .brand-logo-anchor-slot--footer-fallback",
    );
    const wordmark = document.querySelector(
      ".site-footer-brand .brand-logo-wordmark-group",
    );
    const headerFull = document.querySelector(
      "header.site-header .brand-logo-full-svg",
    );
    const headerImg = document.querySelector(
      "header.site-header .brand-logo-full-svg img",
    );
    const footerImg = fullImg;
    const footerFilter = footerImg ? getComputedStyle(footerImg).filter : "";
    const headerFilter = headerImg ? getComputedStyle(headerImg).filter : "none";
    const promo = document.querySelector(".brand-logo-lockup--promo");
    const csFull = full ? getComputedStyle(full) : null;
    const csCircle = circle ? getComputedStyle(circle) : null;
    const csWm = wordmark ? getComputedStyle(wordmark) : null;
    const ir = fullImg?.getBoundingClientRect();
    const ink =
      ir && csFull?.display !== "none" && ir.height > 0
        ? ir.left + ir.height * (9 / 45)
        : circle && csCircle?.display !== "none"
          ? circle.getBoundingClientRect().left
          : null;
    const col = brand?.closest(".max-w-7xl")?.getBoundingClientRect();
    return {
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 0.5,
      colLeft: col?.left ?? null,
      inkLeft: ink,
      fullDisplay: csFull?.display ?? null,
      circleDisplay: csCircle?.display ?? null,
      wordmarkDisplay: csWm?.display ?? null,
      headerFullDisplay: headerFull ? getComputedStyle(headerFull).display : null,
      promoPresent: !!promo,
      footerLogoCount: document.querySelectorAll(
        ".site-footer-brand .brand-logo-full-svg img, .site-footer-brand .brand-logo-anchor-slot--footer-fallback img",
      ).length,
      footerFilter,
      headerFilter,
      footerLooksPureWhite: (() => {
        if (!footerImg || csFull?.display === "none" || ir.height < 2) return false;
        const c = document.createElement("canvas");
        const w = Math.min(40, ir.width);
        const h = Math.min(20, ir.height);
        if (w < 2 || h < 2) return false;
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        if (!ctx) return false;
        try {
          ctx.drawImage(footerImg, 0, 0, w, h);
          const d = ctx.getImageData(0, 0, w, h).data;
          let bright = 0;
          let n = 0;
          for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] < 32) continue;
            const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
            bright += lum;
            n++;
          }
          if (!n) return false;
          return bright / n > 248;
        } catch {
          return false;
        }
      })(),
    };
  });
}

const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];
const shots = [320, 768, 1024, 1440, 1920, 3258];

const browser = await chromium.launch({ headless: true });
const issues = [];
const rows = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismiss(page);
  await page.evaluate(() =>
    document.querySelector("footer")?.scrollIntoView({ block: "start" }),
  );
  const wordmark = await page.$(".site-footer-brand .brand-logo-wordmark-group");
  const r = await footerMeasure(page);
  const delta =
    r.colLeft != null && r.inkLeft != null
      ? Math.round((r.inkLeft - r.colLeft) * 10) / 10
      : null;
  rows.push({ w, ...r, delta });
  if (r.docOverflow) issues.push(`${w}px: document overflow`);
  if (w >= 280 && r.fullDisplay === "none")
    issues.push(`${w}px: footer SVG hidden`);
  if (w < 280 && r.circleDisplay === "none")
    issues.push(`${w}px: footer circle hidden`);
  if (w >= 280 && wordmark && r.wordmarkDisplay !== "none")
    issues.push(`${w}px: footer wordmark visible`);
  if (w >= 280 && r.footerFilter && r.footerFilter !== "none" && r.footerFilter !== r.headerFilter)
    issues.push(`${w}px: footer filter differs from header (${r.footerFilter})`);
  if (w >= 280 && r.footerLooksPureWhite)
    issues.push(`${w}px: footer logo reads pure white`);
  if (w >= 280 && r.circleDisplay !== "none" && csVisible(r))
    issues.push(`${w}px: dual footer logos`);
  if (w >= 280 && delta != null && Math.abs(delta) > 4)
    issues.push(`${w}px: ink vs column left delta ${delta}px`);
  if (shots.includes(w)) {
    await page.screenshot({
      path: path.join(outDir, `footer-${w}.png`),
      fullPage: false,
    });
  }
  await page.close();
}

function csVisible(r) {
  return r.circleDisplay !== "none" && r.circleDisplay !== undefined;
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 240, height: 450 });
await zoom.goto(BASE, { waitUntil: "networkidle" });
await dismiss(zoom);
await zoom.evaluate(() =>
  document.querySelector("footer")?.scrollIntoView({ block: "start" }),
);
const zr = await footerMeasure(zoom);
await zoom.screenshot({
  path: path.join(outDir, "footer-200pct-zoom.png"),
  fullPage: false,
});
if (zr.docOverflow) issues.push("240px (200% narrow): overflow");
if (zr.fullDisplay !== "none") issues.push("240px: expected circle only");
await zoom.close();

await browser.close();
const report = { rows, issues, outDir };
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "footer-logo-qa-out.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
if (issues.length) {
  console.error("ISSUES:", issues);
  process.exit(1);
}
