import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const REQUIRED =
  "Pelagic marine was formed in year 2021 by young entrepreneurs from the shipping and engineering fraternity with wide range of experience in vessel operations, ship surveying, Engineering, offshore operations, dry & wet cargo handling. The company was formed to act as a one stop shop for various shipping industry centric solution. The core team consists of experienced Master Mariners. We provide professional services to our clients from mainline shipping, oil & gas industry, offshore industry and renewable energy sector.";

const REMOVED = ["consultants and surveyors", "Marine engineers, naval architects"];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const issues = [];
const results = [];

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}/about/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const h1 = document.querySelector("h1");
    const p = document.querySelector(".about-theme-hero p.type-lead");
    const img = document.querySelector(".about-theme-hero__media img, .about-theme-hero__media picture");
    const style = p ? getComputedStyle(p) : null;
    const wPx = p ? p.getBoundingClientRect().width : 0;
    const text = p?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const expectJustify = wPx >= justifyMinPx - 1;
    const align = style?.textAlign ?? null;
    const alignOk = p
      ? expectJustify
        ? align === "justify"
        : align === "left" || align === "start"
      : false;
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      h1: h1?.textContent?.trim() ?? "",
      hasImage: Boolean(img),
      text,
      doubleSpace: /\s{2,}/.test(p?.textContent ?? ""),
      textAlign: align,
      paragraphWidthPx: Math.round(wPx),
      alignOk,
    };
  }, JUSTIFY_MIN_PX);

  const normalizedRequired = REQUIRED.replace(/\s+/g, " ").trim();
  const textExact = data.text === normalizedRequired;
  const row = { width: w, ...data, textExact };
  results.push(row);

  if (!textExact) issues.push(`${w}px: paragraph text mismatch`);
  for (const phrase of REMOVED) {
    if (data.text.includes(phrase)) issues.push(`${w}px: still contains "${phrase}"`);
  }
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (data.h1 !== "About Us") issues.push(`${w}px: heading changed`);
  if (!data.hasImage) issues.push(`${w}px: hero image missing`);
  if (!data.alignOk) issues.push(`${w}px: alignment ${data.textAlign} (width ${data.paragraphWidthPx}px)`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/about/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate((justifyMinPx) => {
  const p = document.querySelector(".about-theme-hero p.type-lead");
  const style = p ? getComputedStyle(p) : null;
  const wPx = p ? p.getBoundingClientRect().width : 0;
  const expectJustify = wPx >= justifyMinPx - 1;
  const align = style?.textAlign ?? null;
  return {
    label: "1280@200%zoom",
    paragraphWidthPx: Math.round(wPx),
    textAlign: align,
    alignOk: p
      ? expectJustify
        ? align === "justify"
        : align === "left" || align === "start"
      : false,
  };
}, JUSTIFY_MIN_PX);
results.push(zoom);
if (!zoom.alignOk) issues.push(`1280@200%: alignment ${zoom.textAlign}`);

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "about-hero-paragraph-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ required: REQUIRED, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
