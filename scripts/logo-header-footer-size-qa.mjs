import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];
const routes = ["/", "/about"];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

function visibleBox(page) {
  return page.evaluate(() => {
    const measure = (root, fullSel, circleSel) => {
      const full = root.querySelector(fullSel);
      const circle = root.querySelector(circleSel);
      const csF = full ? getComputedStyle(full) : null;
      const csC = circle ? getComputedStyle(circle) : null;
      let el = null;
      if (full && csF?.display !== "none") {
        el = full.querySelector("img") ?? full;
      } else if (circle && csC?.display !== "none") {
        el = circle;
      }
      const r = el?.getBoundingClientRect();
      return r && r.width > 0 && r.height > 0
        ? { w: r.width, h: r.height }
        : null;
    };
    return {
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      header: measure(
        document.querySelector("header.site-header"),
        ".brand-logo-full-svg",
        ".brand-logo-anchor-slot--header-fallback",
      ),
      footer: measure(
        document.querySelector(".site-footer-brand"),
        ".brand-logo-full-svg",
        ".brand-logo-anchor-slot--footer-fallback",
      ),
    };
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const route of routes) {
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(new URL(route, BASE).href, { waitUntil: "networkidle" });
    await dismiss(page);
    await page.evaluate(() =>
      document.querySelector("footer")?.scrollIntoView({ block: "start" }),
    );
    const m = await visibleBox(page);
    const tag = `${route} ${w}px`;
    if (m.scrollW > m.vw + 0.5) issues.push(`${tag}: overflow`);
    if (!m.header || !m.footer) {
      issues.push(`${tag}: missing measurable logo`);
    } else {
      if (Math.abs(m.header.w - m.footer.w) > 1)
        issues.push(`${tag}: width delta ${Math.abs(m.header.w - m.footer.w)}`);
      if (Math.abs(m.header.h - m.footer.h) > 1)
        issues.push(`${tag}: height delta ${Math.abs(m.header.h - m.footer.h)}`);
    }
    await page.close();
  }
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 240, height: 450 });
await zoom.goto(`${BASE}about`, { waitUntil: "networkidle" });
await dismiss(zoom);
await zoom.evaluate(() => document.querySelector("footer")?.scrollIntoView());
const zm = await visibleBox(zoom);
if (zm.header && zm.footer) {
  if (Math.abs(zm.header.w - zm.footer.w) > 1)
    issues.push(`240px zoom: width delta`);
  if (Math.abs(zm.header.h - zm.footer.h) > 1)
    issues.push(`240px zoom: height delta`);
}
await zoom.close();
await browser.close();

console.log(JSON.stringify({ issues }, null, 2));
if (issues.length) process.exit(1);
