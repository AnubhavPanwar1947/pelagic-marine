import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const url = "http://localhost:3000/contact/";

function rgbToHex(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb;
  const hex = (n) => Number(n).toString(16).padStart(2, "0");
  return `#${hex(m[1])}${hex(m[2])}${hex(m[3])}`.toLowerCase();
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(url, { waitUntil: "networkidle" });
  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const eyebrow = document.querySelector(".contact-page .type-eyebrow");
    const h1 = document.querySelector(".contact-page h1");
    const lead = document.querySelector(".contact-page .type-lead");
    const formH2 = document.querySelector(".contact-enquiry-shell h2");
    const firstHint = document.querySelector('label[for="first_name"]');
    const lastHint = document.querySelector('label[for="last_name"]');
    const channelTitle = document.querySelector(
      ".contact-page ul li a span.text-base",
    );
    const channelDetail = document.querySelector(
      ".contact-page .contact-channel-detail",
    );
    const h1Rect = h1?.getBoundingClientRect();
    const cr = document.querySelector(".contact-page")?.getBoundingClientRect();
    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      eyebrowColor: eyebrow ? getComputedStyle(eyebrow).color : "",
      h1Color: h1 ? getComputedStyle(h1).color : "",
      leadColor: lead ? getComputedStyle(lead).color : "",
      formH2Color: formH2 ? getComputedStyle(formH2).color : "",
      firstHintColor: firstHint ? getComputedStyle(firstHint).color : "",
      lastHintColor: lastHint ? getComputedStyle(lastHint).color : "",
      channelTitleColor: channelTitle ? getComputedStyle(channelTitle).color : "",
      channelDetailColor: channelDetail
        ? getComputedStyle(channelDetail).color
        : "",
      h1Inside:
        h1Rect &&
        cr &&
        h1Rect.left >= cr.left - 2 &&
        h1Rect.right <= cr.right + 2,
    };
  });
  out.push({
    targetWidth: w,
    ...data,
    eyebrowHex: rgbToHex(data.eyebrowColor),
    h1Hex: rgbToHex(data.h1Color),
    leadHex: rgbToHex(data.leadColor),
    formH2Hex: rgbToHex(data.formH2Color),
    firstHintHex: rgbToHex(data.firstHintColor),
    channelTitleHex: rgbToHex(data.channelTitleColor),
    channelDetailHex: rgbToHex(data.channelDetailColor),
    eyebrowOk: rgbToHex(data.eyebrowColor) === "#2fa8ee",
    h1Ok: rgbToHex(data.h1Color) === "#0e235e",
    leadOk: rgbToHex(data.leadColor) === "#2f4a63",
    formH2Ok: rgbToHex(data.formH2Color) === "#0e235e",
    hintsOk:
      rgbToHex(data.firstHintColor) === "#4d6177" &&
      rgbToHex(data.lastHintColor) === "#4d6177",
    channelTitleOk: rgbToHex(data.channelTitleColor) === "#0e235e",
    channelDetailOk: rgbToHex(data.channelDetailColor) === "#2f4a63",
  });
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
