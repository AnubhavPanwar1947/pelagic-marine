import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 320, 390, 480, 640, 688, 768, 1024, 1280, 1440, 1920,
  2560,
];

const HERO =
  "A team that has a unique blend of engineering application and operational excellence, built on years of varied experience.";
const HERO_TITLE = "Naval architects and Master Mariners";
const LINE1_WIDE =
  "A team that has a unique blend of engineering application and";
const LINE2_WIDE =
  "operational excellence, built on years of varied experience.";
const LINES_320 = [
  "A team that has a unique blend of",
  "engineering application and",
  "operational excellence, built on",
  "years of varied experience.",
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
let refContainerMt = null;

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
  await dismiss(page);

  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const h1 = document.querySelector(".team-hero-shell h1");
    const container = document.querySelector(
      ".team-hero-shell .pelagic-copy-container",
    );
    const p = document.querySelector(".team-hero-shell p.type-lead");
    const heroText = p?.textContent?.replace(/\s+/g, " ").trim() ?? "";
    const titleGap = p && h1
      ? Math.round(p.getBoundingClientRect().top - h1.getBoundingClientRect().bottom)
      : null;
    const analyze = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const range = document.createRange();
      const node = el.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) return null;
      const text = node.textContent;
      const words = [];
      const re = /\S+/g;
      let m;
      while ((m = re.exec(text))) {
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const rects = [...range.getClientRects()];
        const r = rects[0];
        const last = rects[rects.length - 1];
        words.push({
          w: m[0],
          x: r.x,
          y: r.y,
          right: last.right,
          split: rects.length > 1,
        });
      }
      const lines = [];
      for (const word of words) {
        const last = lines[lines.length - 1];
        if (!last || Math.abs(last.y - word.y) > 4) lines.push({ y: word.y, words: [word] });
        else last.words.push(word);
      }
      const lineTexts = lines.map((l) => l.words.map((x) => x.w).join(" "));
      const lineGaps = lines.map((l) => {
        const gaps = [];
        for (let i = 1; i < l.words.length; i++) {
          gaps.push(l.words[i].x - l.words[i - 1].right);
        }
        if (!gaps.length) return { avg: null, max: null };
        const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        return { avg, max: Math.max(...gaps) };
      });
      const pr = el.getBoundingClientRect();
      return {
        textAlign: cs.textAlign,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        marginTop: cs.marginTop,
        lineCount: lines.length,
        lines: lineTexts,
        lineGaps,
        splitWords: words.filter((x) => x.split).map((x) => x.w),
        leadOverflow: pr.right > vw + 0.5 || pr.left < -0.5,
        width: Math.round(pr.width),
      };
    };

    const lead = analyze(p);
    return {
      vw,
      h1: h1?.textContent?.trim() ?? "",
      heroText,
      titleGap,
      containerMt: container ? getComputedStyle(container).marginTop : null,
      lead,
    };
  });

  results.push({ width: w, ...data });

  if (data.h1 !== HERO_TITLE) issues.push(`${w}px: hero title changed`);
  if (data.heroText !== HERO) issues.push(`${w}px: hero wording changed`);
  if (!data.lead) issues.push(`${w}px: hero lead missing`);
  else {
    const align = data.lead.textAlign;
    if (align !== "left" && align !== "start") {
      issues.push(`${w}px: hero text-align ${align}`);
    }
    if (data.lead.leadOverflow) issues.push(`${w}px: hero lead overflows viewport`);
    if (w >= 688) {
      if (data.lead.lineCount !== 2) {
        issues.push(`${w}px: expected 2 lines at wide, got ${data.lead.lineCount}`);
      }
      if (data.lead.lines[0] !== LINE1_WIDE) {
        issues.push(`${w}px: line 1 break mismatch`);
      }
      if (data.lead.lines[1] !== LINE2_WIDE) {
        issues.push(`${w}px: line 2 break mismatch`);
      }
      const g0 = data.lead.lineGaps[0];
      const g1 = data.lead.lineGaps[1];
      if (g0?.avg != null && g1?.avg != null) {
        const ratio = g0.avg / g1.avg;
        if (ratio > 1.35 || g0.max > 12) {
          issues.push(
            `${w}px: uneven word gaps (L1 avg ${g0.avg.toFixed(1)} vs L2 ${g1.avg.toFixed(1)})`,
          );
        }
      }
    }
    if (w === 320) {
      if (data.lead.lineCount !== 4) {
        issues.push(`${w}px: expected 4 lines, got ${data.lead.lineCount}`);
      }
      if (data.lead.splitWords.length > 0) {
        issues.push(`${w}px: split words at 320: ${data.lead.splitWords.join(", ")}`);
      }
      for (let i = 0; i < LINES_320.length; i++) {
        if (data.lead.lines[i] !== LINES_320[i]) {
          issues.push(`${w}px: line ${i + 1} wrap mismatch`);
          break;
        }
      }
    }
    if (w === 640) {
      if (data.lead.lineCount !== 2) {
        issues.push(`${w}px: expected 2 lines at 640`);
      }
      const g0 = data.lead.lineGaps[0];
      const g1 = data.lead.lineGaps[1];
      if (g0?.avg != null && g1?.avg != null && g0.avg / g1.avg > 1.35) {
        issues.push(`${w}px: uneven gaps at 640`);
      }
    }
  }

  if (w === 640 && data.containerMt && refContainerMt === null) {
    refContainerMt = data.containerMt;
  }
  if (refContainerMt && data.containerMt && data.containerMt !== refContainerMt) {
    issues.push(`${w}px: title-to-lead margin changed (${data.containerMt})`);
  }

}

await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/team/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const p = document.querySelector(".team-hero-shell p.type-lead");
  const vw = document.documentElement.clientWidth;
  const range = document.createRange();
  const node = p?.firstChild;
  if (!p || !node) return { width: "1280@200%zoom", ok: false };
  const words = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(node.textContent))) {
    range.setStart(node, m.index);
    range.setEnd(node, m.index + m[0].length);
    const rects = [...range.getClientRects()];
    const r = rects[0];
    const last = rects[rects.length - 1];
    words.push({ x: r.x, y: r.y, right: last.right });
  }
  const lines = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (!last || Math.abs(last.y - w.y) > 4) lines.push({ y: w.y, parts: [w] });
    else last.parts.push(w);
  }
  const lineGaps = lines.map((l) => {
    const gaps = [];
    for (let i = 1; i < l.parts.length; i++) {
      gaps.push(l.parts[i].x - l.parts[i - 1].right);
    }
    if (!gaps.length) return null;
    return gaps.reduce((a, b) => a + b, 0) / gaps.length;
  });
  const align = getComputedStyle(p).textAlign;
  const ratio =
    lineGaps[0] != null && lineGaps[1] != null ? lineGaps[0] / lineGaps[1] : null;
  const pr = p.getBoundingClientRect();
  return {
    width: "1280@200%zoom",
    vw,
    textAlign: align,
    lineCount: lines.length,
    gapRatio: ratio,
    leadOverflow: pr.right > vw + 0.5,
    heroText: p.textContent?.replace(/\s+/g, " ").trim() ?? "",
  };
});
results.push(zoom);
if (zoom.heroText !== HERO) issues.push("1280@200%: hero wording changed");
if (zoom.textAlign !== "left" && zoom.textAlign !== "start") {
  issues.push("1280@200%: hero not left-aligned");
}
if (zoom.lineCount !== 2) issues.push("1280@200%: expected 2 lines");
if (zoom.gapRatio != null && zoom.gapRatio > 1.35) {
  issues.push("1280@200%: uneven word gaps");
}
if (zoom.leadOverflow) issues.push("1280@200%: hero lead overflow");

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "team-hero-lead-spacing-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, refContainerMt, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
