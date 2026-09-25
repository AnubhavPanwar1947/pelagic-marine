import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const url = "http://localhost:3000/team/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const FOCALS = {
  abhinav: "50% 8%",
  harjit: "50% 0%",
  nishchay: "50% 22%",
  bhanu: "50% 20%",
  vipul: "50% 18%",
};

const out = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(url, { waitUntil: "networkidle" });
  const data = await page.evaluate((expectedFocals) => {
    const sm = 640;
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const cards = [...document.querySelectorAll(".team-member-card")].map((card) => {
      const img = card.querySelector("img");
      const src = (img?.currentSrc || img?.src || "").toLowerCase();
      const key = ["abhinav", "harjit", "nishchay", "bhanu", "vipul"].find((k) =>
        src.includes(k),
      );
      const portrait = card.querySelector(".team-member-card__portrait");
      const body = card.querySelector(".team-member-card__body");
      const bio = card.querySelector(".team-member-card__bio");
      const cr = card.getBoundingClientRect();
      const pr = portrait.getBoundingClientRect();
      const bioR = bio.getBoundingClientRect();
      const pos = img ? getComputedStyle(img).objectPosition : "";
      const bodyStyle = getComputedStyle(body);
      const aspect = pr.width > 0 ? pr.height / pr.width : 0;
      const expectedPos = key ? expectedFocals[key] : "";
      return {
        key,
        cardH: Math.round(cr.height),
        portraitH: Math.round(pr.height),
        portraitW: Math.round(pr.width),
        portraitAspect: Math.round(aspect * 100) / 100,
        focalOk: !expectedPos || pos === expectedPos,
        cardMatchesPortrait:
          vw >= sm && Math.abs(cr.height - pr.height) <= 4,
        bioUnderPortrait: vw < sm && bioR.top >= pr.bottom - 1,
        bioInCard: bioR.bottom <= cr.bottom + 1,
        bodyOverflowY: bodyStyle.overflowY,
        bodyScrollable:
          vw >= sm &&
          body.scrollHeight > body.clientHeight + 1 &&
          bodyStyle.overflowY === "auto",
      };
    });
    const heights = cards.map((c) => c.cardH);
    const minH = Math.min(...heights);
    const maxH = Math.max(...heights);
    const abhinav = cards.find((c) => c.key === "abhinav");
    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      cards,
      allPortrait49: cards.every((c) => Math.abs(c.portraitAspect - 2.25) < 0.08),
      allFocalOk: cards.every((c) => c.focalOk),
      smUpUniformHeight:
        vw >= sm ? maxH - minH <= 4 : null,
      smUpAllMatchPortrait:
        vw >= sm ? cards.every((c) => c.cardMatchesPortrait) : null,
      mobileAllTallerThanPortrait:
        vw < sm ? cards.every((c) => c.cardH > c.portraitH + 8) : null,
      mobileBioUnderPortrait:
        vw < sm ? cards.every((c) => c.bioUnderPortrait && c.bioInCard) : null,
      abhinavCardH: abhinav?.cardH,
      cardHeightSpread: maxH - minH,
    };
  }, FOCALS);
  out.push({ targetWidth: w, ...data });
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
