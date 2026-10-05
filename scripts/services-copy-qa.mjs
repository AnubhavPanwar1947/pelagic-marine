import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const HERO_EXACT =
  "Concept design, structural analysis, surveys, audits, mooring studies and cargo planning — the same engineering rigour, whichever practice you need.";
const ENGINEERING_EXACT =
  "The applied engineering knowledge that keeps assets competitive in ever-evolving market conditions.";
const INSPECTION_EXACT =
  "Surveys, audits and risk assessments performed by experienced and qualified hands.";

const EXCLUDED = [
  "loading tools",
  "The applied engineering that keeps assets designed, converted and operating safely.",
  "people who have sailed",
  "Surveys, audits and risk work carried out by people who have sailed.",
];

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
  await page.goto(`${BASE}/services/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const hero = document.querySelector(".services-page .type-lead");
    const eng = document.querySelector("#engineering .type-copy");
    const insp = document.querySelector("#inspection-audits-surveying .type-copy");
    const h1 = document.querySelector(".services-page h1");
    const h1Align = h1 ? getComputedStyle(h1).textAlign : null;

    const norm = (el) => el?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const heroText = norm(hero);
    const engText = norm(eng);
    const inspText = norm(insp);

    const checkAlign = (el) => {
      if (!el) return { alignOk: false, textAlign: null, width: 0 };
      const style = getComputedStyle(el);
      const width = el.getBoundingClientRect().width;
      const expectJustify = width >= justifyMinPx - 1;
      const align = style.textAlign;
      const alignOk = expectJustify
        ? align === "justify"
        : align === "left" || align === "start";
      return { alignOk, textAlign: align, width: Math.round(width) };
    };

    const heroAlign = checkAlign(hero);
    const engAlign = checkAlign(eng);
    const inspAlign = checkAlign(insp);

    const mainText = document.querySelector("main")?.innerText ?? "";

    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      heroText,
      engText,
      inspText,
      heroAlign,
      engAlign,
      inspAlign,
      headingJustified: h1Align === "justify",
      doubleSpace:
        /\s{2,}/.test(hero?.textContent ?? "") ||
        /\s{2,}/.test(eng?.textContent ?? "") ||
        /\s{2,}/.test(insp?.textContent ?? ""),
      mainText,
      heroHasBr: Boolean(hero?.querySelector("br")),
    };
  }, JUSTIFY_MIN_PX);

  const row = { width: w, ...data };
  results.push(row);

  if (data.heroText !== HERO_EXACT) issues.push(`${w}px: hero text mismatch`);
  if (data.engText !== ENGINEERING_EXACT) issues.push(`${w}px: engineering summary mismatch`);
  if (data.inspText !== INSPECTION_EXACT) issues.push(`${w}px: inspection summary mismatch`);
  for (const phrase of EXCLUDED) {
    if (data.mainText.includes(phrase)) issues.push(`${w}px: excluded phrase "${phrase}"`);
  }
  if (data.heroHasBr) issues.push(`${w}px: forced line break in hero`);
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (!data.heroAlign.alignOk) {
    issues.push(`${w}px: hero align ${data.heroAlign.textAlign} (${data.heroAlign.width}px)`);
  }
  if (!data.engAlign.alignOk) {
    issues.push(`${w}px: engineering align ${data.engAlign.textAlign}`);
  }
  if (!data.inspAlign.alignOk) {
    issues.push(`${w}px: inspection align ${data.inspAlign.textAlign}`);
  }
  if (data.headingJustified) issues.push(`${w}px: heading justified`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const hero = document.querySelector(".services-page .type-lead");
  return {
    width: "1280@200%zoom",
    heroText: hero?.textContent?.replace(/\s+/g, " ").trim() ?? "",
  };
});
results.push(zoom);
if (zoom.heroText !== HERO_EXACT) issues.push("1280@200%: hero text mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "services-copy-qa-out.json");
fs.writeFileSync(
  outPath,
  JSON.stringify({ hero: HERO_EXACT, engineering: ENGINEERING_EXACT, inspection: INSPECTION_EXACT, issues, results }, null, 2),
);
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.slice(0, 40).join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
