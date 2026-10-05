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
  "At the forefront of engineering innovation, Computational Fluid Dynamics (CFD) is a core tool we use to simulate and optimize fluid flow behavior in complex systems. Whether designing next-generation wind turbines, optimizing hull performance, high-performance marine vessels, or energy-efficient HVAC systems, CFD allows us to deliver data-driven solutions with precision and reliability.";
const P2 =
  "CFD involves the numerical analysis of fluid behavior based on physical parameters such as velocity, pressure, temperature, density, and viscosity. By replicating real-world fluid interactions within a virtual environment, we can predict performance, identify inefficiencies, and refine designs long before any physical prototype is built.";
const P3 =
  "As a digital fluid dynamics simulator, CFD plays a critical role in high-end design optimization, reducing development time and cost while enhancing safety and functionality. Our team leverages advanced CFD tools and deep domain expertise to deliver customized solutions tailored to your engineering challenges.";

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
  await page.goto(`${BASE}/services/service-cfd/`, { waitUntil: "networkidle" });
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
        return { ok, align };
      },
    );
    const main = paras.join(" ");
    const hullCount = (main.match(/optimizing hull performance/g) ?? []).length;
    const afterWind =
      paras[0]?.includes("wind turbines, optimizing hull performance, high-performance") ?? false;
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      paras,
      alignChecks,
      hullCount,
      afterWind,
      hasAccurately: main.includes("accurately"),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.paras[0] !== P1) issues.push(`${w}px: paragraph 1 mismatch`);
  if (data.paras[1] !== P2) issues.push(`${w}px: paragraph 2 mismatch`);
  if (data.paras[2] !== P3) issues.push(`${w}px: paragraph 3 changed`);
  if (!data.afterWind) issues.push(`${w}px: hull phrase not after wind turbines`);
  if (data.hullCount !== 1) issues.push(`${w}px: optimizing hull performance count ${data.hullCount}`);
  if (data.hasAccurately) issues.push(`${w}px: accurately still present`);
  for (const [i, check] of data.alignChecks.entries()) {
    if (!check.ok) issues.push(`${w}px: p${i + 1} align ${check.align}`);
  }
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-cfd/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const paras = [...document.querySelectorAll(".service-topic-article p.type-copy")].map(
    (p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "",
  );
  return { width: "1280@200%zoom", p1: paras[0], p2: paras[1] };
});
results.push(zoom);
if (zoom.p1 !== P1 || zoom.p2 !== P2) issues.push("1280@200%: paragraph mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "service-cfd-service-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
