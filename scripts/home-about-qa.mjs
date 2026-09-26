import { chromium } from "playwright";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);

  const r = await page.evaluate(() => {
    const section = document.querySelector(".home-theme-why");
    const desc = section?.querySelector(".type-copy, p.type-lead, [class*='description']");
    const paragraphs = section
      ? [...section.querySelectorAll("p")].map((p) => p.textContent?.trim())
      : [];
    const EXPECT =
      "Pelagic Marine Solutions brings naval architects and Master Mariners together to deliver engineering, analysis, design, audit, and inspection grounded in real marine operations. Across maritime, offshore, oil and gas, and renewables, we combine licensed analysis tools with decades of sea-going and project experience.";
    const aboutText = paragraphs.find((t) =>
      t?.includes("Pelagic Marine Solutions brings"),
    );
    const btn = section?.querySelector('a[href="/about/"], a[href="/about"]');
    const grid = section?.querySelector(".grid");
    const gr = grid?.getBoundingClientRect();
    const pr = desc?.getBoundingClientRect() ?? aboutText
      ? section?.querySelector("p")?.getBoundingClientRect()
      : null;
    const pEl =
      [...(section?.querySelectorAll("p") ?? [])].find((p) =>
        p.textContent?.includes("audit, and inspection"),
      );
    const pR = pEl?.getBoundingClientRect();
    const gR = grid?.getBoundingClientRect();
    const overflowP =
      pR && gR && (pR.right > gR.right + 4 || pR.left < gR.left - 4);
    const bg = btn ? getComputedStyle(btn).backgroundColor : "";
    const color = btn ? getComputedStyle(btn).color : "";
    return {
      aboutText: aboutText?.slice(0, 120),
      textMatch: aboutText === EXPECT,
      noAmpersand: !aboutText?.includes("&"),
      btnHref: btn?.getAttribute("href"),
      okPrimary:
        bg === "rgb(47, 168, 238)" && color === "rgb(255, 255, 255)",
      overflowP,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    };
  });

  if (!r.textMatch) issues.push(`${w}: paragraph text mismatch`);
  if (!r.noAmpersand) issues.push(`${w}: ampersand in about text`);
  if (!r.okPrimary) issues.push(`${w}: About us button not primary`);
  if (r.btnHref !== "/about/" && r.btnHref !== "/about")
    issues.push(`${w}: wrong about href`);
  if (r.overflowP) issues.push(`${w}: about copy outside column`);
  if (r.docOverflow && w > 50) issues.push(`${w}: doc overflow`);

  console.log(`${w}px`, r);
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
