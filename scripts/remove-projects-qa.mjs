import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 80, 120, 160, 200, 240, 280, 320, 360, 390, 430, 600, 768, 820, 1024, 1280,
  1440, 1920, 2560, 3258,
];
const PAGES = ["/", "/about/", "/services/", "/search/"];

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const issues = [];
const browser = await chromium.launch();
try {
  for (const route of PAGES) {
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await dismiss(page);
      const m = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const projectLinks = [...document.querySelectorAll("a[href]")].filter((a) =>
          /\/projects\/?$/i.test(a.getAttribute("href") ?? ""),
        );
        const navProjects = [...document.querySelectorAll("header a, footer a")].filter(
          (a) => a.textContent?.trim() === "Projects",
        );
        return {
          vw,
          scrollW,
          docOverflow: scrollW > vw + 0.5,
          projectLinkCount: projectLinks.length,
          navProjectsCount: navProjects.length,
        };
      });
      if (m.projectLinkCount) {
        issues.push(`${route}@${w}: ${m.projectLinkCount} /projects link(s) in DOM`);
      }
      if (m.navProjectsCount) {
        issues.push(`${route}@${w}: Projects in header/footer nav`);
      }
      if (m.docOverflow) {
        issues.push(`${route}@${w}: horizontal scroll ${m.scrollW}>${m.vw}`);
      }
      await page.close();
    }
  }

  const page = await browser.newPage();
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`${BASE}/projects/`, { waitUntil: "networkidle" });
  const notFound = await page.evaluate(() => {
    const title = document.title.toLowerCase();
    const h1 = document.querySelector("h1")?.textContent?.toLowerCase() ?? "";
    return title.includes("404") || h1.includes("not found") || h1.includes("404");
  });
  if (!notFound) issues.push("/projects/: did not show 404");
  await page.close();

  const sm = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  if (sm.includes("/projects/")) issues.push("sitemap.xml still contains /projects/");
} finally {
  await browser.close();
}

const out = { ok: issues.length === 0, issues };
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "remove-projects-qa-out.json"),
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));
process.exit(issues.length ? 1 : 0);
