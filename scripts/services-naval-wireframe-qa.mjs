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

  await page.locator(".services-practice-section__figure img").waitFor({
    state: "attached",
    timeout: 15000,
  });
  await page.evaluate(async () => {
    const img = document.querySelector(".services-practice-section__figure img");
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
    const section = document.querySelector(".services-practice-section");
    const badge = document.querySelector(".services-practice-section__badge");
    const label = document.querySelector(".services-practice-section__label");
    const titles = [...document.querySelectorAll("#naval-architecture-design-heading")];
    const summaries = section
      ? [...section.querySelectorAll(".services-practice-section__main > p")]
      : [];
    const topicsHeadings = [
      ...document.querySelectorAll(".services-practice-section__topics-heading"),
    ];
    const figures = [...document.querySelectorAll(".services-practice-section__figure")];
    const otherFigures = [
      ...document.querySelectorAll(
        ".services-category-panel__figure, .services-practice-section__figure",
      ),
    ].filter((el) => !el.closest(".services-practice-section"));
    const practiceGrid = section?.querySelector(".services-practice-section__grid");
    const topicsList = section?.querySelector(".services-practice-section__topics ul");
    const itemCols = topicsList
      ? getComputedStyle(topicsList).gridTemplateColumns.split(" ").filter(Boolean).length
      : 0;
    const practiceCols = practiceGrid
      ? getComputedStyle(practiceGrid).gridTemplateColumns.split(" ").filter(Boolean).length
      : 0;

    const img = section?.querySelector(".services-practice-section__figure img");
    const figure = section?.querySelector(".services-practice-section__figure");

    function boxOffsets(container, box) {
      if (!container || !box) return null;
      const cr = container.getBoundingClientRect();
      const br = box.getBoundingClientRect();
      const cs = getComputedStyle(box);
      return {
        top: Math.round(br.top - cr.top),
        left: Math.round(br.left - cr.left),
        right: Math.round(cr.right - br.right),
        bottom: Math.round(cr.bottom - br.bottom),
        margin: cs.margin,
        padding: cs.padding,
        rendered: { w: Math.round(br.width), h: Math.round(br.height) },
      };
    }

    let navalImg = null;
    if (img && figure) {
      const r = img.getBoundingClientRect();
      const fr = figure.getBoundingClientRect();
      const aspect = r.width > 0 ? Math.round((r.width / r.height) * 1000) / 1000 : 0;
      navalImg = {
        currentSrc: img.currentSrc || img.src,
        natural: { w: img.naturalWidth, h: img.naturalHeight },
        rendered: { w: Math.round(r.width), h: Math.round(r.height) },
        aspect,
        complete: img.complete && img.naturalWidth > 0,
        figureOffsets: boxOffsets(figure, img),
        wrapperStyles: boxOffsets(figure, figure),
      };
    }

    const otherCards = [...document.querySelectorAll(".services-page article.card-maritime")];
    const otherOk = otherCards.length === 5;

    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      hasSection: Boolean(section),
      badgeText: badge?.textContent?.trim(),
      labelText: label?.textContent?.trim(),
      titleCount: titles.length,
      summaryCount: summaries.length,
      topicsHeadingCount: topicsHeadings.length,
      figureCount: figures.length,
      otherFigureCount: otherFigures.length,
      practiceCols,
      itemCols,
      expectedPracticeCols: vw >= lg ? 2 : 1,
      expectedItemCols: vw >= sm ? 2 : 1,
      navalImg,
      otherCategoryCardCount: otherCards.length,
      otherCategoriesUnchanged: otherOk,
      deepLink: Boolean(document.getElementById("naval-architecture-design")),
    };
  });

  await page.locator(".services-practice-section a.card-maritime").first().hover({
    force: true,
  });
  await page.waitForTimeout(120);

  const focusHover = await page.evaluate(() => {
    const link = document.querySelector(".services-practice-section a.card-maritime");
    link?.focus();
    return {
      focusOutline: link ? getComputedStyle(link).outlineStyle : "",
      itemHoverBg: link ? getComputedStyle(link).backgroundColor : "",
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });

  const httpOk = blueprintResponses.some(
    (r) =>
      r.status === 200 ||
      r.status === 304 ||
      (r.status >= 200 && r.status < 300),
  );

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
