import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const widths = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const screenshotWidths = [50, 120, 279, 289, 290, 320, 768, 1280, 2560];
const outDir = path.join(
  os.tmpdir(),
  `pelagic-footer-anchor-logo-qa-${Date.now()}`,
);

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

async function scrollFooter(page) {
  await page.evaluate(() =>
    document.querySelector("footer")?.scrollIntoView({ block: "end" }),
  );
  await page.waitForTimeout(150);
}

function probe(page) {
  return page.evaluate(() => {
    const brand = document.querySelector(".site-footer-brand");
    const link = brand?.querySelector(".brand-logo-footer-link");
    const full = brand?.querySelector(".brand-logo-full-svg");
    const narrow = brand?.querySelector(".brand-logo-footer-narrow-svg");
    const circle = brand?.querySelector(".brand-logo-anchor-slot--footer-fallback");
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const visible = (el) => {
      if (!el) return false;
      const s = cs(el);
      if (!s || s.display === "none" || s.visibility === "hidden") return false;
      const r = el.getBoundingClientRect();
      return r.width > 0.5 && r.height > 0.5;
    };
    const imgSrc = (wrap) => {
      const img = wrap?.querySelector("img");
      return img?.getAttribute("src") ?? img?.currentSrc ?? null;
    };
    const logoBox = () => {
      let pick = null;
      if (visible(narrow)) pick = narrow;
      else if (visible(full)) pick = full;
      else if (visible(circle)) pick = circle;
      const r = pick?.getBoundingClientRect();
      return r ? { w: r.width, h: r.height } : null;
    };
    const logoCount =
      (visible(narrow) ? 1 : 0) + (visible(full) ? 1 : 0) + (visible(circle) ? 1 : 0);
    return {
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      aria: link?.getAttribute("aria-label") ?? null,
      fullVisible: visible(full),
      narrowVisible: visible(narrow),
      circleVisible: visible(circle),
      logoCount,
      narrowSrc: imgSrc(narrow),
      fullSrc: imgSrc(full),
      box: logoBox(),
    };
  });
}

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const issues = [];
const rows = [];

async function runViewport(page, width, height, label) {
  await page.setViewportSize({ width, height });
  await page.goto(new URL("/", BASE).href, { waitUntil: "networkidle" });
  await dismiss(page);
  await scrollFooter(page);
  await page.waitForFunction(
    () => {
      const brand = document.querySelector(".site-footer-brand");
      const full = brand?.querySelector(".brand-logo-full-svg");
      const narrow = brand?.querySelector(".brand-logo-footer-narrow-svg");
      const vw = document.documentElement.clientWidth;
      const pick = vw <= 289.99 ? narrow : full;
      const img = pick?.querySelector("img");
      return img && img.complete && img.naturalWidth > 0;
    },
    { timeout: 8000 },
  );
  const m = await probe(page);
  const tag = `${label} ${width}×${height}`;
  rows.push({ tag, ...m });

  if (m.scrollW > m.vw + 1) issues.push(`${tag}: horizontal overflow`);
  if (m.aria !== "Pelagic Marine — home") issues.push(`${tag}: aria-label`);
  if (!m.box) issues.push(`${tag}: no measurable footer logo`);
  if (m.logoCount !== 1) {
    issues.push(`${tag}: expected exactly 1 footer logo, saw ${m.logoCount}`);
  }

  const narrowBp = m.vw <= 289.99;
  if (narrowBp) {
    if (!m.narrowVisible) issues.push(`${tag}: expected footer anchor-logo visible`);
    if (m.fullVisible) issues.push(`${tag}: full footer logo should be hidden`);
    if (m.circleVisible) issues.push(`${tag}: circle fallback should be hidden`);
    if (!m.narrowSrc?.includes("anchor-logo")) {
      issues.push(`${tag}: expected anchor-logo.svg src`);
    }
  } else {
    if (!m.fullVisible) issues.push(`${tag}: expected full footer logo visible`);
    if (m.narrowVisible) issues.push(`${tag}: narrow footer logo should be hidden`);
    if (m.circleVisible) issues.push(`${tag}: circle fallback should be hidden`);
    if (!m.fullSrc?.includes("white-logo")) {
      issues.push(`${tag}: expected footer white-logo.svg`);
    }
  }

  if (screenshotWidths.includes(width) && height === 900) {
    const file = path.join(outDir, `footer-${width}px.png`);
    await page.screenshot({ path: file, fullPage: false });
  }
}

for (const w of widths) {
  const page = await browser.newPage();
  await runViewport(page, w, 900, "footer");
  await page.close();
}

{
  const page = await browser.newPage();
  await runViewport(page, 1280, 900, "footer-200pct-zoom");
  await page.evaluate(() => {
    document.documentElement.style.zoom = "200%";
  });
  await scrollFooter(page);
  const m = await probe(page);
  const tag = "footer 1280×900 @200% zoom";
  rows.push({ tag, ...m });
  if (!m.fullVisible) issues.push(`${tag}: expected full footer logo at 200% zoom`);
  await page.screenshot({
    path: path.join(outDir, "footer-1280-200pct-zoom.png"),
    fullPage: false,
  });
  await page.close();
}

await browser.close();

const report = { base: BASE, outDir, issues, rows };
const reportPath = path.join(outDir, "report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ outDir, reportPath, issueCount: issues.length, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
