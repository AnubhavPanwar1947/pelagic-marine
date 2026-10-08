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
  "Our team of experienced Naval Architects provides a full suite of plans and technical drawings essential throughout the lifecycle of a marine asset. All documentation is prepared in accordance with the requirements of the relevant flag state and tailored for approval by leading classification societies.";
const CLOSING =
  "Our goal is to support vessel compliance, safety, and operational efficiency from concept to completion.";
const LAST_BULLET = "Others as per client requirements";
const EXPECTED_BULLETS = [
  "General Arrangement (GA) Plans",
  "Structural Drawings",
  "Freeboard and Loadline Calculations & Plans",
  "Tonnage Calculations and Plans",
  "Tank Capacity Plans",
  "Docking Plans",
  "Outfitting and Piping Drawings",
  "Lines Plans",
  "Safety Manuals and Fire Control Plans",
  "Life-Saving Appliances (LSA) Plans",
  "Wheelhouse Visibility and Escape Route Plans",
  "Mooring and Towing Plans",
  "Wheelhouse Posters",
  LAST_BULLET,
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
  await page.goto(`${BASE}/services/ship-plans-drawings/`, { waitUntil: "networkidle" });
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
    const introStyle = intro ? getComputedStyle(intro) : null;
    const introW = intro ? intro.getBoundingClientRect().width : 0;
    const expectJustify = introW >= justifyMinPx - 1;
    const introAlignOk = intro
      ? expectJustify
        ? introStyle.textAlign === "justify"
        : introStyle.textAlign === "left" || introStyle.textAlign === "start"
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
      hasWeEnsure: main.includes("We ensure"),
      hasLightSound: main.includes("Light and Sound Signaling Plans"),
      othersCount: bullets.filter((b) => b === "Others as per client requirements").length,
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.introText !== INTRO) issues.push(`${w}px: intro mismatch`);
  if (data.closingText !== CLOSING) issues.push(`${w}px: closing changed`);
  if (JSON.stringify(data.bullets) !== JSON.stringify(EXPECTED_BULLETS)) {
    issues.push(`${w}px: bullet list mismatch`);
  }
  if (data.hasWeEnsure) issues.push(`${w}px: We ensure still present`);
  if (data.hasLightSound) issues.push(`${w}px: Light and Sound still present`);
  if (data.othersCount !== 1) issues.push(`${w}px: last bullet count ${data.othersCount}`);
  if (data.bullets.at(-1) !== LAST_BULLET) issues.push(`${w}px: wrong last bullet`);
  if (data.listJustified) issues.push(`${w}px: list justified`);
  if (!data.introAlignOk) issues.push(`${w}px: intro alignment`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/ship-plans-drawings/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const bullets = [...document.querySelectorAll(".service-topic-article ul.type-copy li")].map(
    (li) => li.textContent?.trim() ?? "",
  );
  return { width: "1280@200%zoom", last: bullets.at(-1) };
});
results.push(zoom);
if (zoom.last !== LAST_BULLET) issues.push("1280@200%: last bullet mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-shipplans-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
