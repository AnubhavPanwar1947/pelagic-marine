import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];
const JUSTIFY_MIN_PX = 640;

const PAGE_INTRO =
  "The Loadicator practice provides class-approved loading and stability tools for vessels that need reliable, auditable results at sea and ashore.";
const CARD_SUMMARY = "Class-approved loading and stability tools for vessels.";
const CLOSING =
  "From initial setup through ongoing use, we keep loadicator workflows practical for the people who depend on them every voyage.";

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
  for (const route of [
    { path: "/services/loadicator/", label: "loadicator-page" },
    { path: "/services/", label: "services-index" },
  ]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle" });
    await dismiss(page);

    const data = await page.evaluate(
      ({ routeLabel, justifyMinPx, closing }) => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const main = document.querySelector("main")?.innerText ?? "";
        let introText = "";
        let summaryText = "";
        if (routeLabel === "loadicator-page") {
          introText =
            document
              .querySelector(".service-topic-article p.type-copy")
              ?.textContent?.replace(/\s+/g, " ")
              .trim() ?? "";
          const closingEl = [...document.querySelectorAll(".service-topic-article p.type-copy")].pop();
          const closingText = closingEl?.textContent?.replace(/\s+/g, " ").trim() ?? "";
          const intro = document.querySelector(".service-topic-article p.type-copy");
          const style = intro ? getComputedStyle(intro) : null;
          const wPx = intro ? intro.getBoundingClientRect().width : 0;
          const expectJustify = wPx >= justifyMinPx - 1;
          const alignOk = intro
            ? expectJustify
              ? style.textAlign === "justify"
              : style.textAlign === "left" || style.textAlign === "start"
            : false;
          return {
            vw,
            sw,
            overflow: sw > vw + 0.5,
            introText,
            closingText,
            alignOk,
            main,
          };
        }
        const section = document.querySelector("#loadicator");
        summaryText =
          section?.querySelector(".type-copy")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
        return { vw, sw, overflow: sw > vw + 0.5, summaryText, main };
      },
      { routeLabel: route.label, justifyMinPx: JUSTIFY_MIN_PX, closing: CLOSING },
    );

    results.push({ width: w, route: route.label, ...data });

    if (data.main.includes("crews and fleet technical")) {
      issues.push(`${w}px ${route.label}: crews and fleet technical still present`);
    }
    if (data.main.includes("for for vessels")) issues.push(`${w}px ${route.label}: double for`);

    if (route.label === "loadicator-page") {
      if (data.introText !== PAGE_INTRO) issues.push(`${w}px loadicator: intro mismatch`);
      if (data.closingText !== CLOSING) issues.push(`${w}px loadicator: closing changed`);
      if (!data.alignOk) issues.push(`${w}px loadicator: intro alignment`);
    } else if (data.summaryText !== CARD_SUMMARY) {
      issues.push(`${w}px services: loadicator summary mismatch`);
    }
    if (data.overflow) issues.push(`${w}px ${route.label}: horizontal overflow`);
  }
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/services/loadicator/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => ({
  width: "1280@200%zoom",
  intro:
    document
      .querySelector(".service-topic-article p.type-copy")
      ?.textContent?.replace(/\s+/g, " ")
      .trim() ?? "",
}));
results.push({ route: "loadicator-page", ...zoom });
if (zoom.intro !== PAGE_INTRO) issues.push("1280@200% loadicator: intro mismatch");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "loadicator-copy-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.slice(0, 30).join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
