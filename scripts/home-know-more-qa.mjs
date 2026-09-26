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
    const btn = section?.querySelector('a[href="/about/"], a[href="/about"]');
    const bg = btn ? getComputedStyle(btn).backgroundColor : "";
    const color = btn ? getComputedStyle(btn).color : "";
    const grid = section?.querySelector(".grid");
    const br = btn?.getBoundingClientRect();
    const gr = grid?.getBoundingClientRect();
    const overflowBtn =
      br && gr && (br.right > gr.right + 4 || br.left < gr.left - 4);
    const eyebrow = section?.querySelector(".type-eyebrow");
    return {
      label: btn?.textContent?.trim(),
      okLabel: btn?.textContent?.trim() === "Know more",
      okPrimary:
        bg === "rgb(47, 168, 238)" && color === "rgb(255, 255, 255)",
      btnHref: btn?.getAttribute("href"),
      eyebrow: eyebrow?.textContent?.trim(),
      overflowBtn,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    };
  });

  if (!r.okLabel) issues.push(`${w}: button label wrong`);
  if (!r.okPrimary) issues.push(`${w}: not primary style`);
  if (r.btnHref !== "/about/" && r.btnHref !== "/about")
    issues.push(`${w}: wrong href`);
  if (!/about us/i.test(r.eyebrow || "")) issues.push(`${w}: eyebrow missing`);
  if (r.overflowBtn) issues.push(`${w}: button outside column`);
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
