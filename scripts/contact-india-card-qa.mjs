import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [
  50, 320, 767, 768, 1023, 1024, 1100, 1200, 1279, 1280, 1440, 1920,
];

const DEHRADUN =
  "3/11 D, 2nd Floor, Gyan Tower, Garhi Cantonment, Dehradun 248001";
const JAPAN_ADDRESS =
  "4-54-6 UTSUKUSHIGAOKA, AOBA WARD, YOKOHAMA CITY -225-0002";
const SINGAPORE_ADDRESS =
  "12 Woodlands Square, #06-74, Woods Square, Singapore 737715";

const siteDataSource = fs.readFileSync(
  path.join(process.cwd(), "src", "lib", "site-data.ts"),
  "utf8",
);
const officesSource = fs.readFileSync(
  path.join(process.cwd(), "src", "lib", "offices.ts"),
  "utf8",
);

async function dismiss(page) {
  await page.evaluate(() => {
    document.querySelectorAll(".splash-screen").forEach((el) => el.remove());
    document
      .querySelectorAll('[role="presentation"].fixed')
      .forEach((el) => el.remove());
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const issues = [];
const results = [];

if (!siteDataSource.includes('value: "mumbai"')) {
  issues.push("site-data: Mumbai removed from enquiry form office options");
}
if (!officesSource.includes('id: "mumbai"')) {
  issues.push("offices.ts: Mumbai office data removed");
}

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(`${BASE}/contact/`, { waitUntil: "networkidle" });
  await dismiss(page);
  await page.locator(".contact-presence-body").scrollIntoViewIfNeeded();

  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const cards = [
      ...document.querySelectorAll(".contact-presence-cards .contact-office-card"),
    ];
    const titles = cards.map((c) => c.querySelector("h3")?.textContent?.trim() ?? "");
    const india = cards.find((c) => c.querySelector("h3")?.textContent?.trim() === "India");
    const indiaText = india?.innerText ?? "";
    const dubai = cards.find((c) => c.querySelector("h3")?.textContent?.trim() === "Dubai");
    const singapore = cards.find(
      (c) => c.querySelector("h3")?.textContent?.trim() === "Singapore",
    );
    const japan = cards.find(
      (c) =>
        c.querySelector("h3")?.textContent?.trim() === "Japan — Associate Office",
    );
    const japanTitle = japan?.querySelector("h3")?.textContent?.trim() ?? "";
    const japanBulletCount = japan
      ? japan.querySelectorAll(".contact-office-card-bullet-list > li").length
      : 0;
    const form = document.querySelector("#enquiry-form form");
    const map = document.querySelector(".contact-presence-map");
    const mapSrc = map?.getAttribute("src") ?? "";
    const mapAlt = map?.getAttribute("alt") ?? "";
    const mapWidthAttr = map?.getAttribute("width") ?? "";
    const mapHeightAttr = map?.getAttribute("height") ?? "";
    const mapFetchPriority =
      map?.getAttribute("fetchpriority") ?? map?.getAttribute("fetchPriority") ?? "";
    const mapDecoding = map?.getAttribute("decoding");
    const mapPreload = Boolean(
      document.querySelector('link[rel="preload"][href="/map.png"]'),
    );
    const nw = map?.naturalWidth ?? 0;
    const nh = map?.naturalHeight ?? 0;
    const dw = map?.clientWidth ?? 0;
    const dh = map?.clientHeight ?? 0;
    const naturalRatio = nw && nh ? nw / nh : 0;
    const displayRatio = dw && dh ? dw / dh : 0;
    const ratioDelta =
      naturalRatio && displayRatio ? Math.abs(naturalRatio - displayRatio) : 99;
    const objectFit = map ? getComputedStyle(map).objectFit : "";
    const aspectRatio = map ? getComputedStyle(map).aspectRatio : "";
    const mapWrap = document.querySelector(".contact-presence-map-wrap");
    const mapInsideReveal = Boolean(mapWrap?.closest(".reveal-on-scroll"));
    const mapScroller = document.querySelector(".contact-presence-map-scroller");
    const wrapRect = mapWrap?.getBoundingClientRect();
    const scrollerRect = mapScroller?.getBoundingClientRect();
    const wrapSquareDelta =
      wrapRect ? Math.abs(wrapRect.width - wrapRect.height) : 99;
    const wrapScrollerWidthDelta =
      wrapRect && scrollerRect
        ? Math.abs(wrapRect.width - scrollerRect.width)
        : 99;
    const wrapScrollerHeightDelta =
      wrapRect && scrollerRect
        ? Math.abs(wrapRect.height - scrollerRect.height)
        : 99;
    const mapWrapBorder = mapWrap ? getComputedStyle(mapWrap).borderTopWidth : "";
    const pageOverflow = sw > vw + 0.5;
    const wrapOverflowsPage =
      wrapRect && (wrapRect.right > vw + 0.5 || wrapRect.left < -0.5);
    const cardGradients = cards.map((c) => getComputedStyle(c).backgroundImage);
    const accentHidden = cards.every((c) => {
      const accent = c.querySelector(".contact-office-card-top-accent");
      return accent && getComputedStyle(accent).display === "none";
    });
    const cardTitleColors = cards.map(
      (c) => getComputedStyle(c.querySelector("h3")).color,
    );
    const cardBodyColors = cards.map((c) => {
      const body = c.querySelector(".contact-office-card-body");
      return body ? getComputedStyle(body).color : "";
    });
    const bulletItemCounts = cards.map(
      (c) => c.querySelectorAll(".contact-office-card-bullet-list > li").length,
    );
    const bulletListStyles = cards.map((c) => {
      const list = c.querySelector(".contact-office-card-bullet-list");
      return list ? getComputedStyle(list).listStyleType : "";
    });
    const bulletMarkerColors = cards.map((c) => {
      const li = c.querySelector(".contact-office-card-bullet-list > li");
      if (!li) return "";
      return getComputedStyle(li, "::marker").color;
    });
    const mapWrapBg = mapWrap ? getComputedStyle(mapWrap).backgroundColor : "";
    const mapWrapMaxWidth = mapWrap ? getComputedStyle(mapWrap).maxWidth : "";
    const mapWrapMarginLeft = mapWrap ? getComputedStyle(mapWrap).marginLeft : "";
    const mapWrapMarginRight = mapWrap ? getComputedStyle(mapWrap).marginRight : "";
    const presenceHeading = document.querySelector(".contact-presence-heading");
    const presenceBody = document.querySelector(".contact-presence-body");
    const headingRect = presenceHeading?.getBoundingClientRect();
    const bodyRect = presenceBody?.getBoundingClientRect();
    const headingToBodyGapPx =
      headingRect && bodyRect ? bodyRect.top - headingRect.bottom : 0;
    const bodyMarginTop = presenceBody
      ? getComputedStyle(presenceBody).marginTop
      : "";
    const cardsList = document.querySelector(".contact-presence-cards");
    const bodyDisplay = presenceBody ? getComputedStyle(presenceBody).display : "";
    const cardGridCols = cardsList
      ? getComputedStyle(cardsList).gridTemplateColumns
      : "";
    const cardColCount = cardGridCols
      ? cardGridCols.split(" ").filter((s) => s && s !== "0px").length
      : 0;
    const cardsListRect = cardsList?.getBoundingClientRect();
    const dubaiCard = dubai?.getBoundingClientRect();
    const indiaCard = india?.getBoundingClientRect();
    const singaporeCard = singapore?.getBoundingClientRect();
    const japanCard = japan?.getBoundingClientRect();
    const twoOverOne =
      dubaiCard && indiaCard && singaporeCard && japanCard
        ? dubaiCard.left < indiaCard.left - 1 &&
          Math.abs(dubaiCard.top - indiaCard.top) <= 4 &&
          singaporeCard.top >= dubaiCard.bottom - 4 &&
          Math.abs(singaporeCard.left - dubaiCard.left) <= 6 &&
          Math.abs(singaporeCard.width - dubaiCard.width) <= 4 &&
          Math.abs(indiaCard.width - dubaiCard.width) <= 4 &&
          Math.abs(japanCard.left - indiaCard.left) <= 6 &&
          Math.abs(japanCard.top - singaporeCard.top) <= 4 &&
          Math.abs(japanCard.width - singaporeCard.width) <= 4
        : false;
    const cardWidths = cards.map((c) => c.getBoundingClientRect().width);
    const cardLiWidths = cardsList
      ? [...cardsList.children].map((li) => li.getBoundingClientRect().width)
      : [];
    const cardHeights = cards.map((c) => c.getBoundingClientRect().height);
    const cardsListLeft = cardsListRect?.left ?? 0;
    const mapLeftAlignDubai =
      wrapRect && cardsListRect
        ? Math.abs(wrapRect.left - cardsListLeft) <= 4
        : false;
    const widthsForAlign =
      cardLiWidths.length === 4 ? cardLiWidths : cardWidths;
    const cardsSameWidth =
      widthsForAlign.length === 4
        ? Math.max(...widthsForAlign) - Math.min(...widthsForAlign) <= 4
        : false;
    const cardsMatchMapWidth =
      wrapRect && cardsListRect && widthsForAlign.length === 4
        ? Math.abs(cardsListRect.width - wrapRect.width) <= 4 &&
          widthsForAlign.every((cw) => Math.abs(cw - cardsListRect.width) <= 4)
        : false;
    const mapLeftOfCards =
      wrapRect && dubaiCard ? wrapRect.right <= dubaiCard.left + 2 : false;
    const mapTopAlignDubai =
      wrapRect && dubaiCard ? Math.abs(wrapRect.top - dubaiCard.top) <= 4 : false;
    const mapBottomAlignSingapore =
      wrapRect && singaporeCard
        ? Math.abs(wrapRect.bottom - singaporeCard.bottom) <= 4
        : false;
    const mapTopAlignCards = mapTopAlignDubai;
    const mapAboveCards =
      wrapRect && dubaiCard ? wrapRect.bottom <= dubaiCard.top + 2 : false;
    const cardClipped = cards.some((c) => {
      const ov = getComputedStyle(c).overflow;
      return (
        (ov === "hidden" || ov === "clip") &&
        c.scrollHeight > c.clientHeight + 2
      );
    });
    const dubaiPadding = dubai
      ? getComputedStyle(dubai).paddingTop
      : "";
    const cardsGap = cardsList ? getComputedStyle(cardsList).rowGap : "";
    const presenceColumnGap = presenceBody
      ? getComputedStyle(presenceBody).columnGap
      : "";
    const presenceBodyPosition = presenceBody
      ? getComputedStyle(presenceBody).position
      : "";
    const mapWrapPosition = mapWrap ? getComputedStyle(mapWrap).position : "";
    const mapToCardsGapPx =
      wrapRect && dubaiCard ? dubaiCard.left - wrapRect.right : 0;
    const japanTitleEl = japan?.querySelector("h3");
    const japanTitleH = japanTitleEl?.getBoundingClientRect().height ?? 0;
    const japanTitleLH = japanTitleEl
      ? parseFloat(getComputedStyle(japanTitleEl).lineHeight) || 24
      : 24;
    const japanTitleSingleLine = japanTitleH <= japanTitleLH * 1.35;
    const row1HeightEqual =
      dubaiCard && indiaCard
        ? Math.abs(dubaiCard.height - indiaCard.height) <= 4
        : false;
    const row2HeightEqual =
      singaporeCard && japanCard
        ? Math.abs(singaporeCard.height - japanCard.height) <= 4
        : false;
    const mapBottomAlignCards =
      wrapRect && cardsListRect
        ? Math.abs(wrapRect.bottom - cardsListRect.bottom) <= 8
        : false;
    const mapAspect43 =
      wrapRect && wrapRect.height > 0
        ? Math.abs(wrapRect.width / wrapRect.height - 4 / 3) <= 0.06
        : false;
    return {
      vw,
      sw,
      overflow: pageOverflow,
      titles,
      indiaText,
      dubaiHasAlRaffa: (dubai?.innerText ?? "").includes("Al Raffa"),
      singaporeText: singapore?.innerText ?? "",
      singaporeComingSoon: (singapore?.innerText ?? "").includes("coming soon"),
      singaporeBulletCount: singapore
        ? singapore.querySelectorAll(".contact-office-card-bullet-list > li").length
        : 0,
      japanTitle,
      japanBulletCount,
      japanText: japan?.innerText ?? "",
      formPresent: Boolean(form),
      formSubmitEnabled: !form?.querySelector('button[type="submit"]')?.disabled,
      mapSrc,
      mapFetchPriority,
      mapDecoding,
      mapInsideReveal,
      mapPreload,
      mapAlt,
      mapWidthAttr,
      mapHeightAttr,
      mapNatural: `${nw}x${nh}`,
      ratioDelta,
      objectFit,
      aspectRatio,
      wrapOverflowsPage,
      wrapSquareDelta,
      wrapWidth: wrapRect?.width ?? 0,
      wrapHeight: wrapRect?.height ?? 0,
      wrapScrollerWidthDelta,
      wrapScrollerHeightDelta,
      cardGradients,
      accentHidden,
      cardTitleColors,
      cardBodyColors,
      bulletItemCounts,
      bulletListStyles,
      bulletMarkerColors,
      mapWrapBg,
      mapWrapBorder,
      mapWrapMaxWidth,
      mapWrapMarginLeft,
      mapWrapMarginRight,
      bodyDisplay,
      cardColCount,
      mapLeftOfCards,
      mapTopAlignCards,
      mapTopAlignDubai,
      mapBottomAlignSingapore,
      mapAboveCards,
      cardClipped,
      cardsListWidth: cardsListRect?.width ?? 0,
      dubaiPadding,
      cardsGap,
      twoOverOne,
      presenceColumnGap,
      mapToCardsGapPx,
      cardWidths,
      cardHeights,
      presenceBodyPosition,
      mapWrapPosition,
      mapLeftAlignDubai,
      cardsSameWidth,
      cardsMatchMapWidth,
      headingToBodyGapPx,
      bodyMarginTop,
      japanTitleSingleLine,
      row1HeightEqual,
      row2HeightEqual,
      mapBottomAlignCards,
      mapAspect43,
      presenceBodyDisplay: presenceBody ? getComputedStyle(presenceBody).display : "",
    };
  });

  results.push({ width: w, ...data });

  if (!data.indiaText.includes(DEHRADUN)) {
    issues.push(`${w}px: India address missing`);
  }
  if (
    data.indiaText
      .split("\n")
      .map((line) => line.trim())
      .includes("Dehradun")
  ) {
    issues.push(`${w}px: Dehradun label still on India card`);
  }
  if (/Mumbai/i.test(data.indiaText) || data.indiaText.includes("Cyber One")) {
    issues.push(`${w}px: Mumbai still in India card`);
  }
  if (!data.dubaiHasAlRaffa) issues.push(`${w}px: Dubai card changed`);
  if (data.singaporeComingSoon) {
    issues.push(`${w}px: Singapore still shows coming soon`);
  }
  if (data.singaporeBulletCount !== 1) {
    issues.push(
      `${w}px: Singapore card must have one bullet (${data.singaporeBulletCount})`,
    );
  }
  if (!data.singaporeText.includes(SINGAPORE_ADDRESS)) {
    issues.push(`${w}px: Singapore address missing`);
  }
  if (data.japanTitle !== "Japan — Associate Office") {
    issues.push(
      `${w}px: Japan title not \"Japan — Associate Office\" (${data.japanTitle})`,
    );
  }
  if (data.japanBulletCount !== 1) {
    issues.push(`${w}px: Japan card must have one bullet (${data.japanBulletCount})`);
  }
  if (!data.japanText.includes(JAPAN_ADDRESS)) {
    issues.push(`${w}px: Japan address missing`);
  }
  if (!data.formPresent || !data.formSubmitEnabled) {
    issues.push(`${w}px: enquiry form missing or submit disabled`);
  }
  if (data.overflow) issues.push(`${w}px: horizontal overflow`);
  if (!data.mapSrc.includes("/map.png")) issues.push(`${w}px: map is not /map.png`);
  if (data.mapSrc.includes("/map.svg")) issues.push(`${w}px: map still uses SVG`);
  if (data.mapInsideReveal) issues.push(`${w}px: map inside scroll reveal`);
  if (data.mapFetchPriority !== "high") {
    issues.push(`${w}px: map fetchPriority not high (${data.mapFetchPriority})`);
  }
  if (data.mapDecoding === "async") issues.push(`${w}px: map still decoding=async`);
  if (!data.mapPreload) issues.push(`${w}px: map.png preload missing`);
  if (data.mapAlt !== "World map") issues.push(`${w}px: map alt not "World map"`);
  if (data.mapWidthAttr !== "2000" || data.mapHeightAttr !== "1500") {
    issues.push(`${w}px: map width/height attrs not 2000×1500`);
  }
  if (w < 768 && data.wrapSquareDelta > 3) {
    issues.push(`${w}px: map card not square`);
  }
  if (w >= 1920) {
    if (data.wrapWidth < 798 || data.wrapWidth > 802) {
      issues.push(`${w}px: map not 800px wide (${data.wrapWidth})`);
    }
    if (data.wrapHeight < 598 || data.wrapHeight > 602) {
      issues.push(`${w}px: map not 600px tall (${data.wrapHeight})`);
    }
  } else if (w >= 1440) {
    if (data.wrapWidth < 658 || data.wrapWidth > 662) {
      issues.push(`${w}px: map not 660px wide (${data.wrapWidth})`);
    }
    if (data.wrapHeight < 493 || data.wrapHeight > 497) {
      issues.push(`${w}px: map not 495px tall (${data.wrapHeight})`);
    }
  } else if (w >= 1280) {
    if (data.wrapWidth < 558 || data.wrapWidth > 562) {
      issues.push(`${w}px: map not 560px wide (${data.wrapWidth})`);
    }
    if (data.wrapHeight < 418 || data.wrapHeight > 422) {
      issues.push(`${w}px: map not 420px tall (${data.wrapHeight})`);
    }
  } else if (w >= 768 && w < 1280) {
    if (data.wrapWidth > 642) {
      issues.push(`${w}px: map wider than 640px (${data.wrapWidth})`);
    }
    if (!data.mapAspect43) {
      issues.push(`${w}px: map not 4:3 (${data.wrapWidth}x${data.wrapHeight})`);
    }
  }
  const layoutBand =
    w >= 1280 ? "desktop" : w >= 768 ? "tablet-stack" : "mobile";
  if (layoutBand === "desktop" && !data.mapTopAlignDubai) {
    issues.push(`${w}px: map top not aligned with Dubai card`);
  }
  let targetCardW = 300;
  let minCardH = 145;
  let sgHMin = 145;
  if (w >= 1280) {
    targetCardW = 300;
    minCardH = 145;
    sgHMin = 145;
  } else if (w >= 768 && w < 1280) {
    targetCardW = Math.min(340, Math.max(0, w - 80));
    minCardH = 115;
    sgHMin = 115;
  } else {
    targetCardW = Math.min(300, Math.max(0, w - 48));
  }
  const widthTol =
    layoutBand === "tablet-stack" ? 24 : w < 360 ? 28 : w >= 768 ? 14 : 22;
  if (layoutBand === "desktop") {
    for (let i = 0; i < Math.min(2, data.cardWidths.length); i++) {
      const cw = data.cardWidths[i];
      const ch = data.cardHeights[i];
      if (Math.abs(cw - targetCardW) > widthTol) {
        issues.push(
          `${w}px: office card ${i + 1} width not ~${targetCardW}px (${cw})`,
        );
        break;
      }
      if (ch < minCardH) {
        issues.push(`${w}px: office card ${i + 1} shorter than min (${ch})`);
        break;
      }
    }
    if (data.cardWidths[2] !== undefined) {
      const cw = data.cardWidths[2];
      const ch = data.cardHeights[2];
      if (Math.abs(cw - targetCardW) > widthTol) {
        issues.push(`${w}px: Singapore width not ~${targetCardW}px (${cw})`);
      }
      if (ch < sgHMin) {
        issues.push(`${w}px: Singapore shorter than min (${ch})`);
      }
    }
    if (data.cardWidths[3] !== undefined) {
      const cw = data.cardWidths[3];
      const ch = data.cardHeights[3];
      if (Math.abs(cw - targetCardW) > widthTol) {
        issues.push(`${w}px: Japan width not ~${targetCardW}px (${cw})`);
      }
      if (ch < sgHMin) {
        issues.push(`${w}px: Japan shorter than min (${ch})`);
      }
    }
    if (
      data.cardWidths[2] !== undefined &&
      data.cardWidths[3] !== undefined &&
      Math.abs(data.cardWidths[2] - data.cardWidths[3]) > 4
    ) {
      issues.push(`${w}px: Singapore and Japan widths do not match`);
    }
  } else if (layoutBand === "tablet-stack") {
    if (!data.mapAboveCards) issues.push(`${w}px: map not above cards`);
    if (data.mapLeftOfCards) issues.push(`${w}px: map should not be left of cards`);
    if (data.cardColCount !== 2) {
      issues.push(`${w}px: cards not two columns (${data.cardColCount})`);
    }
    if (!data.twoOverOne) {
      issues.push(`${w}px: 2×2 card grid wrong`);
    }
    if (!data.row1HeightEqual || !data.row2HeightEqual) {
      issues.push(`${w}px: row heights not equal`);
    }
    for (let i = 0; i < data.cardWidths.length; i++) {
      const cw = data.cardWidths[i];
      if (Math.abs(cw - targetCardW) > widthTol + 20) {
        issues.push(`${w}px: card ${i + 1} width unexpected (${cw})`);
        break;
      }
      if (data.cardHeights[i] < minCardH) {
        issues.push(`${w}px: card ${i + 1} too short`);
        break;
      }
    }
  } else if (w < 768) {
    if (!data.cardsSameWidth) {
      issues.push(`${w}px: office cards not equal width`);
    }
    if (!data.cardsMatchMapWidth) {
      issues.push(
        `${w}px: cards width does not match map (${data.wrapWidth}px)`,
      );
    }
    if (!data.mapLeftAlignDubai) {
      issues.push(`${w}px: map and cards not left-aligned`);
    }
  }
  if (w < 500 && data.wrapWidth > w + 1) {
    issues.push(`${w}px: map card wider than viewport (${data.wrapWidth})`);
  }
  if (data.objectFit !== "contain") {
    issues.push(`${w}px: map object-fit not contain`);
  }
  if (data.wrapScrollerWidthDelta > 3 || data.wrapScrollerHeightDelta > 3) {
    issues.push(`${w}px: map card not hugging crop viewport`);
  }
  if (data.wrapOverflowsPage) issues.push(`${w}px: map card overflows viewport`);
  if (data.cardGradients.length !== 4) {
    issues.push(`${w}px: expected 4 office cards`);
  } else {
    for (const bg of data.cardGradients) {
      if (
        !bg.includes("linear-gradient") ||
        !bg.includes("rgb(7, 26, 51)") ||
        !bg.includes("rgb(20, 56, 104)")
      ) {
        issues.push(`${w}px: office card missing opaque navy gradient`);
        break;
      }
    }
  }
  if (!data.accentHidden) issues.push(`${w}px: office card top accent still visible`);
  const accentBlue = "rgb(47, 168, 238)";
  const white = "rgb(255, 255, 255)";
  if (!data.cardTitleColors.every((c) => c === accentBlue)) {
    issues.push(`${w}px: office card titles not #2fa8ee`);
  }
  if (!data.cardBodyColors.every((c) => c === white)) {
    issues.push(`${w}px: office card body text not white`);
  }
  if (data.bulletItemCounts.length !== 4) {
    issues.push(`${w}px: expected 4 office cards for bullet counts`);
  } else {
    if (!data.bulletItemCounts.every((n) => n === 1)) {
      issues.push(
        `${w}px: each office card must have exactly one bullet (${data.bulletItemCounts.join(",")})`,
      );
    }
  }
  if (!data.bulletListStyles.every((s) => s === "disc")) {
    issues.push(`${w}px: office card bullets not disc`);
  }
  if (!data.bulletMarkerColors.every((c) => c === white)) {
    issues.push(`${w}px: office card bullet color not white`);
  }
  if (data.mapWrapBg !== "rgba(0, 0, 0, 0)" && data.mapWrapBg !== "transparent") {
    issues.push(`${w}px: map card background not transparent (${data.mapWrapBg})`);
  }
  if (data.mapWrapBorder !== "0px") {
    issues.push(`${w}px: map card border not removed (${data.mapWrapBorder})`);
  }
  if (w >= 1920 && data.mapWrapMaxWidth !== "800px") {
    issues.push(`${w}px: map max-width not 800px (${data.mapWrapMaxWidth})`);
  } else if (w >= 1440 && w < 1920 && data.mapWrapMaxWidth !== "660px") {
    issues.push(`${w}px: map max-width not 660px (${data.mapWrapMaxWidth})`);
  } else if (w >= 1280 && w < 1440 && data.mapWrapMaxWidth !== "560px") {
    issues.push(`${w}px: map max-width not 560px (${data.mapWrapMaxWidth})`);
  } else if (w >= 768 && w < 1280 && parseFloat(data.mapWrapMaxWidth) > 640.5) {
    issues.push(`${w}px: map max-width over 640px (${data.mapWrapMaxWidth})`);
  } else if (w < 768 && data.mapWrapMaxWidth !== "500px") {
    issues.push(`${w}px: map max-width not 500px (${data.mapWrapMaxWidth})`);
  }
  if (w >= 600 && w < 768 && data.mapWrapMarginLeft !== data.mapWrapMarginRight) {
    issues.push(`${w}px: map not centered`);
  }
  if (layoutBand === "desktop") {
    if (data.presenceBodyPosition !== "relative") {
      issues.push(`${w}px: presence body not positioned for side-by-side`);
    }
    if (data.mapWrapPosition !== "absolute") {
      issues.push(`${w}px: map wrap not absolute beside cards`);
    }
    if (!data.mapLeftOfCards) {
      issues.push(`${w}px: map not left of cards`);
    }
    if (data.cardColCount !== 2) {
      issues.push(`${w}px: cards not two columns (${data.cardColCount})`);
    }
    if (!data.twoOverOne) {
      issues.push(`${w}px: Dubai/India row + Singapore under Dubai wrong`);
    }
    if (w >= 1280) {
      if (data.dubaiPadding !== "12px") {
        issues.push(`${w}px: xl card padding not 12px 16px (${data.dubaiPadding})`);
      }
      if (data.cardsGap !== "12px") {
        issues.push(`${w}px: xl card gap not 0.75rem (${data.cardsGap})`);
      }
      if (data.mapToCardsGapPx < 38 || data.mapToCardsGapPx > 50) {
        issues.push(
          `${w}px: map-to-cards gap not ~2.5–3rem (${data.mapToCardsGapPx}px)`,
        );
      }
    }
  } else if (layoutBand === "mobile") {
    if (!data.mapAboveCards) {
      issues.push(`${w}px: map not above cards`);
    }
    if (data.cardColCount !== 1) {
      issues.push(`${w}px: cards not single column (${data.cardColCount})`);
    }
    if (
      data.titles.join(",") !==
      "Dubai,India,Singapore,Japan — Associate Office"
    ) {
      issues.push(`${w}px: mobile card order wrong (${data.titles.join(",")})`);
    }
    const expectedMobilePad = w < 280 ? "12px" : "20px";
    if (data.dubaiPadding !== expectedMobilePad) {
      issues.push(
        `${w}px: mobile card padding expected ${expectedMobilePad} (${data.dubaiPadding})`,
      );
    }
    if (data.cardsGap !== "16px") {
      issues.push(`${w}px: stacked card gap should stay 1rem (${data.cardsGap})`);
    }
  }
  if (data.cardClipped) {
    issues.push(`${w}px: office card content clipped`);
  }
  if (w >= 768 && w < 1280 && !data.japanTitleSingleLine) {
    issues.push(`${w}px: Japan title wraps to multiple lines`);
  }
  if (w < 768) {
    if (data.headingToBodyGapPx < 28 || data.headingToBodyGapPx > 36) {
      issues.push(
        `${w}px: heading-to-body gap not ~2rem (${data.headingToBodyGapPx}px)`,
      );
    }
  } else if (data.headingToBodyGapPx < 38 || data.headingToBodyGapPx > 50) {
    issues.push(
      `${w}px: heading-to-body gap not ~2.5–3rem (${data.headingToBodyGapPx}px)`,
    );
  }
}

/* 1280px at 200% browser zoom ≈ 640px layout viewport for media queries */
await page.setViewportSize({ width: 640, height: 900 });
await page.goto(`${BASE}/contact/`, { waitUntil: "networkidle" });
await dismiss(page);
const zoom = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const india = [...document.querySelectorAll(".contact-office-card")].find(
    (c) => c.querySelector("h3")?.textContent?.trim() === "India",
  );
  const map = document.querySelector(".contact-presence-map");
  const mapWrap = document.querySelector(".contact-presence-map-wrap");
  const dubai = [...document.querySelectorAll(".contact-office-card")].find(
    (c) => c.querySelector("h3")?.textContent?.trim() === "Dubai",
  );
  const wrapRect = mapWrap?.getBoundingClientRect();
  const dubaiRect = dubai?.getBoundingClientRect();
  const cardsList = document.querySelector(".contact-presence-cards");
  const cardGridCols = cardsList
    ? getComputedStyle(cardsList).gridTemplateColumns
    : "";
  const cardColCount = cardGridCols
    ? cardGridCols.split(" ").filter((s) => s && s !== "0px").length
    : 0;
  const mapAboveCards =
    wrapRect && dubaiRect ? wrapRect.bottom <= dubaiRect.top + 2 : false;
  return {
    width: "1280@200%zoom",
    vw,
    overflow: sw > vw + 0.5,
    indiaText: india?.innerText ?? "",
    mapSrc: map?.getAttribute("src") ?? "",
    cardColCount,
    mapAboveCards,
    bodyDisplay: document.querySelector(".contact-presence-body")
      ? getComputedStyle(document.querySelector(".contact-presence-body")).display
      : "",
  };
});
results.push(zoom);
if (/Mumbai/i.test(zoom.indiaText)) issues.push("1280@200%: Mumbai in India card");
if (!zoom.mapSrc.includes("/map.png")) issues.push("1280@200%: map not PNG");
if (zoom.overflow) issues.push("1280@200%: horizontal overflow");
if (!zoom.mapAboveCards) issues.push("1280@200%: map not above cards (stacked)");
if (zoom.cardColCount !== 1) {
  issues.push(`1280@200%: expected 1 card column at ~640px, got ${zoom.cardColCount}`);
}
const zoomMapPos = await page.evaluate(() => {
  const mapWrap = document.querySelector(".contact-presence-map-wrap");
  return mapWrap ? getComputedStyle(mapWrap).position : "";
});
if (zoomMapPos === "absolute") {
  issues.push("1280@200%: map should not be beside cards");
}

await browser.close();

const outPath = path.join(process.cwd(), "scripts", "contact-india-card-qa-out.json");
fs.writeFileSync(outPath, JSON.stringify({ issues, results }, null, 2));
console.log(`Wrote ${outPath}`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All checks passed.");
}
