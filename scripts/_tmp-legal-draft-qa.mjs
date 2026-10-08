import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const BASE = process.env.QA_BASE_URL ?? "http://localhost:3461/";
const routes = [
  "/privacy-policy/",
  "/disclaimer/",
  "/cookies-policy/",
  "/terms-and-conditions/",
  "/standard-terms-and-conditions-of-engagement/",
];
const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440,
  1920, 2560, 3258,
];
const shotDir = path.join(os.tmpdir(), "pelagic-legal-no-draft-qa");
fs.mkdirSync(shotDir, { recursive: true });

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(new URL(route, BASE).href, { waitUntil: "networkidle" });
    await dismiss(page);

    const result = await page.evaluate(() => {
      const main = document.querySelector("main") ?? document.body;
      const text = main.innerText || "";
      const prose = document.querySelector(".legal-prose");
      const proseRect = prose?.getBoundingClientRect();
      const vw = window.innerWidth;
      return {
        hasDraft: /draft notice/i.test(text) || /website draft copy pending formal legal review/i.test(text),
        proseOverflow: proseRect ? proseRect.right > vw + 1 : false,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    if (result.hasDraft) {
      issues.push({ route, width, hasDraft: true });
    }
    if (result.scrollWidth > width + 2 && result.proseOverflow) {
      issues.push({ route, width, overflow: result.scrollWidth - width });
    }

    if (route === "/disclaimer/" && [50, 320, 1280].includes(width)) {
      await page.screenshot({
        path: path.join(shotDir, `disclaimer-${width}.png`),
        fullPage: false,
      });
    }
    await page.close();
  }
}

const zoom = await browser.newPage();
await zoom.setViewportSize({ width: 1280, height: 900 });
await zoom.goto(
  new URL("/standard-terms-and-conditions-of-engagement/", BASE).href,
  { waitUntil: "networkidle" },
);
await dismiss(zoom);
await zoom.evaluate(() => {
  document.documentElement.style.fontSize = "200%";
});
await zoom.screenshot({ path: path.join(shotDir, "engagement-1280-200pct.png") });
await zoom.close();
await browser.close();

if (issues.length) {
  console.error(JSON.stringify(issues, null, 2));
  process.exit(1);
}
console.log("legal draft QA passed. Screenshots:", shotDir);
