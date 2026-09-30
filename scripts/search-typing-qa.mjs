import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3459/";
const screenshotDir = path.join(os.tmpdir(), "pelagic-search-typing-qa");
fs.mkdirSync(screenshotDir, { recursive: true });

const phrase = "Nishchay Maken";
const delays = [0, 40, 80, 120, 150, 160, 170, 180, 200, 220, 300, 500];
const runsPerDelay = Number(process.env.QA_TYPING_RUNS ?? "4");

async function dismissSplash(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
  });
}

async function typePhrase(page, delayMs) {
  await page.goto(new URL("/search/", BASE).href, { waitUntil: "networkidle" });
  await dismissSplash(page);
  const input = page.locator(".site-search-field__input");
  await input.click();
  await input.fill("");
  for (const char of phrase) {
    await input.pressSequentially(char, { delay: delayMs });
  }
  return (await input.inputValue()).trim();
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const delay of delays) {
  let mismatches = 0;
  for (let run = 0; run < runsPerDelay; run += 1) {
    const page = await browser.newPage();
    const value = await typePhrase(page, delay);
    if (value !== phrase) {
      mismatches += 1;
      issues.push({ delay, run, value });
    }
    await page.close();
  }
  console.log(`delay=${delay}ms mismatches=${mismatches}/${runsPerDelay}`);
}

const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(new URL("/search/?q=Vip", BASE).href, { waitUntil: "networkidle" });
await dismissSplash(page);
const emptyWithSuggestions = await page.evaluate(() => ({
  empty: Boolean(document.querySelector(".site-search-message--empty")),
  suggestions: document.querySelectorAll(".site-search-suggestion-row").length,
}));
if (emptyWithSuggestions.empty && emptyWithSuggestions.suggestions > 0) {
  issues.push({ check: "no-results-with-suggestions", ...emptyWithSuggestions });
}
await page.screenshot({ path: path.join(screenshotDir, "search-vip-prefix-1280.png"), fullPage: true });

for (const name of ["Vipul", "Nishchay", "Harjit", "Bhanu", "Abhinav"]) {
  const memberPage = await browser.newPage();
  await memberPage.goto(new URL(`/search/?q=${encodeURIComponent(name)}`, BASE).href, {
    waitUntil: "networkidle",
  });
  await dismissSplash(memberPage);
  const first = memberPage.locator(".site-search-result-row").first();
  if (await first.count()) {
    const href = await first.getAttribute("href");
    if (href) {
      await memberPage.goto(new URL(href, BASE).href, { waitUntil: "networkidle" });
      await dismissSplash(memberPage);
      await memberPage.waitForTimeout(800);
    }
    const landing = await memberPage.evaluate(() => ({
      hash: location.hash,
      marks: document.querySelectorAll("mark.site-search-highlight").length,
      targetVisible: Boolean(document.querySelector(".search-landing-target")),
    }));
    if (landing.marks < 1) {
      issues.push({ check: "team-landing", name, landing });
    }
  }
  await memberPage.close();
}

await browser.close();

if (issues.length) {
  console.error("search-typing-qa issues:", JSON.stringify(issues, null, 2));
  process.exit(1);
}

console.log("search-typing-qa: passed. Screenshots:", screenshotDir);
