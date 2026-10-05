import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const ROUTE = "/services/";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];

const EXPECTED = {
  "naval-architecture-design": "#ffffff",
  engineering: "#e6f4fc",
  "inspection-audits-surveying": "#ffffff",
  "mooring-compatibility": "#e6f4fc",
  loadicator: "#ffffff",
};

function normRgb(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb.toLowerCase();
  const hex = (n) => Number(n).toString(16).padStart(2, "0");
  return `#${hex(m[1])}${hex(m[2])}${hex(m[3])}`;
}

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const results = [];
const issues = [];

const browser = await chromium.launch();
try {
  for (const w of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: 1200 });
    await page.goto(`${BASE}${ROUTE}`, { waitUntil: "networkidle" });
    await dismiss(page);
    const m = await page.evaluate((expectedKeys) => {
      const vw = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bands = [...document.querySelectorAll(".services-practice-band")];
      const colors = {};
      for (const el of bands) {
        const id = el.id;
        const bg = getComputedStyle(el).backgroundColor;
        const rect = el.getBoundingClientRect();
        colors[id] = {
          bg,
          left: rect.left,
          right: rect.right,
          width: rect.width,
        };
      }
      return { vw, scrollW, docOverflow: scrollW > vw + 0.5, colors };
    }, Object.keys(EXPECTED));

    for (const [slug, want] of Object.entries(EXPECTED)) {
      const row = m.colors[slug];
      if (!row) {
        issues.push(`${w}px: missing section #${slug}`);
        continue;
      }
      const got = normRgb(row.bg);
      if (got !== want) {
        issues.push(`${w}px: #${slug} bg ${got} expected ${want}`);
      }
      if (row.left > 0.5 || row.right < m.vw - 0.5) {
        issues.push(`${w}px: #${slug} band not full width (${row.left}-${row.right} vs ${m.vw})`);
      }
    }
    if (m.docOverflow) issues.push(`${w}px: horizontal scroll ${m.scrollW}>${m.vw}`);

    results.push({ width: w, ...m });
    await page.close();
  }
} finally {
  await browser.close();
}

const out = { ok: issues.length === 0, issues, results };
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "services-practice-bg-qa-out.json"),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify({ ok: out.ok, issueCount: issues.length, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
