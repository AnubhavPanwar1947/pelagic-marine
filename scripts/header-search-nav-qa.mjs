import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const routes = ["/", "/about", "/services", "/contact"];
const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];
const outDir = path.join(process.cwd(), "scripts", "header-search-screenshots");
fs.mkdirSync(outDir, { recursive: true });

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
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

    const before = await page.evaluate(() => ({
      overlay: !!document.querySelector(".site-search-overlay"),
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      icon: document.querySelector(".site-header-search a[aria-label='Open search']"),
    }));

    if (before.overlay) issues.push(`${route} ${w}px: overlay present before click`);
    if (before.scrollW > before.vw + 0.5)
      issues.push(`${route} ${w}px: overflow before nav`);

    const icon = page.locator(".site-header-search a[aria-label='Open search']");
    if (!(await icon.count())) {
      issues.push(`${route} ${w}px: missing search link`);
      await page.close();
      continue;
    }

    const box = await icon.boundingBox();
    if (!box || box.x < -1 || box.x + box.width > before.vw + 1)
      issues.push(`${route} ${w}px: search icon outside viewport`);

    await icon.click();
    await page.waitForURL((url) => url.pathname.replace(/\/$/, "") === "/search", {
      timeout: 10000,
    });

    const after = await page.evaluate(() => ({
      overlay: !!document.querySelector(".site-search-overlay"),
      inputs: document.querySelectorAll(".site-search-page .site-search-field__input").length,
      scrollW: document.documentElement.scrollWidth,
      vw: document.documentElement.clientWidth,
      focused: document.activeElement?.matches?.(".site-search-field__input") ?? false,
      headerH: document.querySelector("header.site-header")?.getBoundingClientRect().height,
    }));

    if (after.overlay) issues.push(`${route} ${w}px: overlay after nav`);
    if (after.inputs !== 1) issues.push(`${route} ${w}px: expected 1 search input`);
    if (after.scrollW > after.vw + 0.5) issues.push(`${route} ${w}px: overflow on search`);
    if (Math.abs((after.headerH ?? 0) - 75) > 1.5)
      issues.push(`${route} ${w}px: header height ${after.headerH}`);

    await page.close();
  }
}

const lng = await browser.newPage();
await lng.setViewportSize({ width: 1024, height: 900 });
await lng.goto(`${BASE}search/?q=lng`, { waitUntil: "networkidle" });
await dismiss(lng);
const lngOk = await lng.evaluate(() => ({
  q: new URLSearchParams(location.search).get("q"),
  hasResults: document.body.textContent?.includes("match") || document.body.textContent?.includes("result"),
}));
if (lngOk.q !== "lng") issues.push("search/?q=lng: query missing");
await lng.close();

for (const w of [320, 768, 1024, 1440, 1920, 2560, 3258]) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}search/`, { waitUntil: "networkidle" });
  await dismiss(page);
  await page.screenshot({ path: path.join(outDir, `search-${w}.png`) });
  await page.close();
}

const narrow = await browser.newPage();
await narrow.setViewportSize({ width: 50, height: 450 });
await narrow.goto(`${BASE}about`, { waitUntil: "networkidle" });
await dismiss(narrow);
await narrow.locator(".site-header-search a").click();
await narrow.waitForURL("**/search**");
await narrow.screenshot({ path: path.join(outDir, "search-from-50.png") });
await narrow.close();

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 240, height: 450 });
await zoom.goto(`${BASE}search/?q=lng`, { waitUntil: "networkidle" });
await dismiss(zoom);
const z = await zoom.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  vw: document.documentElement.clientWidth,
}));
if (z.scrollW > z.vw + 0.5) issues.push("240px zoom: overflow");
await zoom.screenshot({ path: path.join(outDir, "search-200pct-zoom.png") });
await zoom.close();

await browser.close();
console.log(JSON.stringify({ issues, outDir }, null, 2));
if (issues.length) process.exit(1);
