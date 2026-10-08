import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const REMOVED = "register of representative assignments";
const START = "The breadth of vessels";
const EYEBROW = "TRACK RECORD";
const HEADING = "Proven across the fleet, port to port.";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];
const results = [];

for (const w of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 1200 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate(
    ({ removed, start, eyebrow, heading }) => {
      const section = document.querySelector(".home-track-record");
      const desc = document.querySelector(".home-track-record__description");
      const eyebrowEl = document.querySelector(".home-track-record__eyebrow");
      const titleEl = document.querySelector("#home-track-record-heading");
      const stats = document.querySelectorAll(".home-track-record__stat");
      const text = desc?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const descRect = desc?.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      return {
        text,
        removed: text.toLowerCase().includes(removed),
        startsOk: text.startsWith(start),
        eyebrow: eyebrowEl?.textContent?.trim() ?? "",
        heading: titleEl?.textContent?.replace(/\s+/g, " ").trim() ?? "",
        statCount: stats.length,
        descOverflow:
          descRect &&
          (descRect.right > vw + 0.5 || descRect.left < -0.5 || descRect.width > vw + 0.5),
        pageOverflow: scrollW > vw + 0.5,
      };
    },
    { removed: REMOVED, start: START, eyebrow: EYEBROW, heading: HEADING },
  );

  results.push({ width: w, ...data });
  if (data.removed) issues.push(`${w}px: removed phrase still present`);
  if (!data.startsOk) issues.push(`${w}px: description does not start with expected sentence`);
  if (data.eyebrow !== EYEBROW) issues.push(`${w}px: eyebrow changed (${data.eyebrow})`);
  if (data.heading !== HEADING) issues.push(`${w}px: heading changed`);
  if (data.statCount < 4) issues.push(`${w}px: stats missing (${data.statCount})`);
  if (data.descOverflow) issues.push(`${w}px: track description overflows`);
  if (data.pageOverflow) issues.push(`${w}px: page horizontal overflow`);

  await page.close();
}

const zoomPage = await browser.newPage();
await zoomPage.setViewportSize({ width: 640, height: 1200 });
await zoomPage.goto(`${BASE}/`, { waitUntil: "networkidle" });
await dismiss(zoomPage);
const zoom = await zoomPage.evaluate(({ removed, start }) => {
  const text =
    document.querySelector(".home-track-record__description")?.textContent?.replace(/\s+/g, " ").trim() ??
    "";
  return {
    label: "1280@200%zoom",
    removed: text.toLowerCase().includes(removed),
    startsOk: text.startsWith(start),
    pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 0.5,
  };
}, { removed: REMOVED, start: START });
results.push(zoom);
if (zoom.removed) issues.push("1280@200%: removed phrase present");
if (!zoom.startsOk) issues.push("1280@200%: description start wrong");
if (zoom.pageOverflow) issues.push("1280@200%: page overflow");
await zoomPage.close();

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "home-track-record-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exit(1);
}
console.log("All checks passed.");
