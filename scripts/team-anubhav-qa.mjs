import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const BIO_P1 =
  "Anubhav Panwar is a technology professional with a Master of Computer Applications";
const BIO_P2 = "At Pelagic Marine, Anubhav supports the development and management of digital products";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document.querySelectorAll('[role="presentation"].fixed').forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 1200 });
  await page.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate(
    ({ bioP1, bioP2 }) => {
      const cards = [...document.querySelectorAll(".team-member-card")];
      const last = cards[cards.length - 1];
      const name = last?.querySelector(".team-member-card__heading-name")?.textContent?.trim() ?? "";
      const role =
        last?.querySelector(".team-member-card__heading-name + p")?.textContent?.trim() ?? "";
      const bioText = last?.querySelector(".team-member-card__body")?.textContent ?? "";
      const imgEl = last?.querySelector(".team-member-card__portrait img");
      const imgSrc = imgEl?.getAttribute("src") ?? "";
      const objectPosition = imgEl ? getComputedStyle(imgEl).objectPosition : "";
      const portrait = last?.querySelector(".team-member-card__portrait");
      const img = last?.querySelector(".team-member-card__portrait img");
      let portraitOk = true;
      if (portrait && img) {
        const pr = portrait.getBoundingClientRect();
        const ir = img.getBoundingClientRect();
        portraitOk =
          ir.left >= pr.left - 1 && ir.right <= pr.right + 1 && ir.top >= pr.top - 1;
      }
      const paras = last?.querySelectorAll(".team-member-card__bio") ?? [];
      const grid = document.querySelector(".team-surface-soft .grid");
      const gridCols = grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0;
      const vw = document.documentElement.clientWidth;
      return {
        cardCount: cards.length,
        name,
        role,
        imgSrc,
        objectPosition,
        bioP1: bioText.includes(bioP1),
        bioP2: bioText.includes(bioP2),
        paraCount: paras.length,
        portraitOk,
        gridCols,
        sectionOverflow: (() => {
          const sec = document.querySelector(".team-surface-soft");
          return sec ? sec.scrollWidth > vw + 0.5 : false;
        })(),
        cardOutside:
          last &&
          (() => {
            const r = last.getBoundingClientRect();
            return r.left < -1 || r.right > vw + 1;
          })(),
      };
    },
    { bioP1: BIO_P1, bioP2: BIO_P2 },
  );

  if (data.cardCount !== 7) issues.push(`${w}px: expected 7 cards (${data.cardCount})`);
  if (data.name !== "Anubhav Panwar") issues.push(`${w}px: last card not Anubhav`);
  if (!data.role.includes("Digital Solutions")) issues.push(`${w}px: role wrong`);
  if (!data.imgSrc.includes("anu")) issues.push(`${w}px: anu.png not used`);
  if (!data.objectPosition.includes("10%")) {
    issues.push(`${w}px: anu focal point not set (${data.objectPosition})`);
  }
  if (!data.bioP1 || !data.bioP2) issues.push(`${w}px: bio paragraphs missing`);
  if (data.paraCount < 2) issues.push(`${w}px: expected 2 bio paragraphs`);
  if (!data.portraitOk) issues.push(`${w}px: portrait clip`);
  if (data.sectionOverflow && w >= 320) issues.push(`${w}px: team section overflow`);
  if (data.cardOutside) issues.push(`${w}px: Anubhav card outside viewport`);
  if (w >= 1024 && data.gridCols !== 2) {
    issues.push(`${w}px: expected 2-column grid (${data.gridCols})`);
  }

  await page.close();
}

const zoomPage = await browser.newPage();
await zoomPage.setViewportSize({ width: 640, height: 1200 });
await zoomPage.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
await dismiss(zoomPage);
const zoomLast = await zoomPage.evaluate(() => {
  const cards = [...document.querySelectorAll(".team-member-card")];
  const name =
    cards[cards.length - 1]?.querySelector(".team-member-card__heading-name")?.textContent?.trim() ??
    "";
  return {
    label: "1280@200%zoom",
    name,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 0.5,
  };
});
if (zoomLast.name !== "Anubhav Panwar") issues.push("1280@200%: Anubhav not last");
if (zoomLast.overflow) issues.push("1280@200%: overflow");
await zoomPage.close();

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "team-anubhav-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues }, null, 2));
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exit(1);
}
console.log("All checks passed.");
