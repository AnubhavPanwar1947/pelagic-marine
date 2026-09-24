import { chromium } from "playwright";
import path from "node:path";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 768, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
const tile = page.getByRole("link", { name: /Naval Architecture/i });
await tile.scrollIntoViewIfNeeded();
const box = await tile.locator(".home-service-tile-icon__img").boundingBox();
if (box) {
  await page.screenshot({
    path: path.join(process.cwd(), "scripts/_naval-icon-768.png"),
    clip: {
      x: Math.max(0, box.x - 4),
      y: Math.max(0, box.y - 4),
      width: box.width + 8,
      height: box.height + 8,
    },
  });
  console.log("saved scripts/_naval-icon-768.png", box);
}
await browser.close();
