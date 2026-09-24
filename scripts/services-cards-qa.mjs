import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 768, 960, 1024, 1280, 1440];
const url = "http://localhost:3000/services/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(url, { waitUntil: "networkidle" });
  if (w === widths[0]) {
    const accept = page.getByRole("button", { name: /accept|agree|allow/i });
    if (await accept.count()) {
      await accept.first().click({ timeout: 2000 }).catch(() => {});
    }
  }
  const data = await page.evaluate(() => {
    const section = document.querySelector(".services-page section");
    const outer = [...document.querySelectorAll(".services-page article.card-maritime")];
    const items = [
      ...document.querySelectorAll(".services-page article.card-maritime li a.card-maritime"),
    ];
    const panels = [...document.querySelectorAll(".services-category-panel")];
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const sm = 640;
    const lg = 1024;
    const firstOuter = outer[0];
    const list = firstOuter?.querySelector("ul");
    const innerGrid = firstOuter?.querySelector("div.grid");
    const itemCols = list
      ? getComputedStyle(list).gridTemplateColumns.split(" ").filter(Boolean).length
      : 0;
    const expectedItemCols = vw >= sm ? 2 : 1;
    const outerCols = innerGrid
      ? getComputedStyle(innerGrid).gridTemplateColumns.split(" ").filter(Boolean)
          .length
      : 0;

    function cardStyle(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        bg: cs.backgroundColor,
        bgImage: cs.backgroundImage,
        rect: [Math.round(r.width), Math.round(r.height)],
      };
    }

    const outerOk = outer.every((el) => {
      const cs = getComputedStyle(el);
      return (
        cs.backgroundImage === "none" &&
        cs.backgroundColor === "rgb(255, 255, 255)"
      );
    });
    const itemsOk = items.every((el) => {
      const cs = getComputedStyle(el);
      return (
        cs.backgroundImage === "none" &&
        cs.backgroundColor === "rgb(255, 255, 255)"
      );
    });
    const panelsOk = panels.every((el) => {
      const cs = getComputedStyle(el);
      return (
        cs.backgroundColor === "rgb(255, 255, 255)" &&
        cs.backgroundImage === "none" &&
        cs.color !== "rgb(255, 255, 255)"
      );
    });
    const sectionBg = section ? getComputedStyle(section).backgroundImage : "";

    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      outerCount: outer.length,
      itemCount: items.length,
      panelCount: panels.length,
      outerCols,
      itemCols,
      itemColsOk: itemCols === expectedItemCols,
      outer: cardStyle(outer[0]),
      item: cardStyle(items[0]),
      panel: panels[0]
        ? {
            bg: getComputedStyle(panels[0]).backgroundColor,
            bgImage: getComputedStyle(panels[0]).backgroundImage,
            color: getComputedStyle(panels[0]).color,
          }
        : null,
      outerOk,
      itemsOk,
      panelsOk,
      sectionHasWash: sectionBg !== "none" && sectionBg !== "",
      cardMotion: outer[0]
        ? getComputedStyle(outer[0]).transitionDuration
        : "",
    };
  });

  await page
    .locator(".services-page article.card-maritime li a.card-maritime")
    .first()
    .hover({ force: true });
  await page.waitForTimeout(200);
  const hover = await page.evaluate(() => {
    const item = document.querySelector(
      ".services-page article.card-maritime li a.card-maritime",
    );
    const outer = document.querySelector(".services-page article.card-maritime");
    const csItem = item ? getComputedStyle(item) : null;
    const csOuter = outer ? getComputedStyle(outer) : null;
    return {
      itemHover: csItem
        ? { bg: csItem.backgroundColor, bgImage: csItem.backgroundImage }
        : null,
      outerHover: csOuter
        ? { bg: csOuter.backgroundColor, bgImage: csOuter.backgroundImage }
        : null,
    };
  });

  out.push({ targetWidth: w, ...data, hover });
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
