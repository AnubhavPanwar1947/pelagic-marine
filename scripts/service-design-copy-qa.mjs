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
  "We work on every project to meet technical, operational, and regulatory requirements—on time and with precision.";
const ENGINEERING_SUMMARY =
  "The applied engineering knowledge that keeps assets competitive in ever-evolving market conditions.";

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
  await page.goto(`${BASE}/services/service-design/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const main = document.querySelector("main");
    const text = main?.innerText ?? "";
    const copies = [...document.querySelectorAll(".service-topic-article p.type-copy")];
    const closing = copies[copies.length - 1];
    const closingText = closing?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const style = closing ? getComputedStyle(closing) : null;
    const wPx = closing ? closing.getBoundingClientRect().width : 0;
    const expectJustify = wPx >= justifyMinPx - 1;
    const align = style?.textAlign ?? null;
    const alignOk = closing
      ? expectJustify
        ? align === "justify"
        : align === "left" || align === "start"
      : false;
    const count = (text.match(/We work on every project to meet technical/g) ?? []).length;
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      closingText,
      sentenceCount: count,
      hasEngineeringSummary: text.includes(
        "The applied engineering knowledge that keeps assets competitive in ever-evolving market conditions.",
      ),
      alignOk,
      textAlign: align,
      paragraphWidthPx: Math.round(wPx),
      doubleSpace: /\s{2,}/.test(closing?.textContent ?? ""),
    };
  }, JUSTIFY_MIN_PX);

  const row = { width: w, ...data };
  results.push(row);

  if (!data.closingText.includes(REQUIRED)) {
    issues.push(`${w}px: required sentence missing from closing`);
  }
  if (data.sentenceCount !== 1) {
    issues.push(`${w}px: sentence appears ${data.sentenceCount} times (expected 1)`);
  }
  if (data.hasEngineeringSummary) {
    issues.push(`${w}px: engineering category summary incorrectly on page`);
  }
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (!data.alignOk) issues.push(`${w}px: closing align ${data.textAlign}`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-design/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const main = document.querySelector("main")?.innerText ?? "";
  return {
    width: "1280@200%zoom",
    sentenceCount: (main.match(/We work on every project to meet technical/g) ?? []).length,
  };
});
results.push(zoom);
if (zoom.sentenceCount !== 1) issues.push("1280@200%: sentence count not 1");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-design-copy-qa-out.json");
fs.writeFileSync(
  outPath,
  JSON.stringify({ required: REQUIRED, excluded: ENGINEERING_SUMMARY, issues, results }, null, 2),
);
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
