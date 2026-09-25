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
    const vw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const sm = 640;
    const cards = [...document.querySelectorAll(".team-member-card")];
    const bios = cards.map((card) => {
      const bio = card.querySelector(".team-member-card__bio");
      const name = card.querySelector(".team-member-card__heading-name");
      const body = card.querySelector(".team-member-card__body");
      const role = card.querySelector(".team-member-card__heading-role") ||
        card.querySelector("p.text-sm");
      const portrait = card.querySelector(".team-member-card__portrait");
      const img = card.querySelector("img");
      const pr = portrait?.getBoundingClientRect();
      const br = bio?.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      const src = img
        ? (img.currentSrc || img.src).split("?")[0].replace(location.origin, "")
        : "";
      const bioStyle = bio ? getComputedStyle(bio) : null;
      const nameStyle = name ? getComputedStyle(name) : null;
      const bodyStyle = body ? getComputedStyle(body) : null;
      const roleStyle = role ? getComputedStyle(role) : null;
      const portraitAspect =
        pr && pr.width > 0 ? Math.round((pr.height / pr.width) * 100) / 100 : 0;
      const isAbhinav = src.includes("abhinav");
      const targetAspect = isAbhinav ? 2.25 : 2.6;
      const parsePx = (v) => parseFloat(v) || 0;
      const bioFs = bioStyle ? parsePx(bioStyle.fontSize) : 0;
      const nameFs = nameStyle ? parsePx(nameStyle.fontSize) : 0;
      const roleFs = roleStyle ? parsePx(roleStyle.fontSize) : 0;
      const pad = bodyStyle ? parsePx(bodyStyle.paddingTop) : 0;
      const bioMt = bioStyle ? parsePx(bioStyle.marginTop) : 0;
      const pos = img ? getComputedStyle(img).objectPosition : "";
      const inside =
        bio &&
        br &&
        cr &&
        br.left >= cr.left - 1 &&
        br.right <= cr.right + 1;
      return {
        src,
        bioFontPx: Math.round(bioFs * 10) / 10,
        bioFontOk: Math.abs(bioFs - 15.7) < 0.05,
        nameFontPx: Math.round(nameFs * 10) / 10,
        nameFontOk: Math.abs(nameFs - 22) < 0.05,
        roleFontPx: Math.round(roleFs * 10) / 10,
        roleFontOk: Math.abs(roleFs - 14) < 0.5,
        bodyPadPx: pad,
        bodyPadOk: vw < sm ? Math.abs(pad - 20) < 0.5 : Math.abs(pad - 28) < 0.5,
        bioMarginTopPx: bioMt,
        bioMarginOk: Math.abs(bioMt - 12) < 0.5,
        bioInsideCard: inside,
        portraitW: pr ? Math.round(pr.width) : 0,
        portraitAspect,
        portraitAspectOk: Math.abs(portraitAspect - targetAspect) < 0.08,
        portraitWidthOk: vw >= sm ? Math.round(pr?.width ?? 0) === 228 : true,
        objectPosition: pos,
        abhinavFocalOk: !isAbhinav || pos === "50% 8%",
        harjitFocalOk: !src.includes("harjit") || pos === "50% 0%",
      };
    });
    const harjit = bios.find((b) => b.src.includes("harjit"));
    const abhinav = bios.find((b) => b.src.includes("abhinav"));
    return {
      vw,
      sw,
      overflowX: sw > vw + 0.5,
      allBioFontOk: bios.every((b) => b.bioFontOk),
      allNameOk: bios.every((b) => b.nameFontOk),
      allBodyPadOk: bios.every((b) => b.bodyPadOk),
      allBioMarginOk: bios.every((b) => b.bioMarginOk),
      allBioInside: bios.every((b) => b.bioInsideCard),
      allPortraitOk: bios.every(
        (b) => b.portraitAspectOk && b.portraitWidthOk && b.abhinavFocalOk && b.harjitFocalOk,
      ),
      harjitObjectPosition: harjit?.objectPosition,
      abhinavObjectPosition: abhinav?.objectPosition,
      bios,
    };
  });
  out.push({ targetWidth: w, ...data });
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
