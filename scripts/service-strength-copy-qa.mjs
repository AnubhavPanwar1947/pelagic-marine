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
  "Our team conducts Global and Local Strength Analysis (GLSA) to evaluate the structural response of marine and offshore structures under extreme environmental loading. The analysis is grounded in first-principles methodologies, ensuring a physics-based, high-fidelity representation of structural behaviour.";
const P2 =
  "Extreme load assessments are performed across a range of dominant load cases, which are identified based on vessel or structure type. This approach enables detailed yet computationally efficient structural simulations.";
const P3 =
  "GLSA is carried out using advanced finite element modelling to capture both global load distribution and localized stress concentrations. Our scope includes global structural analysis of jacket platforms, floating production units (FPUs), and self-elevating platforms (SEPs), all executed as per applicable class rules and industry guidelines.";
const P4 =
  "Our analyses have consistently met or exceeded client expectations, supporting both newbuild and in-service assessment projects.";

const EDW =
  "For each load case, an Equivalent Design Wave (EDW) is derived to represent the most critical sea state in a simplified regular wave format.";

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
  await page.goto(`${BASE}/services/global-local-strength/`, { waitUntil: "networkidle" });
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
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      paras,
      alignChecks,
      mainText: document.querySelector("main")?.innerText ?? "",
    };
  }, JUSTIFY_MIN_PX);

  const row = { width: w, ...data };
  results.push(row);

  if (data.paras[0] !== P1) issues.push(`${w}px: paragraph 1 changed`);
  if (data.paras[1] !== P2) issues.push(`${w}px: paragraph 2 mismatch`);
  if (data.paras[2] !== P3) issues.push(`${w}px: paragraph 3 mismatch`);
  if (data.paras[3] !== P4) issues.push(`${w}px: paragraph 4 mismatch`);
  if (data.mainText.includes(EDW)) issues.push(`${w}px: EDW sentence still present`);
  if (data.mainText.includes("client specifications")) {
    issues.push(`${w}px: old client specifications still present`);
  }
  if (data.mainText.includes("full compliance with class and industry requirements")) {
    issues.push(`${w}px: old compliance phrase still present`);
  }
  for (const [i, check] of data.alignChecks.entries()) {
    if (!check.ok) issues.push(`${w}px: p${i + 1} align ${check.align} at ${check.width}px`);
  }
  if (data.paras.some((t) => /\s{2,}/.test(t))) issues.push(`${w}px: double spaces`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/global-local-strength/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const paras = [...document.querySelectorAll(".service-topic-article p.type-copy")].map(
    (p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "",
  );
  return { width: "1280@200%zoom", p2: paras[1], hasEdw: (document.querySelector("main")?.innerText ?? "").includes("Equivalent Design Wave") };
});
results.push(zoom);
if (zoom.p2 !== P2) issues.push("1280@200%: paragraph 2 mismatch");
if (zoom.hasEdw) issues.push("1280@200%: EDW still present");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-strength-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
