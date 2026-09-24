import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const url = "http://localhost:3000/team/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(url, { waitUntil: "networkidle" });
  const data = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".team-member-card")];
    const grid = cards[0]?.parentElement;
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const lg = 1024;
    const expectedCols = vw >= lg ? 2 : 1;
    const gc = grid
      ? getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean)
          .length
      : 0;
    const sm = 640;
    const imgs = cards.map((card) => {
      const img = card.querySelector("img");
      const portrait = card.querySelector(".team-member-card__portrait");
      const pr = portrait?.getBoundingClientRect();
      const ir = img?.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      const bottomAligned =
        vw >= sm && pr
          ? Math.abs(pr.bottom - cr.bottom) <= 2
          : null;
      const src = img
        ? (img.currentSrc || img.src).split("?")[0].replace(location.origin, "")
        : "";
      const missing = img?.hasAttribute("data-missing-image");
      const fit = img ? getComputedStyle(img).objectFit : "";
      const pos = img ? getComputedStyle(img).objectPosition : "";
      const inside =
        img &&
        ir &&
        pr &&
        ir.left >= pr.left - 1 &&
        ir.right <= pr.right + 1 &&
        ir.top >= pr.top - 1 &&
        ir.bottom <= pr.bottom + 1;
      const aspectPortrait = pr && pr.width > 0 ? pr.height / pr.width : 0;
      return {
        src,
        pathOk: src.includes("/images/owned/team/"),
        complete: img?.complete,
        missing,
        objectFit: fit,
        objectPosition: pos,
        portraitW: pr ? Math.round(pr.width) : 0,
        portraitH: pr ? Math.round(pr.height) : 0,
        aspect34Ok:
          vw < sm
            ? Math.abs(aspectPortrait - 4 / 3) < 0.08
            : Math.round(pr?.width ?? 0) === 184,
        bottomAligned,
        insidePortrait: inside,
        inCard:
          ir &&
          cr &&
          ir.left >= cr.left - 2 &&
          ir.right <= cr.right + 2 &&
          ir.top >= cr.top - 2 &&
          ir.bottom <= cr.bottom + 2,
      };
    });
    const cardMotion = getComputedStyle(cards[0]).transitionDuration;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const harjit = imgs.find((i) => i.src.includes("harjit"));
    const abhinav = imgs.find((i) => i.src.includes("abhinav"));
    const others = imgs.filter(
      (i) => !i.src.includes("harjit") && !i.src.includes("abhinav"),
    );
    const otherPositions = others.map((i) => i.objectPosition);

    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      gridCols: gc,
      expectedCols,
      gridOk: gc === expectedCols,
      harjit,
      abhinav,
      otherObjectPositions: otherPositions,
      images: imgs,
      allPathsOk: imgs.every((i) => i.pathOk && !i.missing),
      allCover: imgs.every((i) => i.objectFit === "cover"),
      allInPortrait: imgs.every((i) => i.insidePortrait),
      allBottomAligned:
        vw >= sm ? imgs.every((i) => i.bottomAligned === true) : null,
      cardTransition: cardMotion,
      reducedMotionQuery: reducedMotion,
    };
  });
  out.push({ targetWidth: w, ...data });
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
