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
  "When transporting cargo by sea, it is essential to secure it in a way that prevents any movement which could potentially damage the cargo or the vessel. Improperly secured cargo can shift during transit, posing serious risks to vessel stability and endangering both the crew and the cargo. This is especially critical when handling valuable assets such as machinery, equipment, fabricated structures, and marine components of varying sizes and complexities. Insurers often mandate that cargo is properly fastened to mitigate these risks. Our team of experienced engineers and naval architects prepares plans to facilitate loadout and sea fastening—optimized for safety, efficiency, and compliance with the requirements of clients, insurers, and all relevant stakeholders.";

const FIRST_FOUR =
  "When transporting cargo by sea, it is essential to secure it in a way that prevents any movement which could potentially damage the cargo or the vessel. Improperly secured cargo can shift during transit, posing serious risks to vessel stability and endangering both the crew and the cargo. This is especially critical when handling valuable assets such as machinery, equipment, fabricated structures, and marine components of varying sizes and complexities. Insurers often mandate that cargo is properly fastened to mitigate these risks.";

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
  await page.goto(`${BASE}/services/service-loadout/`, { waitUntil: "networkidle" });
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
      alignOk,
      textAlign: align,
      paragraphWidthPx: Math.round(wPx),
      hasOldStandards: text.includes("executed to the highest standards"),
      hasInFull: text.includes("in full compliance"),
      doubleSpace: /\s{2,}/.test(p?.textContent ?? ""),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.text !== PARA_EXACT) issues.push(`${w}px: paragraph mismatch`);
  if (!data.text.startsWith(FIRST_FOUR)) issues.push(`${w}px: first four sentences changed`);
  if (data.hasOldStandards) issues.push(`${w}px: old standards phrase present`);
  if (data.hasInFull) issues.push(`${w}px: in full compliance still present`);
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (!data.alignOk) issues.push(`${w}px: align ${data.textAlign}`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-loadout/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const p = document.querySelector(".service-topic-article p.type-copy");
  return {
    width: "1280@200%zoom",
    text: p?.textContent?.replace(/\s+/g, " ").trim() ?? "",
  };
});
results.push(zoom);
if (zoom.text !== PARA_EXACT) issues.push("1280@200%: paragraph mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-loadout-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ paragraph: PARA_EXACT, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
