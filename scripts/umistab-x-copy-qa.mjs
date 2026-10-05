import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const PARA_EXACT =
  "UMISTAB-X is a loading software for bulk-carrier loading, stability, and longitudinal-strength assessment. It manages cargo, ballast, fuel, freshwater, stores, grain, dry bulk, deck icing, tanks, and other weights. The software calculates displacement, drafts, trim, hydrostatics, stability criteria, shear forces, and bending moments for intact and damage conditions. Users review GZ curves, validation results, visibility, draft surveys, load-line settings, and PDF reports. It supports amendments to the Grain Code in accordance with MSC.552(101) and also includes an optional module for deck-loading calculations.";

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
  await page.goto(`${BASE}/services/umistab-x/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const p = document.querySelector(".service-topic-article p.type-copy");
    const text = p?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const style = p ? getComputedStyle(p) : null;
    const wPx = p ? p.getBoundingClientRect().width : 0;
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
      text,
      hasOnboard: text.includes("an onboard system"),
      hasDoubleIs: text.includes("is is a loading software"),
      alignOk,
      doubleSpace: /\s{2,}/.test(p?.textContent ?? ""),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.text !== PARA_EXACT) issues.push(`${w}px: paragraph mismatch`);
  if (data.hasOnboard) issues.push(`${w}px: an onboard system still present`);
  if (data.hasDoubleIs) issues.push(`${w}px: double is phrase`);
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (!data.alignOk) issues.push(`${w}px: alignment`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/umistab-x/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => ({
  width: "1280@200%zoom",
  text:
    document
      .querySelector(".service-topic-article p.type-copy")
      ?.textContent?.replace(/\s+/g, " ")
      .trim() ?? "",
}));
results.push(zoom);
if (zoom.text !== PARA_EXACT) issues.push("1280@200%: paragraph mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "umistab-x-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ paragraph: PARA_EXACT, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
