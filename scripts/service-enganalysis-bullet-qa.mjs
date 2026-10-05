import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const BULLET_EXACT =
  "In-place Analysis – for long-term structural performance under operational and environmental loads.";
const OTHER_BULLETS = [
  "Pre-service Analysis – Evaluating conditions during fabrication, transportation, and installation, including temporary load scenarios.",
  "Fatigue Analysis – Assessing fatigue life using industry-accepted methods to help extend asset lifespan and plan maintenance.",
  "Decommissioning Analysis – Supporting safe and efficient removal planning through structural assessments and procedural reviews.",
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
  await page.goto(`${BASE}/services/service-enganalysis/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const ul = document.querySelector(".service-topic-article ul.type-copy");
    const items = ul ? [...ul.querySelectorAll("li")].map((li) => li.textContent?.trim() ?? "") : [];
    const listStyle = ul ? getComputedStyle(ul) : null;
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      items,
      listTextAlign: listStyle?.textAlign ?? null,
      listJustified: listStyle?.textAlign === "justify",
    };
  });

  const row = { width: w, ...data };
  results.push(row);

  if (data.items[0] !== BULLET_EXACT) {
    issues.push(`${w}px: first bullet mismatch: "${data.items[0]?.slice(0, 50)}..."`);
  }
  if (data.items[0]?.includes("Ensuring")) issues.push(`${w}px: still contains Ensuring`);
  if ((data.items.join(" ").match(/In-place Analysis – for long-term/g) ?? []).length !== 1) {
    issues.push(`${w}px: required bullet not exactly once`);
  }
  for (let i = 0; i < OTHER_BULLETS.length; i++) {
    if (data.items[i + 1] !== OTHER_BULLETS[i]) {
      issues.push(`${w}px: bullet ${i + 2} changed`);
    }
  }
  if (data.listJustified) issues.push(`${w}px: bullet list justified`);
  if (/\s{2,}/.test(data.items[0] ?? "")) issues.push(`${w}px: double spaces in first bullet`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-enganalysis/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const ul = document.querySelector(".service-topic-article ul.type-copy");
  const first = ul?.querySelector("li")?.textContent?.trim() ?? "";
  return { width: "1280@200%zoom", first };
});
results.push(zoom);
if (zoom.first !== BULLET_EXACT) issues.push("1280@200%: first bullet mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-enganalysis-bullet-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ bullet: BULLET_EXACT, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
