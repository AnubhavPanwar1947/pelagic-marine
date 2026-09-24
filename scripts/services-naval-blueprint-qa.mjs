import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 768, 960, 1024, 1280, 1440];
const url = "http://localhost:3000/services/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  const blueprintResponses = [];
  const onResponse = (res) => {
    const u = res.url();
    if (u.includes("naval-architecture-blueprint")) {
      blueprintResponses.push({ url: u, status: res.status() });
    }
  };
  page.on("response", onResponse);
  await page.goto(url, { waitUntil: "networkidle" });
  if (w === widths[0]) {
    const accept = page.getByRole("button", { name: /accept|agree|allow/i });
    if (await accept.count()) {
      await accept.first().click({ timeout: 2000 }).catch(() => {});
    }
  }

  const imgHandle = page.locator(".services-category-panel__figure img").first();
  await imgHandle.waitFor({ state: "attached", timeout: 15000 });
  await page.evaluate(async () => {
    const img = document.querySelector(".services-category-panel__figure img");
    if (!img) throw new Error("no img");
    if (!img.complete) {
      await new Promise((resolve, reject) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", () => reject(new Error("img error")), {
          once: true,
        });
      });
    }
    if (img.decode) await img.decode();
  });

  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const sm = 640;
    const lg = 1024;
    const articles = [...document.querySelectorAll(".services-page article.card-maritime")];
    const figures = [...document.querySelectorAll(".services-category-panel__figure")];
    const imgs = [...document.querySelectorAll(".services-category-panel__figure img")];

    const navalArticle = articles.find((a) =>
      a.querySelector(".services-category-panel__figure"),
    );
    const otherWithFigure = articles.filter(
      (a) => a !== navalArticle && a.querySelector(".services-category-panel__figure"),
    );

    const navalBlock = document.querySelector(
      ".services-category-block--naval",
    );
    const intro = navalBlock?.querySelector(".services-category-intro");
    const navalCard = navalBlock?.querySelector("article.card-maritime");
    const introInsideCard = intro && navalCard?.contains(intro);
    const titleInCard = navalCard?.querySelector("h2");
    const introAboveCard =
      intro &&
      navalCard &&
      intro.getBoundingClientRect().bottom <= navalCard.getBoundingClientRect().top + 1;
    const ariaLabelledby = navalCard?.getAttribute("aria-labelledby");
    const headingId = document.getElementById("naval-architecture-design-heading");

    const panel = navalArticle?.querySelector(".services-category-panel--with-figure");
    const figure = panel?.querySelector(".services-category-panel__figure");
    const img = imgs[0];

    function edgeOffsets(panelEl, boxEl) {
      if (!panelEl || !boxEl) return null;
      const pr = panelEl.getBoundingClientRect();
      const br = boxEl.getBoundingClientRect();
      return {
        top: Math.round(br.top - pr.top),
        left: Math.round(br.left - pr.left),
        right: Math.round(pr.right - br.right),
        bottom: Math.round(pr.bottom - br.bottom),
        panel: { w: Math.round(pr.width), h: Math.round(pr.height) },
        box: { w: Math.round(br.width), h: Math.round(br.height) },
      };
    }

    function imgInfo(imgEl) {
      if (!imgEl) return null;
      const cs = getComputedStyle(imgEl);
      const r = imgEl.getBoundingClientRect();
      const fr = figure?.getBoundingClientRect();
      const natural = { w: imgEl.naturalWidth, h: imgEl.naturalHeight };
      const rendered = { w: Math.round(r.width), h: Math.round(r.height) };
      const targetAspect = 1024 / 602;
      const aspect =
        rendered.w > 0 ? Math.round((rendered.w / rendered.h) * 1000) / 1000 : 0;
      const figureOffsets = edgeOffsets(panel, figure);
      const imgOffsets = edgeOffsets(panel, imgEl);
      const figureStyles = figure
        ? {
            margin: getComputedStyle(figure).margin,
            padding: getComputedStyle(figure).padding,
          }
        : null;
      return {
        currentSrc: imgEl.currentSrc || imgEl.src,
        objectFit: cs.objectFit,
        rendered,
        figure: fr
          ? { w: Math.round(fr.width), h: Math.round(fr.height) }
          : null,
        natural,
        aspect,
        aspectDelta: Math.abs(aspect - targetAspect),
        complete: imgEl.complete && natural.w > 0,
        figureOffsets,
        imgOffsets,
        figureStyles,
      };
    }

    const firstOuter = articles[0];
    const list = firstOuter?.querySelector("ul");
    const innerGrid = firstOuter?.querySelector("div.grid");
    const itemCols = list
      ? getComputedStyle(list).gridTemplateColumns.split(" ").filter(Boolean).length
      : 0;
    const outerCols = innerGrid
      ? getComputedStyle(innerGrid).gridTemplateColumns.split(" ").filter(Boolean).length
      : 0;

    const outerOk = articles.every((el) => {
      const cs = getComputedStyle(el);
      return cs.backgroundImage === "none" && cs.backgroundColor === "rgb(255, 255, 255)";
    });

    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      figureCount: figures.length,
      otherCardsWithFigure: otherWithFigure.length,
      navalImg: imgInfo(img),
      outerCols,
      itemCols,
      expectedOuterCols: vw >= lg ? 12 : 1,
      expectedItemCols: vw >= sm ? 2 : 1,
      outerOk,
      introInsideCard: Boolean(introInsideCard),
      titleInsideNavalCard: Boolean(titleInCard),
      introAboveCard: Boolean(introAboveCard),
      ariaLabelledby,
      headingDeepLink: Boolean(document.getElementById("naval-architecture-design")),
    };
  });

  const httpOk = blueprintResponses.some(
    (r) => r.status === 200 && r.url.includes("naval-architecture-blueprint"),
  );

  await page
    .locator(".services-page article.card-maritime li a.card-maritime")
    .first()
    .hover({ force: true });
  await page.waitForTimeout(150);

  const focusHover = await page.evaluate(() => {
    const link = document.querySelector(
      ".services-page article.card-maritime li a.card-maritime",
    );
    link?.focus();
    const fs = link ? getComputedStyle(link).outlineStyle : "";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const card = document.querySelector(".services-page article.card-maritime");
    const motion = card ? getComputedStyle(card).transitionDuration : "";
    const item = link;
    const csItem = item ? getComputedStyle(item) : null;
    return {
      focusOutline: fs,
      reducedMotion: reduced,
      cardTransition: motion,
      itemHoverBg: csItem?.backgroundColor,
    };
  });

  out.push({
    targetWidth: w,
    ...data,
    ...focusHover,
    blueprintHttpOk: httpOk,
    blueprintResponses,
  });
  page.off("response", onResponse);
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
