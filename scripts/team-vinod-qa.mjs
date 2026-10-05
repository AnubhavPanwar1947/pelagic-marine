import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const baseUrl = process.env.BASE_URL || "http://localhost:3000/team/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 1200 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const state = await page.evaluate(() => {
    const card = document.getElementById("team-vinod-janardanan");
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const img = card?.querySelector("img");
    const paras = card
      ? [...card.querySelectorAll(".team-member-card__bio")].map((p) => p.textContent)
      : [];
    const body = card?.querySelector(".team-member-card__body");
    const bioScroll = card?.querySelector(".team-member-card__bio-scroll");
    const bodyStyle = body ? getComputedStyle(body) : null;
    const bioScrollStyle = bioScroll ? getComputedStyle(bioScroll) : null;
    const desktop = vw >= 640;
    const bodyScrollable =
      desktop &&
      bioScroll &&
      bioScroll.scrollHeight > bioScroll.clientHeight + 2 &&
      (bioScrollStyle?.overflowY === "auto" || bioScrollStyle?.overflowY === "scroll");
    return {
      cardFound: Boolean(card),
      paragraphCount: paras.length,
      hasBv: paras.some((t) => t?.includes("Bureau Veritas")),
      overflowX: sw > vw + 0.5,
      bodyScrollable,
      bodyOverflowY: bodyStyle?.overflowY ?? "",
      imgAlt: img?.getAttribute("alt") ?? "",
      imgOk: Boolean(img && img.naturalWidth > 0),
    };
  });
  results.push({ width: w, ...state });
}

await page.setViewportSize({ width: 1280, height: 1200 });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.body.style.zoom = "200%";
});
await page.waitForTimeout(150);
const zoom = await page.evaluate(() => {
  const card = document.getElementById("team-vinod-janardanan");
  return { cardFound: Boolean(card), overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 0.5 };
});
results.push({ width: "1280@200%zoom", ...zoom });

const failures = results.filter(
  (r) =>
    !r.cardFound ||
    r.paragraphCount !== 3 ||
    !r.hasBv ||
    r.overflowX ||
    !r.imgAlt.includes("Vinod") ||
    (typeof r.width === "number" && r.width >= 640 && !r.bodyScrollable),
);

const out = { pass: failures.length === 0, failures, results };
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "team-vinod-qa-out.json"),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify({ pass: out.pass, failures: out.failures }, null, 2));

await browser.close();
process.exit(out.pass ? 0 : 1);
