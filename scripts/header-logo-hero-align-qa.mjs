import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const outDir = path.join(process.cwd(), "scripts", "header-logo-align-screenshots");
fs.mkdirSync(outDir, { recursive: true });

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

function measure(page) {
  return page.evaluate(() => {
    const hero = document.querySelector(".home-hero-brand-name");
    const fullImg = document.querySelector(
      "header.site-header .brand-logo-full-svg img",
    );
    const fullSvg = document.querySelector(
      "header.site-header .brand-logo-full-svg",
    );
    const circle = document.querySelector(
      "header.site-header .brand-logo-anchor-slot--header-fallback",
    );
    const headerLogos = document.querySelectorAll(
      'header.site-header a.brand-logo-home-link img, header.site-header a.brand-logo-home-link .brand-logo-circle',
    );
    const heroR = hero?.getBoundingClientRect();
    const imgR = fullImg?.getBoundingClientRect();
    const csFull = fullSvg ? getComputedStyle(fullSvg) : null;
    const csCircle = circle ? getComputedStyle(circle) : null;
    const circleR = circle?.getBoundingClientRect();
    const visibleInkLeft = () => {
      if (fullImg && csFull?.display !== "none" && imgR) {
        return imgR.left + imgR.height * (9 / 45);
      }
      if (circle && csCircle?.display !== "none") return circleR?.left ?? null;
      return imgR?.left ?? circleR?.left ?? null;
    };
    return {
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 0.5,
      heroLeft: heroR?.left ?? null,
      logoInkLeft: visibleInkLeft(),
      fullDisplay: csFull?.display ?? null,
      circleDisplay: csCircle?.display ?? null,
      headerLogoImgCount: document.querySelectorAll(
        "header.site-header .brand-logo-full-svg img",
      ).length,
      dualVisible:
        csFull?.display !== "none" &&
        csCircle?.display !== "none" &&
        csFull?.display !== undefined,
    };
  });
}

const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024,
  1280, 1440, 1920, 2560, 3258,
];
const screenshotWidths = [320, 768, 1024, 1440, 1920, 2560, 3258];

const browser = await chromium.launch({ headless: true });
const issues = [];
const rows = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismiss(page);
  const r = await measure(page);
  const delta =
    r.heroLeft != null && r.logoInkLeft != null
      ? Math.round((r.logoInkLeft - r.heroLeft) * 10) / 10
      : null;
  rows.push({ w, ...r, delta });
  if (r.docOverflow) issues.push(`${w}px: horizontal document overflow`);
  if (r.dualVisible) issues.push(`${w}px: both full SVG and circle visible`);
  if (w > 280 && r.fullDisplay === "none")
    issues.push(`${w}px: full SVG hidden above 280`);
  if (w === 280 && r.fullDisplay === "none" && r.circleDisplay === "none")
    issues.push(`${w}px: no logo visible at 280 breakpoint edge`);
  if (w < 280 && r.circleDisplay === "none")
    issues.push(`${w}px: circle hidden below 280`);
  if (w >= 280 && delta != null && Math.abs(delta) > 2)
    issues.push(`${w}px: logo vs hero left delta ${delta}px`);
  if (screenshotWidths.includes(w)) {
    await page.screenshot({
      path: path.join(outDir, `home-${w}.png`),
      fullPage: false,
    });
  }
  await page.close();
}

const zoomPage = await browser.newPage();
await zoomPage.setViewportSize({ width: 640, height: 450 });
await zoomPage.goto(BASE, { waitUntil: "networkidle" });
await dismiss(zoomPage);
const zr = await measure(zoomPage);
await zoomPage.screenshot({
  path: path.join(outDir, "home-200pct-zoom.png"),
  fullPage: false,
});
if (zr.docOverflow) issues.push("200% zoom layout (640px): document overflow");
if (zr.fullDisplay !== "none")
  issues.push("200% zoom layout (640px): expected circular mark");
await zoomPage.close();

await browser.close();

const report = { rows, issues, screenshotsDir: outDir };
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "header-logo-align-qa-out.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
if (issues.length) {
  console.error("ISSUES:", issues);
  process.exit(1);
}
