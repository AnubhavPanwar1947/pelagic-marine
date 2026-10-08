import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];

const EXPECTED_NAMES = [
  "Nishchay Maken",
  "Bhanu Prabhakar",
  "Vinod Janardanan",
  "Capt. Vipul Negi",
  "Capt. Abhinav Upadhyay",
  "Capt. Harjit Singh Sidhu",
  "Anubhav Panwar",
];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const issues = [];
const results = [];

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const cards = [...document.querySelectorAll(".team-member-card")];
    const names = cards.map(
      (c) => c.querySelector(".team-member-card__heading-name")?.textContent?.trim() ?? "",
    );
    const imgs = cards.map((c) => {
      const img = c.querySelector("img");
      return img?.getAttribute("src") ?? img?.currentSrc ?? "";
    });
    const vinodCard = cards.find((c) => names[cards.indexOf(c)] === "Vinod Janardanan");
    const vinodScroll = Boolean(vinodCard?.querySelector(".team-member-card__bio-scroll"));
    const bhanuCard = cards.find((c) => names[cards.indexOf(c)] === "Bhanu Prabhakar");
    const bhanuScroll = Boolean(bhanuCard?.querySelector(".team-member-card__bio-scroll"));
    const portraitClip = cards.map((c) => {
      const portrait = c.querySelector(".team-member-card__portrait");
      const img = c.querySelector(".team-member-card__portrait img");
      if (!portrait || !img) return true;
      const pr = portrait.getBoundingClientRect();
      const ir = img.getBoundingClientRect();
      return ir.left >= pr.left - 1 && ir.right <= pr.right + 1 && ir.top >= pr.top - 1;
    });
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      names,
      imgs,
      vinodScroll,
      bhanuScroll,
      portraitClip,
    };
  });

  results.push({ width: w, ...data });

  if (JSON.stringify(data.names) !== JSON.stringify(EXPECTED_NAMES)) {
    issues.push(`${w}px: order mismatch: ${data.names.join(" | ")}`);
  }
  if (data.names[1] === "Bhanu Prabhakar" && !data.imgs[1]?.includes("bhanu")) {
    issues.push(`${w}px: Bhanu photo wrong at index 1`);
  }
  if (data.names[2] === "Vinod Janardanan" && !data.imgs[2]?.includes("vinod")) {
    issues.push(`${w}px: Vinod photo wrong at index 2`);
  }
  if (data.names[6] === "Anubhav Panwar" && !data.imgs[6]?.includes("anu")) {
    issues.push(`${w}px: Anubhav photo wrong at index 6`);
  }
  if (data.names.at(-1) !== "Anubhav Panwar") {
    issues.push(`${w}px: Anubhav not last`);
  }
  if (!data.vinodScroll) issues.push(`${w}px: Vinod scroll layout missing`);
  if (data.bhanuScroll) issues.push(`${w}px: Bhanu has scroll layout`);
  if (data.portraitClip.some((ok) => !ok)) issues.push(`${w}px: portrait clipping`);
  if (data.overflow && w >= 320) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const names = [...document.querySelectorAll(".team-member-card__heading-name")].map(
    (el) => el.textContent?.trim() ?? "",
  );
  return { width: "1280@200%zoom", names };
});
results.push(zoom);
if (JSON.stringify(zoom.names) !== JSON.stringify(EXPECTED_NAMES)) {
  issues.push("1280@200%: order mismatch");
}

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "team-order-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ expected: EXPECTED_NAMES, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
