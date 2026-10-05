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
  "Our engineering team delivers high-performance heat transfer analysis solutions tailored for the maritime industry. We provide evaluation of temperature distribution and heat flux in structural components exposed to thermal loads, supporting both steady-state and transient conditions, as well as linear and non-linear material behavior.";
const P2 =
  "With proven expertise in handling high-temperature cargo scenarios, we work on optimal thermal management and insulation design for vessels operating beyond typical ambient marine conditions. Our solutions help enhance safety, maintain cargo integrity, and improve energy efficiency—meeting the rigorous demands of modern shipping operations.";

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
  await page.goto(`${BASE}/services/service-heat/`, { waitUntil: "networkidle" });
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
    const workOnCount = (main.match(/we work on optimal thermal management/g) ?? []).length;
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      paras,
      alignChecks,
      hasPrecise: /\bprecise\b/i.test(main),
      hasEnsure: main.includes("we ensure optimal thermal management"),
      workOnCount,
      doubleSpace: paras.some((t) => /\s{2,}/.test(t)),
    };
  }, JUSTIFY_MIN_PX);

  results.push({ width: w, ...data });

  if (data.paras[0] !== P1) issues.push(`${w}px: paragraph 1 mismatch`);
  if (data.paras[1] !== P2) issues.push(`${w}px: paragraph 2 mismatch`);
  if (data.hasPrecise) issues.push(`${w}px: precise still present`);
  if (data.hasEnsure) issues.push(`${w}px: we ensure optimal still present`);
  if (data.workOnCount !== 1) issues.push(`${w}px: work on phrase count ${data.workOnCount}`);
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  for (const [i, check] of data.alignChecks.entries()) {
    if (!check.ok) issues.push(`${w}px: p${i + 1} align ${check.align}`);
  }
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/service-heat/`, { waitUntil: "networkidle" });
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

const outPath = path.join(process.cwd(), "scripts", "service-heat-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
