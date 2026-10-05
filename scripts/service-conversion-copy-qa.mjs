import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const SUBHEADING = "Lifecycle Engineering & Asset Upgrades";
const PARA_EXACT =
  "To stay ahead in today’s fast-evolving industry, it is essential to upgrade assets using the latest design solutions, technologies, and equipment. Our team of seasoned experts delivers comprehensive engineering solutions throughout the entire lifecycle of your assets. From concept to completion, we support your most ambitious conversion and upgrade projects across the offshore, marine, and renewable energy sectors—boosting performance, reliability, and efficiency every step of the way.";
const OLD_FIRST =
  "upgrading assets with the latest technologies and equipment is essential";

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
  await page.goto(`${BASE}/services/service-conversion/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const sub = document.querySelector(".service-topic-article p.type-copy.font-semibold");
    const body = document.querySelector(
      ".service-topic-article p.type-copy:not(.font-semibold)",
    );
    const subText = sub?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const bodyText = body?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const style = body ? getComputedStyle(body) : null;
    const wPx = body ? body.getBoundingClientRect().width : 0;
    const expectJustify = wPx >= justifyMinPx - 1;
    const align = style?.textAlign ?? null;
    const alignOk = body
      ? expectJustify
        ? align === "justify"
        : align === "left" || align === "start"
      : false;
    const main = document.querySelector("main")?.innerText ?? "";
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      subText,
      bodyText,
      alignOk,
      textAlign: align,
      paragraphWidthPx: Math.round(wPx),
      hasOldFirst: main.includes("upgrading assets with the latest technologies and equipment is essential"),
      doubleSpace: /\s{2,}/.test(body?.textContent ?? ""),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.subText !== SUBHEADING) issues.push(`${w}px: subheading changed`);
  if (data.bodyText !== PARA_EXACT) issues.push(`${w}px: paragraph mismatch`);
  if (data.hasOldFirst) issues.push(`${w}px: old first sentence still present`);
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (!data.alignOk) issues.push(`${w}px: align ${data.textAlign} at ${data.paragraphWidthPx}px`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-conversion/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const body = document.querySelector(
    ".service-topic-article p.type-copy:not(.font-semibold)",
  );
  return {
    width: "1280@200%zoom",
    bodyText: body?.textContent?.replace(/\s+/g, " ").trim() ?? "",
  };
});
results.push(zoom);
if (zoom.bodyText !== PARA_EXACT) issues.push("1280@200%: paragraph mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-conversion-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ paragraph: PARA_EXACT, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
