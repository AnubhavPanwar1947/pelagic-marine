import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const baseUrl = process.env.BASE_URL || "http://localhost:3000/contact/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const state = await page.evaluate(() => {
    const form = document.querySelector("form");
    const submit = form?.querySelector('button[type="submit"]');
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const sr = submit?.getBoundingClientRect();
    return {
      overflowX: sw > vw + 0.5,
      submitVisible: Boolean(sr && sr.width > 0 && sr.height > 0),
      submitDisabled: submit?.hasAttribute("disabled") ?? false,
      formOk: Boolean(form),
    };
  });
  results.push({ width: w, ...state });
}

await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.body.style.zoom = "200%";
});
await page.waitForTimeout(150);
const zoom = await page.evaluate(() => {
  const submit = document.querySelector('button[type="submit"]');
  const sr = submit?.getBoundingClientRect();
  return {
    submitVisible: Boolean(sr && sr.width > 0),
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 0.5,
  };
});
results.push({ width: "1280@200%zoom", ...zoom });

const failures = results.filter((r) => r.overflowX || !r.submitVisible || !r.formOk);

const out = { baseUrl, pass: failures.length === 0, failures, results };
const outPath = path.join(process.cwd(), "scripts", "contact-mailto-responsive-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ pass: out.pass, failureCount: failures.length, outPath }, null, 2));

await browser.close();
process.exit(out.pass ? 0 : 1);
