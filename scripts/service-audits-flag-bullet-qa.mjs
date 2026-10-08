import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const FLAG_BULLET =
  "Flag State Inspection: Authorized inspections under the Liberian Registry to ensure vessel compliance.";
const P1 =
  "At Pelagic Marine, we understand the critical importance of compliance, operational integrity, and continuous improvement in the maritime industry. We perform systematic evaluations of vessel operations, shipboard practices, safety management frameworks, and navigational protocols. Our services are aligned with the latest IMO conventions, flag state requirements, OCIMF standards, and classification society guidelines.";
const P2 =
  "We conduct systematic examinations of vessel systems, onboard procedures, and management practices to verify that your Safety Management System (SMS) is properly implemented and adhered to by the crew. Each audit is meticulously carried out to support safety, efficiency, and compliance across all levels of maritime operations.";

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
  await page.goto(`${BASE}/services/audits-inspections/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const paras = [...document.querySelectorAll(".service-topic-article p.type-copy")].map(
      (p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "",
    );
    const bullets = [...document.querySelectorAll(".service-topic-article ul.type-copy li")].map(
      (li) => li.textContent?.trim() ?? "",
    );
    const flag = bullets.find((b) => b.startsWith("Flag State Inspection"));
    const ul = document.querySelector(".service-topic-article ul.type-copy");
    const intro = document.querySelector(".service-topic-article p.type-copy");
    const style = intro ? getComputedStyle(intro) : null;
    const wPx = intro ? intro.getBoundingClientRect().width : 0;
    const expectJustify = wPx >= justifyMinPx - 1;
    const introAlignOk = intro
      ? expectJustify
        ? style.textAlign === "justify"
        : style.textAlign === "left" || style.textAlign === "start"
      : false;
    const main = document.querySelector("main")?.innerText ?? "";
    const flagCount = bullets.filter((b) => b.startsWith("Flag State Inspection")).length;
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      paras,
      flag,
      flagCount,
      hasLiberiaTitle: main.includes("Flag State Inspection (Liberia)"),
      hasLiberianRegistry: flag?.includes("Liberian Registry") ?? false,
      introAlignOk,
      listJustified: ul ? getComputedStyle(ul).textAlign === "justify" : false,
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.paras[0] !== P1) issues.push(`${w}px: paragraph 1 changed`);
  if (data.paras[1] !== P2) issues.push(`${w}px: paragraph 2 changed`);
  if (data.flag !== FLAG_BULLET) issues.push(`${w}px: flag bullet mismatch`);
  if (data.flagCount !== 1) issues.push(`${w}px: flag bullet count ${data.flagCount}`);
  if (data.hasLiberiaTitle) issues.push(`${w}px: (Liberia) still in title`);
  if (!data.hasLiberianRegistry) issues.push(`${w}px: Liberian Registry missing`);
  if (data.listJustified) issues.push(`${w}px: list justified`);
  if (!data.introAlignOk) issues.push(`${w}px: intro alignment`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/audits-inspections/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const flag = [...document.querySelectorAll(".service-topic-article ul.type-copy li")]
    .map((li) => li.textContent?.trim() ?? "")
    .find((b) => b.startsWith("Flag State Inspection"));
  return { width: "1280@200%zoom", flag };
});
results.push(zoom);
if (zoom.flag !== FLAG_BULLET) issues.push("1280@200%: flag bullet mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-audits-flag-bullet-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ flagBullet: FLAG_BULLET, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
