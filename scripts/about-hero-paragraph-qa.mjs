import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];
const JUSTIFY_MIN_VIEWPORT = 320;

const REQUIRED =
  "Pelagic marine was formed in year 2021 by young entrepreneurs from the shipping and engineering fraternity with wide range of experience in vessel operations, ship surveying, Engineering, offshore operations, dry & wet cargo handling. The company was formed to act as a one stop shop for various shipping industry centric solution. The core team consists of experienced master mariners, naval architects, and engineers. We provide professional services to our clients from mainline shipping, oil & gas industry, offshore industry and renewable energy sector.";

const REMOVED = [
  "consultants and surveyors",
  "Marine engineers, naval architects",
  "experienced Master Mariners.",
];
const REQUIRED_SNIPPET = "experienced master mariners, naval architects, and engineers.";

function measureParagraph(p) {
  const cs = getComputedStyle(p);
  const range = document.createRange();
  const node = [...p.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
  if (!node) {
    return {
      textAlign: cs.textAlign,
      lineCount: 0,
      fullLineRightShort: [],
      maxGapRatio: null,
      leadOverflow: false,
    };
  }
  const words = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(node.textContent))) {
    range.setStart(node, m.index);
    range.setEnd(node, m.index + m[0].length);
    const rects = [...range.getClientRects()];
    const r = rects[0];
    words.push({
      x: r.x,
      y: r.y,
      right: rects[rects.length - 1].right,
      split: rects.length > 1,
    });
  }
  const lines = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (!last || Math.abs(last.y - w.y) > 4) lines.push({ y: w.y, words: [w] });
    else last.words.push(w);
  }
  const pr = p.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const fullLineRightShort = [];
  let maxGapRatio = null;
  for (let li = 0; li < lines.length; li++) {
    const l = lines[li];
    const isLast = li === lines.length - 1;
    const right = l.words[l.words.length - 1].right;
    const short = pr.right - right;
    if (!isLast) {
      fullLineRightShort.push(+short.toFixed(1));
      const gaps = [];
      for (let i = 1; i < l.words.length; i++) {
        gaps.push(l.words[i].x - l.words[i - 1].right);
      }
      if (gaps.length >= 2) {
        const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const ratio = Math.max(...gaps) / avg;
        if (maxGapRatio === null || ratio > maxGapRatio) maxGapRatio = ratio;
      }
    }
  }
  return {
    textAlign: cs.textAlign,
    lineCount: lines.length,
    fullLineRightShort,
    maxGapRatio: maxGapRatio !== null ? +maxGapRatio.toFixed(2) : null,
    leadOverflow: pr.right > vw + 0.5 || pr.left < -0.5,
    splitWords: words.filter((w) => w.split).length,
  };
}

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
  await page.goto(`${BASE}/about/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate(
    ({ justifyMinViewport, measureParagraphSource }) => {
      const measureParagraph = new Function(
        "p",
        `return (${measureParagraphSource})(p)`,
      );
      const vw = document.documentElement.clientWidth;
      const hero = document.querySelector(".about-theme-hero");
      const heroOverflow =
        hero && hero.scrollWidth > document.documentElement.clientWidth + 0.5;
      const h1 = document.querySelector("h1");
      const p = document.querySelector(".about-theme-hero p.type-lead");
      const img = document.querySelector(
        ".about-theme-hero__media img, .about-theme-hero__media picture",
      );
      const mission = document.querySelector(".about-theme-principles");
      const text = p?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const wPx = p ? p.getBoundingClientRect().width : 0;
      const metrics = p ? measureParagraph(p) : null;
      const expectJustify = vw >= justifyMinViewport;
      const align = metrics?.textAlign ?? null;
      const alignOk = p
        ? expectJustify
          ? align === "justify"
          : align === "left" || align === "start"
        : false;
      const fs = p ? getComputedStyle(p).fontSize : null;
      const lh = p ? getComputedStyle(p).lineHeight : null;
      return {
        vw,
        heroOverflow: Boolean(heroOverflow),
        h1: h1?.textContent?.trim() ?? "",
        hasImage: Boolean(img),
        hasPrinciples: Boolean(mission),
        text,
        doubleSpace: /\s{2,}/.test(p?.textContent ?? ""),
        paragraphWidthPx: Math.round(wPx),
        alignOk,
        fs,
        lh,
        metrics,
      };
    },
    {
      justifyMinViewport: JUSTIFY_MIN_VIEWPORT,
      measureParagraphSource: measureParagraph.toString(),
    },
  );

  const normalizedRequired = REQUIRED.replace(/\s+/g, " ").trim();
  const textExact = data.text === normalizedRequired;
  const row = { width: w, ...data, textExact };
  results.push(row);

  if (!textExact) issues.push(`${w}px: paragraph text mismatch`);
  if (!data.text.includes(REQUIRED_SNIPPET)) {
    issues.push(`${w}px: missing new core team sentence`);
  }
  for (const phrase of REMOVED) {
    if (data.text.includes(phrase)) issues.push(`${w}px: still contains "${phrase}"`);
  }
  if (data.doubleSpace) issues.push(`${w}px: double spaces`);
  if (data.h1 !== "About Us") issues.push(`${w}px: heading changed`);
  if (!data.hasImage) issues.push(`${w}px: hero image missing`);
  if (!data.hasPrinciples) issues.push(`${w}px: principles section missing`);
  if (!data.alignOk) {
    issues.push(`${w}px: alignment ${data.metrics?.textAlign} (vw ${data.vw})`);
  }
  if (data.metrics?.leadOverflow) issues.push(`${w}px: hero paragraph overflows viewport`);

  if (w >= 688 && data.metrics) {
    const shorts = data.metrics.fullLineRightShort;
    if (shorts.length > 0) {
      const maxShort = Math.max(...shorts);
      if (maxShort > 4) {
        issues.push(`${w}px: full lines not flush right (max short ${maxShort}px)`);
      }
    }
    if (data.metrics.maxGapRatio !== null && data.metrics.maxGapRatio > 1.35) {
      issues.push(`${w}px: stretched word gaps (ratio ${data.metrics.maxGapRatio})`);
    }
  }

  if (w < 320 && data.metrics?.textAlign === "justify") {
    issues.push(`${w}px: justified below 320px`);
  }

  if (data.heroOverflow) issues.push(`${w}px: about hero horizontal overflow`);
}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/about/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(
  ({ justifyMinViewport, measureParagraphSource }) => {
    const measureParagraph = new Function(
      "p",
      `return (${measureParagraphSource})(p)`,
    );
    const vw = document.documentElement.clientWidth;
    const hero = document.querySelector(".about-theme-hero");
    const heroOverflow =
      hero && hero.scrollWidth > document.documentElement.clientWidth + 0.5;
    const p = document.querySelector(".about-theme-hero p.type-lead");
    const metrics = p ? measureParagraph(p) : null;
    const align = metrics?.textAlign ?? null;
    return {
      label: "1280@200%zoom",
      vw,
      heroOverflow: Boolean(heroOverflow),
      paragraphWidthPx: p ? Math.round(p.getBoundingClientRect().width) : 0,
      textAlign: align,
      alignOk:
        p && vw >= justifyMinViewport
          ? align === "justify"
          : align === "left" || align === "start",
      metrics,
    };
  },
  {
    justifyMinViewport: JUSTIFY_MIN_VIEWPORT,
    measureParagraphSource: measureParagraph.toString(),
  },
);
results.push(zoom);
if (!zoom.alignOk) issues.push(`1280@200%: alignment ${zoom.textAlign}`);
if (zoom.heroOverflow) issues.push("1280@200%: about hero horizontal overflow");
if (zoom.metrics?.leadOverflow) issues.push("1280@200%: hero paragraph overflow");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "about-hero-paragraph-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ required: REQUIRED, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
