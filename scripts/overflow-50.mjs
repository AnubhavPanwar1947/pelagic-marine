import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 50, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
  document
    .querySelectorAll('[role="presentation"].fixed')
    .forEach((el) => el.remove());
});
const offenders = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      if (r.width > 0 && r.height > 0)
        out.push({
          tag: el.tagName,
          cls: String(el.className || "").slice(0, 80),
          right: Math.round(r.right),
          left: Math.round(r.left),
          w: Math.round(r.width),
        });
    }
  });
  return {
    sw: document.documentElement.scrollWidth,
    vw,
    offenders: out.sort((a, b) => b.right - a.right).slice(0, 20),
  };
});
console.log(JSON.stringify(offenders, null, 2));
await browser.close();
