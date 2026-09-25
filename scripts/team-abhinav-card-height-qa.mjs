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
    const sm = 640;
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const card = document.querySelector(".team-member-card--abhinav");
    const portrait = card?.querySelector(".team-member-card__portrait");
    const body = card?.querySelector(".team-member-card__body");
    const bio = card?.querySelector(".team-member-card__bio");
    const img = portrait?.querySelector("img");
    const cr = card.getBoundingClientRect();
    const pr = portrait.getBoundingClientRect();
    const br = body.getBoundingClientRect();
    const bioR = bio.getBoundingClientRect();
    const bodyStyle = getComputedStyle(body);
    const portraitAspect =
      pr.width > 0 ? Math.round((pr.height / pr.width) * 100) / 100 : 0;
    const cardMatchesPortrait =
      Math.abs(cr.height - pr.height) <= 4 ||
      Math.abs(cr.height - pr.height - 2) <= 4;
    const bioUnderPortrait = vw < sm && bioR.top >= pr.bottom - 1;
    const bioFullyVisible =
      bioR.height > 0 &&
      bioR.top >= pr.bottom - 2 &&
      bioR.bottom <= cr.bottom + 1;
    const scrollable =
      vw >= sm &&
      body.scrollHeight > body.clientHeight + 1 &&
      bodyStyle.overflowY === "auto";
    const bioReachable =
      vw < sm
        ? bioFullyVisible
        : body.scrollHeight <= body.clientHeight + 1 || scrollable;
    const harjitCard = [...document.querySelectorAll(".team-member-card")].find(
      (c) => c.querySelector('img[src*="harjit"]'),
    );
    const harjitH = harjitCard
      ? Math.round(harjitCard.getBoundingClientRect().height)
      : 0;
    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      cardH: Math.round(cr.height),
      portraitH: Math.round(pr.height),
      portraitW: Math.round(pr.width),
      portraitAspect,
      portraitAspectOk: Math.abs(portraitAspect - 2.25) < 0.08,
      portraitWidthOk: vw >= sm ? Math.round(pr.width) === 228 : true,
      objectPosition: img ? getComputedStyle(img).objectPosition : "",
      focalOk: getComputedStyle(img).objectPosition === "50% 8%",
      cardTallerThanPortraitMobile: vw < sm ? cr.height > pr.height + 8 : null,
      cardHeightMatchesPortraitSmUp:
        vw >= sm ? cardMatchesPortrait : null,
      bioUnderPortraitMobile: vw < sm ? bioUnderPortrait : null,
      bioReachable,
      bodyOverflowY: bodyStyle.overflowY,
      bodyScrollable: scrollable,
      harjitCardH: harjitH,
      abhinavShorterThanHarjit:
        vw >= sm && harjitH > 0 ? cr.height < harjitH - 8 : null,
    };
  });
  out.push({ targetWidth: w, ...data });
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
