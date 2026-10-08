import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 320, 390, 480, 640, 688, 768, 1024, 1280, 1440, 1920,
  2560,
];
const JUSTIFY_MIN_VIEWPORT = 320;

const REQUIRED =
  "Pelagic Marine brings naval architects and Master Mariners together to deliver design, engineering, and quality assurance in real marine operations. Across maritime, offshore, oil and gas, and renewables, we combine licensed analysis tools with decades of sea-going and project experience.";

const TRACK_RECORD_SNIPPET = "The breadth of vessels";
const TRACK_RECORD_REMOVED = "register of representative assignments";

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
    if (!last || Math.abs(last.y - w.y) > 8) lines.push({ y: w.y, words: [w] });
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
  await page.setViewportSize({ width: w, height: 1200 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate(
    ({ justifyMinViewport, measureParagraphSource, trackSnippet, trackRemoved }) => {
      const measureParagraph = new Function(
        "p",
        `return (${measureParagraphSource})(p)`,
      );
      const vw = document.documentElement.clientWidth;
      const section = document.querySelector(".home-theme-why");
      const sectionOverflow =
        section && section.scrollWidth > document.documentElement.clientWidth + 0.5;
      const p = section?.querySelector(".pelagic-copy-container p.type-lead");
      const eyebrow = section?.querySelector(".type-eyebrow")?.textContent?.trim() ?? "";
      const knowMore = section?.querySelector('a[href="/about/"]')?.textContent?.trim() ?? "";
      const img = section?.querySelector("img, picture");
      const track = document.querySelector(".home-track-record__description");
      const ctaLead = document.querySelector(".home-section-cta p.type-lead");
      const text = p?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const metrics = p ? measureParagraph(p) : null;
      const expectJustify = vw >= justifyMinViewport;
      const align = metrics?.textAlign ?? null;
      const alignOk = p
        ? expectJustify
          ? align === "justify"
          : align === "left" || align === "start"
        : false;
      return {
        vw,
        sectionOverflow: Boolean(sectionOverflow),
        eyebrow,
        knowMore,
        hasImage: Boolean(img),
        trackOk:
          (track?.textContent ?? "").includes(trackSnippet) &&
          !(track?.textContent ?? "").toLowerCase().includes(trackRemoved),
        ctaLeft:
          ctaLead ? getComputedStyle(ctaLead).textAlign !== "justify" : false,
        text,
        paragraphWidthPx: p ? Math.round(p.getBoundingClientRect().width) : 0,
        alignOk,
        metrics,
      };
    },
    {
      justifyMinViewport: JUSTIFY_MIN_VIEWPORT,
      measureParagraphSource: measureParagraph.toString(),
      trackSnippet: TRACK_RECORD_SNIPPET,
      trackRemoved: TRACK_RECORD_REMOVED,
    },
  );

  const textExact = data.text === REQUIRED;
  results.push({ width: w, ...data, textExact });

  if (!textExact) issues.push(`${w}px: paragraph text mismatch`);
  if (data.eyebrow !== "About us") issues.push(`${w}px: eyebrow changed (${data.eyebrow})`);
  if (!data.knowMore.includes("Know more")) issues.push(`${w}px: Know more button missing`);
  if (!data.hasImage) issues.push(`${w}px: about image missing`);
  if (!data.trackOk) issues.push(`${w}px: track record text changed`);
  if (!data.ctaLeft) issues.push(`${w}px: CTA lead justified`);
  if (!data.alignOk) {
    issues.push(`${w}px: alignment ${data.metrics?.textAlign} (vw ${data.vw})`);
  }
  if (data.metrics?.leadOverflow && w >= 320) {
    issues.push(`${w}px: paragraph overflows viewport`);
  }
  if (data.sectionOverflow && w >= 320) {
    issues.push(`${w}px: about section horizontal overflow`);
  }

  if (w >= 1024 && data.metrics) {
    const shorts = data.metrics.fullLineRightShort.filter((s) => s <= 8);
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

  if (w >= 320 && w < 1024 && data.metrics?.textAlign !== "justify") {
    issues.push(`${w}px: expected justify from 320px`);
  }

  if (w < 320 && data.metrics?.textAlign === "justify") {
    issues.push(`${w}px: justified below 320px`);
  }
}

await page.setViewportSize({ width: 640, height: 1200 });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(
  ({ justifyMinViewport, measureParagraphSource }) => {
    const measureParagraph = new Function(
      "p",
      `return (${measureParagraphSource})(p)`,
    );
    const vw = document.documentElement.clientWidth;
    const section = document.querySelector(".home-theme-why");
    const p = section?.querySelector(".pelagic-copy-container p.type-lead");
    const metrics = p ? measureParagraph(p) : null;
    const align = metrics?.textAlign ?? null;
    return {
      label: "1280@200%zoom",
      vw,
      paragraphWidthPx: p ? Math.round(p.getBoundingClientRect().width) : 0,
      textAlign: align,
      alignOk: p && vw >= justifyMinViewport ? align === "justify" : false,
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
if (zoom.metrics?.leadOverflow) issues.push("1280@200%: paragraph overflow");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "home-about-paragraph-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ required: REQUIRED, issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
