import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];

const HERO =
  "A team that has a unique blend of engineering application and operational excellence, built on years of varied experience.";
const HERO_TITLE = "Naval architects and Master Mariners";
const NISHCHAY_ROLE = "Co-Founder & Director";
const NISHCHAY_BIO =
  "Nishchay co-founded Pelagic Marine to tackle operational challenges that most firms cannot, using engineering and design. With more than two decades of experience, including over a decade at sea on tankers, he specialises in project cargo carriage and stability. That work inspired UMISTAB-X, a specialised loadicator that performs stability calculations for deck loading on conventional bulk carriers. His wider expertise spans clean fuels, regulatory compliance, audits and inspections, loss prevention, and incident investigation for leading P&I Clubs.";
const BHANU_ROLE = "Co-Founder & Head of Engineering and Design";

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
    const h1 = document.querySelector(".team-page h1, main h1");
    const heroLead = document.querySelector(
      ".team-page .team-hero-shell .type-lead",
    );
    const heroText = heroLead?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const heroStyle = heroLead ? getComputedStyle(heroLead) : null;
    const heroAlignOk = heroLead
      ? heroStyle.textAlign === "left" || heroStyle.textAlign === "start"
      : false;
    const cards = [...document.querySelectorAll(".team-member-card")];
    const nishchay = cards.find((c) => c.textContent?.includes("Nishchay Maken"));
    const bhanu = cards.find((c) => c.textContent?.includes("Bhanu Prabhakar"));
    const nishRole =
      nishchay?.querySelector(".team-member-card__body > p")?.textContent?.trim() ?? "";
    const nishBio = [...(nishchay?.querySelectorAll(".team-member-card__bio") ?? [])]
      .map((p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "")
      .join(" ");
    const bhanuRole =
      bhanu?.querySelector(".team-member-card__body > p")?.textContent?.trim() ?? "";
    const main = document.querySelector("main")?.innerText ?? "";
    const h1Justified = h1 ? getComputedStyle(h1).textAlign === "justify" : false;
    const nishRoleEl = nishchay?.querySelector(".team-member-card__body > p");
    const roleJustified = nishRoleEl
      ? getComputedStyle(nishRoleEl).textAlign === "justify"
      : false;
    return {
      vw,
      sw,
      overflow: sw > vw + 0.5,
      h1: h1?.textContent?.trim() ?? "",
      heroText,
      heroAlignOk,
      nishRole,
      nishBio,
      bhanuRole,
      main,
      h1Justified,
      roleJustified,
    };
  });

  results.push({ width: w, ...data });

  if (data.h1 !== HERO_TITLE) issues.push(`${w}px: hero title changed`);
  if (data.heroText !== HERO) issues.push(`${w}px: hero description mismatch`);
  if (data.nishRole !== NISHCHAY_ROLE) issues.push(`${w}px: Nishchay role mismatch`);
  if (data.nishBio !== NISHCHAY_BIO) issues.push(`${w}px: Nishchay bio mismatch`);
  if (data.bhanuRole !== BHANU_ROLE) issues.push(`${w}px: Bhanu role changed`);
  if (data.main.includes("designed structure and stood on deck")) {
    issues.push(`${w}px: old hero still present`);
  }
  if (data.main.includes("Founder & Director")) issues.push(`${w}px: Founder & Director still present`);
  if (data.h1Justified || data.roleJustified) issues.push(`${w}px: heading/role justified`);
  if (!data.heroAlignOk) issues.push(`${w}px: hero alignment`);
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const heroLead = document.querySelector(".team-page .team-hero-shell .type-lead");
  const style = heroLead ? getComputedStyle(heroLead) : null;
  return {
    width: "1280@200%zoom",
    hero: heroLead?.textContent?.replace(/\s+/g, " ").trim() ?? "",
    textAlign: style?.textAlign ?? null,
    alignOk:
      style?.textAlign === "left" || style?.textAlign === "start",
  };
});
results.push(zoom);
if (zoom.hero !== HERO) issues.push("1280@200%: hero mismatch");
if (!zoom.alignOk) issues.push("1280@200%: hero not left-aligned");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "team-page-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.slice(0, 30).join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
