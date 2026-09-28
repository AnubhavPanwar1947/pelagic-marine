import { chromium } from "playwright";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

async function headerText(page) {
  const header = page.locator("header");
  return (await header.innerText()).replace(/\s+/g, " ");
}

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const mobileWidths = [50, 190, 320, 375, 480, 640, 768];
const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);

  const navDecarbLink = await page.evaluate(() => {
    const header = document.querySelector("header");
    const links = header
      ? [...header.querySelectorAll("a[href*='decarbonization']")]
      : [];
    return links.map((a) => a.textContent?.trim());
  });

  const ht = await headerText(page);
  const mobileNavText = await page.evaluate(
    () => document.getElementById("site-mobile-nav")?.innerText ?? "",
  );
  const combined = `${ht} ${mobileNavText}`;
  const hasDecarb =
    /\bDecarb\b/i.test(combined) || /\bDecarbonization\b/i.test(combined);

  const r = await page.evaluate(() => {
    const header = document.querySelector("header");
    const vw = document.documentElement.clientWidth;
    const hr = header?.getBoundingClientRect();
    const overflow =
      hr && (hr.right > vw + 2 || hr.left < -2);
    return {
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth > vw + 2,
      headerOverflow: overflow,
    };
  });

  if (hasDecarb) issues.push(`${w}: Decarb/Decarbonization in nav`);
  if (navDecarbLink.length) issues.push(`${w}: decarbonization links in header`);
  if (r.headerOverflow) issues.push(`${w}: header overflows viewport`);
  if (r.docOverflow && w > 50) issues.push(`${w}: doc overflow`);

  console.log(`${w}px`, { hasDecarb, navDecarbLink, ...r, sample: ht.slice(0, 80) });
  await page.close();
}

for (const path of ["/", "/team/"]) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 50, height: 900 });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
  await dismiss(page);
  const m = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  console.log(`50px ${path}`, m);
  await page.close();
}

await browser.close();
if (issues.length) {
  console.error("ISSUES:", issues);
  process.exit(1);
}
