import { chromium } from "playwright";
import sharp from "sharp";

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

  const card = page.locator('a[href="/services/legal-consultancy/"]');
  await card.scrollIntoViewIfNeeded();
  await card.hover({ force: true });

  const shot = await card.locator(".home-service-tile-icon").screenshot();
  const { data, info } = await sharp(shot)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  function px(x, y) {
    const i = (y * info.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  }
  const corners = [
    px(2, 2),
    px(info.width - 3, 2),
    px(2, info.height - 3),
    px(info.width - 3, info.height - 3),
  ];
  const icy = (c) =>
    Math.abs(c[0] - 244) < 18 &&
    Math.abs(c[1] - 250) < 18 &&
    Math.abs(c[2] - 253) < 18;
  const whiteBlock = corners.filter(
    (c) => c[0] > 250 && c[1] > 250 && c[2] > 250,
  ).length;

  const meta = await page.evaluate(() => {
    const legal = document.querySelector('a[href="/services/legal-consultancy/"]');
    const img = legal?.querySelector("img");
    const box = legal?.querySelector(".home-service-tile-icon");
    const ir = img?.getBoundingClientRect();
    const br = box?.getBoundingClientRect();
    const bg = legal ? getComputedStyle(legal).backgroundColor : "";
    const inside =
      ir &&
      br &&
      ir.width > 0 &&
      ir.right <= br.right + 2 &&
      ir.left >= br.left - 2;
    const others = [...document.querySelectorAll(".home-service-tile img")].map(
      (el) => el.getAttribute("src")?.split("/").pop(),
    );
    const vw = document.documentElement.clientWidth;
    return {
      bg,
      label: legal?.querySelector(".home-service-tile-label")?.textContent?.trim(),
      href: legal?.getAttribute("href"),
      src: img?.getAttribute("src"),
      inside,
      others,
      cw: document.documentElement.clientWidth,
      sw: document.documentElement.scrollWidth,
      docOverflow: document.documentElement.scrollWidth > vw + 2,
    };
  });

  const cornersIcy = corners.filter(icy).length;
  if (meta.bg !== "rgb(244, 250, 253)") issues.push(`${w}: hover bg ${meta.bg}`);
  if (whiteBlock > 0) issues.push(`${w}: white corner block`);
  if (cornersIcy < 3) issues.push(`${w}: corners not card tint`);
  if (meta.label !== "Legal Consultancy") issues.push(`${w}: label`);
  if (!meta.src?.includes("loadicator.svg")) issues.push(`${w}: src`);
  if (!meta.inside) issues.push(`${w}: icon outside box`);
  if (meta.docOverflow && w > 50) issues.push(`${w}: doc overflow`);

  console.log(w, { ...meta, corners, cornersIcy, whiteBlock });
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
