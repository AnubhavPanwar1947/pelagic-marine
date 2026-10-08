import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];

const CASES = [
  {
    q: "Yokohama",
    assert: (m) => m.hasContact && m.allContact,
    label: "Yokohama → Contact only",
  },
  { q: "Woodlands", assert: (m) => m.hasContact, label: "Woodlands → Contact" },
  { q: "Anubhav", assert: (m) => m.hasTeam, label: "Anubhav → Team" },
  {
    q: "register of representative assignments",
    assert: (m) => !m.hasHome,
    label: "register phrase → not Home",
  },
  { q: "of", assert: (m) => m.resultCount === 0, label: "of → no results" },
  { q: "Optimoor", assert: (m) => m.resultCount > 0, label: "Optimoor → some results" },
];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

function rowMetrics(vw) {
  const rows = [...document.querySelectorAll("a.site-search-result-row")];
  const hrefs = rows.map((a) => a.getAttribute("href") ?? "");
  const clipped = [];
  for (const el of document.querySelectorAll(".site-search-page *")) {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    if (rect.left < -1 || rect.right > vw + 1) {
      const cls =
        typeof el.className === "string" ? el.className.split(/\s+/).slice(0, 2).join(".") : "";
      if (cls.includes("sr-only")) continue;
      clipped.push({ tag: el.tagName, cls, left: Math.round(rect.left), right: Math.round(rect.right) });
      if (clipped.length >= 3) break;
    }
  }
  return {
    scrollW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
    resultCount: rows.length,
    hasContact: hrefs.some((h) => h.includes("/contact")),
    allContact: hrefs.length > 0 && hrefs.every((h) => h.includes("/contact")),
    hasTeam: hrefs.some((h) => h.includes("/team")),
    hasHome: hrefs.some((h) => h === "/" || h.startsWith("/?") || /\/$/.test(h) && h.replace(/\/$/, "") === ""),
    clipped,
  };
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const { q, assert, label } of CASES) {
  const url = new URL(`/search/?q=${encodeURIComponent(q)}`, BASE).href;
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url, { waitUntil: "networkidle" });
    await dismiss(page);
    const m = await page.evaluate(rowMetrics, width);
    if (m.scrollW > m.vw + 0.5) {
      issues.push(`${label} ${width}px: overflow ${m.scrollW} > ${m.vw}`);
    }
    if (m.clipped.length) {
      issues.push(`${label} ${width}px: clipped ${JSON.stringify(m.clipped)}`);
    }
    if (!assert(m)) {
      issues.push(`${label} ${width}px: assertion failed ${JSON.stringify(m)}`);
    }
    await page.close();
  }
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 1280, height: 900 });
await zoom.goto(new URL("/search/?q=Woodlands", BASE).href, { waitUntil: "networkidle" });
await dismiss(zoom);
await zoom.evaluate(() => {
  document.body.style.zoom = "200%";
});
await zoom.waitForTimeout(300);
const zm = await zoom.evaluate(rowMetrics, 1280);
if (zm.scrollW > zm.vw + 0.5) issues.push("1280@200% Woodlands: overflow");
if (!zm.hasContact) issues.push("1280@200% Woodlands: no Contact");
await zoom.close();

await browser.close();
const result = { pass: issues.length === 0, issues };
console.log(JSON.stringify(result, null, 2));
process.exit(issues.length ? 1 : 0);
