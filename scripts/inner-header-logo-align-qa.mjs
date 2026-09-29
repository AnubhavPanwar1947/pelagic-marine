import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const routes = ["/about", "/services", "/contact"];
const outDir = path.join(process.cwd(), "scripts", "inner-header-logo-align-screenshots");
fs.mkdirSync(outDir, { recursive: true });

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

function measure(page) {
  return page.evaluate(() => {
    const bar = document.querySelector(".site-header-bar");
    const ref =
      document.querySelector("main .mx-auto.max-w-7xl") ||
      document.querySelector(".mx-auto.max-w-7xl");
    const fullImg = document.querySelector("header .brand-logo-full-svg img");
    const full = document.querySelector("header .brand-logo-full-svg");
    const circle = document.querySelector(
      "header .brand-logo-anchor-slot--header-fallback",
    );
    const csF = full ? getComputedStyle(full) : null;
    const csC = circle ? getComputedStyle(circle) : null;
    const ir = fullImg?.getBoundingClientRect();
    const ink =
      ir && csF?.display !== "none"
        ? ir.left + ir.height * (9 / 45)
        : circle && csC?.display !== "none"
          ? circle.getBoundingClientRect().left
          : null;
    const barR = bar?.getBoundingClientRect();
    const refR = ref?.getBoundingClientRect();
    const barCs = bar ? getComputedStyle(bar) : null;
    const padL = barCs ? parseFloat(barCs.paddingLeft) : 0;
    const contentEdge = barR ? barR.left + padL : null;
    return {
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
      barLeft: barR?.left ?? null,
      barMaxWidth: barCs?.maxWidth ?? null,
      refLeft: refR?.left ?? null,
      contentEdge,
      inkLeft: ink,
      delta: ink != null && contentEdge != null ? ink - contentEdge : null,
      fullDisplay: csF?.display ?? null,
      circleDisplay: csC?.display ?? null,
      dual:
        csF?.display !== "none" &&
        csC?.display !== "none" &&
        csF?.display !== undefined,
    };
  });
}

const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];
const shots = [320, 768, 1024, 1440, 1920, 2560, 3258];

const browser = await chromium.launch({ headless: true });
const issues = [];
const rows = [];

for (const route of routes) {
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(new URL(route, BASE).href, { waitUntil: "networkidle" });
    await dismiss(page);
    const r = await measure(page);
    rows.push({ route, w, ...r });
    const tag = `${route} ${w}px`;
    if (r.barLeft != null && r.barLeft < -0.5) issues.push(`${tag}: header bar outside viewport`);
    if (r.dual) issues.push(`${tag}: dual logos`);
    if (w >= 280 && r.fullDisplay === "none") issues.push(`${tag}: full hidden`);
    if (w < 280 && r.circleDisplay === "none") issues.push(`${tag}: circle hidden`);
    if (r.barLeft != null && r.refLeft != null && Math.abs(r.barLeft - r.refLeft) > 2)
      issues.push(`${tag}: header bar vs content column (${r.barLeft} vs ${r.refLeft})`);
    if (w >= 280 && r.delta != null && Math.abs(r.delta) > 2)
      issues.push(`${tag}: ink vs column left delta ${Math.round(r.delta * 10) / 10}px`);
    if (route === "/about" && shots.includes(w)) {
      await page.screenshot({
        path: path.join(outDir, `about-${w}.png`),
        fullPage: false,
      });
    }
    await page.close();
  }
}

const narrow = await browser.newPage();
await narrow.setViewportSize({ width: 50, height: 450 });
await narrow.goto(`${BASE}about`, { waitUntil: "networkidle" });
await dismiss(narrow);
await narrow.screenshot({ path: path.join(outDir, "about-50.png") });
await narrow.close();

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 240, height: 450 });
await zoom.goto(`${BASE}about`, { waitUntil: "networkidle" });
await dismiss(zoom);
const zr = await measure(zoom);
await zoom.screenshot({ path: path.join(outDir, "about-200pct-zoom.png") });
if (zr.fullDisplay !== "none") issues.push("240px about: expected circle only");
await zoom.close();

await browser.close();
const report = { rows, issues, outDir };
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "inner-header-logo-align-qa-out.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify({ issueCount: issues.length, issues, outDir }, null, 2));
if (issues.length) process.exit(1);
