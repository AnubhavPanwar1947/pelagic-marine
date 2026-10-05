import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const outDir = path.join(process.cwd(), "scripts", "footer-copyright-screenshots");
fs.mkdirSync(outDir, { recursive: true });

const WIDTHS = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440,
  1920, 2560, 3258,
];

const SHOT_WIDTHS = [50, 320, 768, 1024, 1440, 1920, 2560, 3258];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

async function measureFooter(page) {
  return page.evaluate(() => {
    const footer = document.querySelector("footer");
    const text = footer?.innerText ?? "";
    const copyrightRe =
      /©|All rights reserved|Pelagic Marine LLC\.\s*All rights/i;
    const children = footer ? [...footer.children] : [];
    const last = children[children.length - 1];
    const lastBorder =
      last && footer
        ? getComputedStyle(last).borderTopWidth !== "0px" &&
          getComputedStyle(last).borderTopStyle !== "none"
        : false;
    const emptyBar =
      last &&
      last.textContent?.trim() === "" &&
      getComputedStyle(last).borderTopWidth !== "0px";
    const rect = footer?.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    return {
      vw,
      scrollW,
      docOverflow: scrollW > vw + 0.5,
      footerRight: rect?.right ?? null,
      footerOverflow: rect ? rect.right > vw + 0.5 : false,
      hasCopyrightText: copyrightRe.test(text),
      hasAllRights: /All rights reserved/i.test(text),
      lastChildTag: last?.tagName ?? null,
      lastChildEmpty: last ? last.textContent?.trim() === "" : false,
      lastChildHasTopBorder: lastBorder,
      emptyBorderBar: emptyBar,
      hasLinks: /Privacy policy/i.test(text),
      hasContact: /@/i.test(text),
    };
  });
}

async function scrollToFooter(page) {
  await page.evaluate(() => {
    const f = document.querySelector("footer");
    f?.scrollIntoView({ block: "end" });
  });
  await page.waitForTimeout(150);
}

async function shotFooter(page, label) {
  const footer = page.locator("footer");
  await footer.screenshot({
    path: path.join(outDir, `${label}.png`),
  });
}

const results = [];
const issues = [];

async function runRoute(browser, route, slug) {
  for (const w of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await dismiss(page);
    await scrollToFooter(page);
    const m = await measureFooter(page);
    results.push({ route, width: w, ...m });
    if (m.hasCopyrightText || m.hasAllRights) {
      issues.push(`${slug}@${w}: copyright text in footer`);
    }
    if (m.emptyBorderBar || (m.lastChildHasTopBorder && m.lastChildEmpty)) {
      issues.push(`${slug}@${w}: empty bordered bar at footer bottom`);
    }
    if (m.docOverflow) issues.push(`${slug}@${w}: horizontal scroll (${m.scrollW}>${m.vw})`);
    if (m.footerOverflow) issues.push(`${slug}@${w}: footer extends past viewport`);
    if (!m.hasLinks || !m.hasContact) {
      issues.push(`${slug}@${w}: footer content missing`);
    }
    await page.close();
  }

  for (const w of SHOT_WIDTHS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: Math.max(900, w < 400 ? 1200 : 900) });
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await dismiss(page);
    await scrollToFooter(page);
    await shotFooter(page, `${slug}-${w}`);
    await page.close();
  }
}

async function zoomCase(browser, route, slug) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 140, height: 900 });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await dismiss(page);
  await scrollToFooter(page);
  const m = await measureFooter(page);
  results.push({ route, width: "200pct-140", ...m });
  if (m.hasCopyrightText || m.docOverflow) {
    issues.push(`${slug}@200pct: copyright or overflow`);
  }
  await shotFooter(page, `${slug}-200pct-zoom`);
  await page.close();
}

const browser = await chromium.launch();
try {
  await runRoute(browser, "/", "home");
  await runRoute(browser, "/about/", "about");
  await zoomCase(browser, "/", "home");
  await zoomCase(browser, "/about/", "about");
} finally {
  await browser.close();
}

const out = { ok: issues.length === 0, issues, results };
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "footer-copyright-qa-out.json"),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify({ ok: out.ok, issueCount: issues.length, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
