import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const P1 =
  "Finite Element Analysis (FEA) is a powerful computational method used to simulate and predict the structural and thermal behaviour of components and systems under real-world physical conditions such as mechanical loading, vibration, thermal gradients, and fluid interaction. While termed “analysis,” FEA is an integral part of the design and verification process, allowing engineers to anticipate structural performance, identify critical stress areas, and optimize designs before fabrication or physical testing.";
const P2 =
  "In the offshore and marine industry, FEA is extensively utilized to address complex engineering problems associated with floating and fixed structures. Applications include evaluating global structural integrity, local stress concentrations, fatigue life estimation, buckling assessments, and dynamic response to environmental loads.";
const P3 =
  "Our engineering team employs ANSYS, a leading FEA platform, to carry out high-fidelity simulations that support the structural design and assessment of offshore platforms, subsea equipment, riser systems, and hull structures. Analyses are performed in accordance with relevant industry codes and class society requirements, for safety and performance across the asset lifecycle.";

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
  await page.goto(`${BASE}/services/finite-element-analysis/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate((justifyMinPx) => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const paras = [...document.querySelectorAll(".service-topic-article p.type-copy")].map(
      (p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "",
    );
    const alignChecks = [...document.querySelectorAll(".service-topic-article p.type-copy")].map(
      (p) => {
        const style = getComputedStyle(p);
        const width = p.getBoundingClientRect().width;
        const expectJustify = width >= justifyMinPx - 1;
        const align = style.textAlign;
        const ok = expectJustify
          ? align === "justify"
          : align === "left" || align === "start";
        return { ok, align, width: Math.round(width) };
      },
    );
    const main = document.querySelector("main")?.innerText ?? "";
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      paras,
      alignChecks,
      hasAllAnalyses: main.includes("All analyses"),
      hasEnsuringBoth: main.includes("ensuring both"),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.paras[0] !== P1) issues.push(`${w}px: paragraph 1 changed`);
  if (data.paras[1] !== P2) issues.push(`${w}px: paragraph 2 changed`);
  if (data.paras[2] !== P3) issues.push(`${w}px: paragraph 3 mismatch`);
  if (data.hasAllAnalyses) issues.push(`${w}px: "All analyses" still present`);
  if (data.hasEnsuringBoth) issues.push(`${w}px: "ensuring both" still present`);
  for (const [i, check] of data.alignChecks.entries()) {
    if (!check.ok) issues.push(`${w}px: p${i + 1} align ${check.align} at ${check.width}px`);
  }
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/finite-element-analysis/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const paras = [...document.querySelectorAll(".service-topic-article p.type-copy")].map(
    (p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "",
  );
  return { width: "1280@200%zoom", p3: paras[2] };
});
results.push(zoom);
if (zoom.p3 !== P3) issues.push("1280@200%: paragraph 3 mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-fea-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ requiredP3: P3, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
