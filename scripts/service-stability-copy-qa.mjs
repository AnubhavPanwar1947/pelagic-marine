import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const INTRO =
  "At Pelagic Marine, we provide comprehensive stability calculations tailored to the needs of our offshore and main fleet clients. Our services encompass a wide range of stability-related tasks for the safe and efficient operation of vessels.";
const FIRST_BULLET = "Loading Calculations: For weight distribution during loading.";
const OTHER_BULLETS = [
  "Weight Estimation: Determining the weight of cargo and vessel components to assess stability.",
  "Inclining Experiment: Performing inclining tests to verify the vessel’s stability characteristics.",
  "Hydrostatic Particulars: Providing detailed hydrostatic data, essential for operational safety.",
  "Intact and Damage Stability Calculations: Analyzing the vessel’s stability under intact and damage conditions to ensure compliance with international regulations.",
  "Loading Plan Development: Creating loading plans based on detailed stability analysis.",
];
const CLOSING =
  "We are committed to delivering precise, reliable, and efficient stability solutions, supporting vessel safety and operational performance.";

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
  await page.goto(`${BASE}/services/service-stability/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const intro = document.querySelector(".service-topic-article p.type-copy");
    const introText = intro?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const ul = document.querySelector(".service-topic-article ul.type-copy");
    const bullets = ul ? [...ul.querySelectorAll("li")].map((li) => li.textContent?.trim() ?? "") : [];
    const closing = [...document.querySelectorAll(".service-topic-article p.type-copy")].pop();
    const closingText = closing?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const listAlign = ul ? getComputedStyle(ul).textAlign : null;
    const style = intro ? getComputedStyle(intro) : null;
    const wPx = intro ? intro.getBoundingClientRect().width : 0;
    const expectJustify = wPx >= justifyMinPx - 1;
    const introAlignOk = intro
      ? expectJustify
        ? style.textAlign === "justify"
        : style.textAlign === "left" || style.textAlign === "start"
      : false;
    const main = document.querySelector("main")?.innerText ?? "";
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      introText,
      bullets,
      closingText,
      listJustified: listAlign === "justify",
      introAlignOk,
      hasEnsuring: main.includes("ensuring the safe"),
      hasAccurate: main.includes("Accurate calculations to ensure proper"),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.introText !== INTRO) issues.push(`${w}px: intro mismatch`);
  if (data.bullets[0] !== FIRST_BULLET) issues.push(`${w}px: first bullet mismatch`);
  for (let i = 0; i < OTHER_BULLETS.length; i++) {
    if (data.bullets[i + 1] !== OTHER_BULLETS[i]) issues.push(`${w}px: bullet ${i + 2} changed`);
  }
  if (data.closingText !== CLOSING) issues.push(`${w}px: closing changed`);
  if (data.hasEnsuring) issues.push(`${w}px: ensuring the safe still present`);
  if (data.hasAccurate) issues.push(`${w}px: Accurate calculations phrase still present`);
  if (data.listJustified) issues.push(`${w}px: list justified`);
  if (!data.introAlignOk) issues.push(`${w}px: intro alignment`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-stability/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const intro = document.querySelector(".service-topic-article p.type-copy");
  const first = document.querySelector(".service-topic-article ul.type-copy li");
  return {
    width: "1280@200%zoom",
    intro: intro?.textContent?.replace(/\s+/g, " ").trim() ?? "",
    firstBullet: first?.textContent?.trim() ?? "",
  };
});
results.push(zoom);
if (zoom.intro !== INTRO || zoom.firstBullet !== FIRST_BULLET) {
  issues.push("1280@200%: copy mismatch");
}

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-stability-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
