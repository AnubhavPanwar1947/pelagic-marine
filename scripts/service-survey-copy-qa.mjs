import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const PRELOAD =
  "Pre-Loading Vessel Surveys: Technical inspections to check vessel readiness for cargo operations, focusing on structural integrity and load distribution.";
const PROJECT =
  "Project Cargo Loading & Lashing Plans: Preparation of cargo securing methods and plans for heavy and oversized cargoes.";
const REMOVED = [
  "Safety Attestations",
  "Carving and Marking Note Attestations",
  "Fit for Purpose",
  "Project Cargo Loading/Unloading Attendance",
];
const EXPECTED_BULLETS = [
  "Condition Surveys: Comprehensive assessments on behalf of P&I clubs, H&M insurers, and individual clients to evaluate the overall condition of the vessel and identify potential risks.",
  "On-Hire/Off-Hire Condition Surveys: Detailed assessments to verify the condition of vessels at the time of charter hire, including equipment, machinery, and hull integrity.",
  PRELOAD,
  PROJECT,
  "Non-Exclusive Surveys: Independent, non-affiliated surveys to assess the condition and functionality of specific vessel systems or components.",
  "Bollard Pull & Winch Testing: Performance testing of towing and mooring systems, including winch load testing and bollard pull capacity measurements.",
  "Pre-Purchase Inspections: Detailed technical evaluations of vessels, focusing on mechanical, structural, and safety systems, to support the acquisition decision-making process.",
  "Valuation Reports: Expert evaluations of vessel market value, based on condition, market trends, and technical specifications.",
];
const P1 =
  "At Pelagic Marine, we leverage the expertise of our team, comprising Master Mariners and Marine Engineers, to deliver precise and comprehensive marine and technical surveys. Our services cater to a wide range of vessel types, providing in-depth assessments to ensure operational efficiency, safety, and compliance with industry standards.";
const P2 =
  "Our clientele spans ship owners, operators, charterers, P&I clubs, insurers, financial institutions, flag states, and classification societies.";
const CLOSING =
  "With an unwavering focus on precision and adherence to international standards, Pelagic Marine endeavours to ensure the highest level of technical integrity and operational safety across all maritime operations.";

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
  await page.goto(`${BASE}/services/service-survey/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const paras = [...document.querySelectorAll(".service-topic-article > div > p.type-copy")].map(
      (p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "",
    );
    const bullets = [...document.querySelectorAll(".service-topic-article ul.type-copy li")].map(
      (li) => li.textContent?.trim() ?? "",
    );
    const closing = [...document.querySelectorAll(".service-topic-article p.type-copy")].pop();
    const closingText = closing?.textContent?.replace(/\s+/g, " ").trim() ?? "";
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
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      paras,
      bullets,
      closingText,
      introAlignOk,
      listJustified: ul ? getComputedStyle(ul).textAlign === "justify" : false,
      main,
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.paras[0] !== P1) issues.push(`${w}px: paragraph 1 changed`);
  if (data.paras[1] !== P2) issues.push(`${w}px: paragraph 2 changed`);
  if (data.closingText !== CLOSING) issues.push(`${w}px: closing changed`);
  if (data.main.includes("Pelagic Marine ensures the highest")) {
    issues.push(`${w}px: old closing phrase still present`);
  }
  if (data.main.includes("On-Hire/Off-Hire Bunker Surveys")) {
    issues.push(`${w}px: bunker surveys bullet still present`);
  }
  if (JSON.stringify(data.bullets) !== JSON.stringify(EXPECTED_BULLETS)) {
    issues.push(`${w}px: bullet list mismatch`);
  }
  const preload = data.bullets.find((b) => b.startsWith("Pre-Loading"));
  const project = data.bullets.find((b) => b.startsWith("Project Cargo"));
  if (preload !== PRELOAD) issues.push(`${w}px: pre-loading bullet mismatch`);
  if (project !== PROJECT) issues.push(`${w}px: project cargo bullet mismatch`);
  if (data.main.includes("to ensure vessel readiness")) issues.push(`${w}px: to ensure vessel readiness`);
  if (data.main.includes("Lashing Approvals")) issues.push(`${w}px: Lashing Approvals`);
  if (data.main.includes("Certification of appropriate cargo")) {
    issues.push(`${w}px: Certification of appropriate cargo`);
  }
  if (data.main.includes("compliance with maritime safety standards")) {
    issues.push(`${w}px: compliance with maritime safety standards in project bullet context`);
  }
  for (const r of REMOVED) {
    if (data.main.includes(r)) issues.push(`${w}px: removed bullet "${r}" still present`);
  }
  if (data.listJustified) issues.push(`${w}px: list justified`);
  if (!data.introAlignOk) issues.push(`${w}px: intro alignment`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-survey/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const bullets = [...document.querySelectorAll(".service-topic-article ul.type-copy li")].map(
    (li) => li.textContent?.trim() ?? "",
  );
  return { width: "1280@200%zoom", count: bullets.length, project: bullets[3] };
});
results.push(zoom);
if (zoom.count !== EXPECTED_BULLETS.length) issues.push("1280@200%: bullet count wrong");
if (zoom.project !== PROJECT) issues.push("1280@200%: project bullet mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-survey-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.slice(0, 40).join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
