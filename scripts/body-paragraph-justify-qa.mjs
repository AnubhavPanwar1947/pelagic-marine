import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 279, 289, 290, 291, 320, 360, 390, 430, 480, 600, 640, 768,
  820, 1024, 1280, 1440, 1920, 2560, 3258,
];

const HOME_ABOUT_EXACT =
  "Pelagic Marine brings naval architects and Master Mariners together to deliver design, engineering, and quality assurance in real marine operations. Across maritime, offshore, oil and gas, and renewables, we combine licensed analysis tools with decades of sea-going and project experience.";

const JUSTIFY_CONTAINER_MIN_PX = 640;
const SHOT_WIDTHS = [320, 768, 1024, 1280, 1440];
const shotDir = path.join(process.cwd(), "scripts", "body-paragraph-justify-screenshots");
fs.mkdirSync(shotDir, { recursive: true });

const PAGES = [
  { path: "/", label: "home", paragraphHint: "home-about" },
  { path: "/", label: "home-track", paragraphHint: "track-record" },
  { path: "/about/", label: "about" },
  { path: "/services/naval-architecture-design/", label: "services" },
  { path: "/team/", label: "team" },
  { path: "/news/", label: "blog" },
  { path: "/privacy/", label: "legal" },
];

const BODY_SELECTOR = [
  "p.type-lead",
  "p.type-body",
  "p.type-copy",
  "p.type-copy-muted",
  ".legal-prose p",
  "main p.text-pelagic-copy",
  ".home-track-record__description",
  ".team-page .team-member-card__bio",
  ".service-topic-article p.type-copy",
].join(", ");

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

function pickParagraph(pagePath, hint) {
  if (pagePath === "/" && hint === "home-about") {
    return `p.type-lead`;
  }
  if (pagePath === "/" && hint === "track-record") {
    return `.home-track-record__description`;
  }
  return BODY_SELECTOR;
}

async function measure(page, pagePath, hint, width) {
  return page.evaluate(
    ({ pagePath, hint, width, homeAboutExact, bodySelector, justifyMinPx }) => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const overflow = sw > vw + 0.5;

      let el = null;
      if (pagePath === "/" && hint === "home-about") {
        const leads = [...document.querySelectorAll("main p.type-lead, .home-page p.type-lead")];
        el =
          leads.find((p) => p.textContent?.includes("Pelagic Marine brings naval architects")) ??
          leads[0] ??
          null;
      } else if (pagePath === "/" && hint === "track-record") {
        el = document.querySelector(".home-track-record__description");
      } else {
        const candidates = [...document.querySelectorAll(bodySelector)].filter(
          (node) => !node.closest("header, nav, footer, form, button, label"),
        );
        el = candidates[0] ?? null;
      }

      const heading = document.querySelector("main h1, main h2");
      const headingStyle = heading ? getComputedStyle(heading) : null;
      const pStyle = el ? getComputedStyle(el) : null;

      const text = el?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const doubleSpace = /\s{2,}/.test(el?.textContent ?? "");
      const aboutExact =
        hint === "home-about" ? text === homeAboutExact.replace(/\s+/g, " ").trim() : true;

      const paragraphWidth = el ? el.getBoundingClientRect().width : 0;
      const expectJustify = paragraphWidth >= justifyMinPx - 1;
      const align = pStyle?.textAlign ?? null;
      const alignLast = pStyle?.textAlignLast ?? null;

      const alignOk = el
        ? expectJustify
          ? align === "justify" && (alignLast === "left" || alignLast === "auto")
          : align === "left" || align === "start"
        : false;

      const headingNotJustified =
        !headingStyle || headingStyle.textAlign !== "justify";

      return {
        vw,
        sw,
        overflow,
        found: Boolean(el),
        textAlign: align,
        textAlignLast: alignLast,
        alignOk,
        headingNotJustified,
        aboutExact,
        doubleSpace,
        sampleText: text.slice(0, 80),
        paragraphWidthPx: Math.round(paragraphWidth),
      };
    },
    {
      pagePath,
      hint,
      width,
      homeAboutExact: HOME_ABOUT_EXACT,
      bodySelector: BODY_SELECTOR,
      justifyMinPx: JUSTIFY_CONTAINER_MIN_PX,
    },
  );
}

const issues = [];
const results = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  for (const { path: pagePath, label, paragraphHint } of PAGES) {
    await page.goto(`${BASE}${pagePath}`, { waitUntil: "networkidle" });
    await dismiss(page);
    const data = await measure(page, pagePath, paragraphHint ?? "default", w);
    const row = { width: w, page: label, ...data };
    results.push(row);
    if (!data.found) issues.push(`${w}px ${label}: no body paragraph found`);
    if (data.overflow) issues.push(`${w}px ${label}: horizontal overflow`);
    if (!data.alignOk) {
      issues.push(
        `${w}px ${label}: align expected ${w >= 320 ? "justify/last-left" : "left"}, got ${data.textAlign}/${data.textAlignLast}`,
      );
    }
    if (!data.headingNotJustified) issues.push(`${w}px ${label}: heading is justified`);
    if (paragraphHint === "home-about" && !data.aboutExact) {
      issues.push(`${w}px home-about: copy mismatch`);
    }
    if (data.doubleSpace) issues.push(`${w}px ${label}: double spaces in paragraph`);

    if (
      paragraphHint === "home-about" &&
      SHOT_WIDTHS.includes(w) &&
      data.found
    ) {
      const el = page.locator(
        'p.type-lead:has-text("Pelagic Marine brings naval architects")',
      );
      await el.scrollIntoViewIfNeeded();
      await el.screenshot({
        path: path.join(shotDir, `home-about-${w}.png`),
      });
    }
  }
}

// 1280px at 200% zoom (layout viewport 640)
await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoomRow = await measure(page, "/", "home-about", 640);
zoomRow.width = "1280@200%zoom";
zoomRow.note = "viewport 640px (200% of 1280)";
results.push({ page: "home-about-zoom", ...zoomRow });
if (!zoomRow.alignOk) issues.push(`1280@200% home-about: align ${zoomRow.textAlign}`);

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "body-paragraph-justify-qa-out.json");
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      threshold: {
        type: "container-inline-size",
        minPx: JUSTIFY_CONTAINER_MIN_PX,
        css: "40rem on named container pelagic-copy",
        fallback: "48rem viewport when container queries unsupported",
      },
      screenshotDir: shotDir,
      issues,
      results,
    },
    null,
    2,
  ),
);

console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.slice(0, 40).join("\n"));
  if (issues.length > 40) console.log(`... and ${issues.length - 40} more`);
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
