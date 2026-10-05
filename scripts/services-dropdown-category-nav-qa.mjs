import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000/";
const routes = ["/", "/services"];
const widths = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];
const CATEGORY_LABELS = [
  "Naval Architecture",
  "Engineering",
  "Inspection",
  "Mooring & compatibility",
  "Loadicator",
];

const outPath = path.join(process.cwd(), "scripts", "services-dropdown-category-nav-qa-out.json");
const issues = [];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

function normalizePath(p) {
  return p.replace(/\/$/, "") || "/";
}

const browser = await chromium.launch({ headless: true });

for (const route of routes) {
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(new URL(route, BASE).href, { waitUntil: "networkidle" });
    await dismiss(page);

    const overflowBefore = await page.evaluate(() => ({
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
    }));
    if (overflowBefore.scrollW > overflowBefore.vw + 0.5) {
      issues.push(`${route} ${w}px: horizontal overflow before nav`);
    }

    const isMobile = w < 1024;

    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open menu"]').first();
      if (await menuBtn.count()) {
        await menuBtn.evaluate((el) => el.click());
      }
      const servicesAccordion = page
        .locator("#site-mobile-nav .site-mobile-nav-accordion > button")
        .filter({ hasText: "Services" })
        .first();
      if (!(await servicesAccordion.count())) {
        issues.push(`${route} ${w}px: mobile Services accordion not found`);
        await page.close();
        continue;
      }
      await servicesAccordion.evaluate((el) => el.click());
    } else {
      const servicesTrigger = page
        .locator(".site-header-nav button")
        .filter({ hasText: "Services" })
        .first();
      if (!(await servicesTrigger.count())) {
        issues.push(`${route} ${w}px: desktop Services control not found`);
        await page.close();
        continue;
      }
      await servicesTrigger.hover();
    }

    for (const label of CATEGORY_LABELS) {
      const pathBefore = normalizePath(new URL(page.url()).pathname);

      if (isMobile) {
        const btn = page.locator(
          `.site-mobile-nav-subgroup button:has-text("${label}")`
        ).first();
        if (!(await btn.count())) {
          issues.push(`${route} ${w}px: mobile category button missing: ${label}`);
          continue;
        }
        const hasAnchor = await btn.evaluate((el) => !!el.closest("a") || el.tagName === "A");
        if (hasAnchor) issues.push(`${route} ${w}px: mobile ${label} is a link`);
        await btn.click();
        const pathAfter = normalizePath(new URL(page.url()).pathname);
        if (pathAfter !== pathBefore) {
          issues.push(`${route} ${w}px: mobile ${label} navigated to ${pathAfter}`);
        }
        await btn.click();
      } else {
        const btn = page.locator(
          `header nav button:has(span:text-is("${label}"))`
        ).first();
        if (!(await btn.count())) {
          issues.push(`${route} ${w}px: desktop category button missing: ${label}`);
          continue;
        }
        const meta = await btn.evaluate((el) => ({
          tag: el.tagName,
          href: el.getAttribute("href"),
          expanded: el.getAttribute("aria-expanded"),
          controls: el.getAttribute("aria-controls"),
        }));
        if (meta.tag !== "BUTTON" || meta.href) {
          issues.push(`${route} ${w}px: desktop ${label} not a plain button`);
        }
        if (!meta.controls) issues.push(`${route} ${w}px: desktop ${label} missing aria-controls`);

        await btn.click();
        const pathAfterClick = normalizePath(new URL(page.url()).pathname);
        if (pathAfterClick !== pathBefore) {
          issues.push(`${route} ${w}px: desktop ${label} click navigated to ${pathAfterClick}`);
        }
        const expanded = await btn.getAttribute("aria-expanded");
        if (expanded !== "true") {
          issues.push(`${route} ${w}px: desktop ${label} aria-expanded not true after click`);
        }
        const topicLink = page
          .locator(`[id="${meta.controls}"] a[href*="/services/"]`)
          .first();
        if (await topicLink.count()) {
          const topicHref = await topicLink.getAttribute("href");
          await topicLink.click();
          const afterTopic = normalizePath(new URL(page.url()).pathname);
          if (!afterTopic.includes("/services/")) {
            issues.push(`${route} ${w}px: topic under ${label} did not navigate (${topicHref})`);
          }
          await page.goto(new URL(route, BASE).href, { waitUntil: "networkidle" });
          await dismiss(page);
          await page
            .locator(".site-header-nav button")
            .filter({ hasText: "Services" })
            .first()
            .hover();
        }
      }
    }

    const overflowAfter = await page.evaluate(() => ({
      vw: document.documentElement.clientWidth,
      scrollW: document.documentElement.scrollWidth,
    }));
    if (overflowAfter.scrollW > overflowAfter.vw + 0.5) {
      issues.push(`${route} ${w}px: horizontal overflow with dropdown open`);
    }

    await page.close();
  }
}

await browser.close();

const result = { base: BASE, issues, pass: issues.length === 0 };
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
process.exit(issues.length ? 1 : 0);
