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
  "Marine environments are constantly changing—and so is vessel performance. Our expert team of naval architects and hydrodynamic engineers utilizes cutting-edge simulation tools and industry-leading software to predict how marine assets will perform in real-world sea and weather conditions. From seakeeping and RAO calculations to resistance, motion response, multi-body dynamics, sloshing analysis, and propeller performance assessment—we provide end-to-end hydrodynamic solutions. Whether it’s during the design phase or in operational optimization, we help you enhance safety, efficiency, and reliability at sea.";

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
  await page.goto(`${BASE}/services/hydrodynamic-calculations/`, { waitUntil: "networkidle" });
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
      hasAccurately: text.includes("accurately"),
      alignOk,
      textAlign: align,
      paragraphWidthPx: Math.round(wPx),
      doubleSpace: /\s{2,}/.test(p?.textContent ?? ""),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.text !== PARA_EXACT) issues.push(`${w}px: paragraph mismatch`);
  if (data.hasAccurately) issues.push(`${w}px: accurately still present`);
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (!data.alignOk) issues.push(`${w}px: align ${data.textAlign}`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/hydrodynamic-calculations/`, { waitUntil: "networkidle" });
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

const outPath = path.join(process.cwd(), "scripts", "service-hydro-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ paragraph: PARA_EXACT, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
