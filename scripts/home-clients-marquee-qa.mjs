import { chromium } from "playwright";

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const EXPECTED = [
  "KOTUG",
  "ISHIMA",
  "VIRIDIAN MARITIME",
  "OSM Thome",
  "GOLDEN OCEAN",
  "BSM",
  "Shipside Brokers",
  "SYNERGY GROUP",
];

const OLD = [
  "Gulf Star Shipping",
  "Horizon Tankers",
  "Eastern Bulk Carriers",
];

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const browser = await chromium.launch({ headless: true });
const issues = [];

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await dismiss(page);

  const r = await page.evaluate(
    ({ expected, old }) => {
      const section = document.querySelector(".home-section-clients");
      const chips = section
        ? [...section.querySelectorAll(".pelagic-client-marquee-track span")]
        : [];
      const unique = [...new Set(chips.map((c) => c.textContent?.trim()))];
      const allExpected = expected.every((n) => unique.includes(n));
      const onlyExpected = unique.every((n) => expected.includes(n));
      const oldGone = !old.some((n) => unique.includes(n));
      const unreadable = chips.filter((c) => {
        const r = c.getBoundingClientRect();
        const cs = getComputedStyle(c);
        return (
          r.width > 0 &&
          (parseFloat(cs.fontSize) < 8 || c.scrollHeight > r.height + 8)
        );
      }).length;
      const vw = document.documentElement.clientWidth;
      const bodyOverflow =
        document.documentElement.scrollWidth > vw + 2;
      return {
        uniqueCount: unique.length,
        unique,
        allExpected,
        onlyExpected,
        oldGone,
        unreadableChips: unreadable,
        cw: document.documentElement.clientWidth,
        sw: document.documentElement.scrollWidth,
        bodyOverflow,
      };
    },
    { expected: EXPECTED, old: OLD },
  );

  if (!r.allExpected || !r.onlyExpected) issues.push(`${w}: wrong client names`);
  if (!r.oldGone) issues.push(`${w}: old placeholders still visible`);
  if (r.unreadableChips > 0) issues.push(`${w}: unreadable chips`);
  if (r.bodyOverflow && w > 50) issues.push(`${w}: doc overflow`);

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
