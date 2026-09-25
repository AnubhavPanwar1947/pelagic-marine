import { chromium } from "playwright";

const widths = [50, 190, 320, 375, 480, 640, 768, 960, 1024, 1280, 1440];
const pages = [
  { path: "/", name: "home" },
  { path: "/team/", name: "team" },
  { path: "/services/", name: "services" },
  { path: "/contact/", name: "contact" },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const out = [];
for (const pg of pages) {
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(`http://localhost:3000${pg.path}`, {
      waitUntil: "networkidle",
    });
    const data = await page.evaluate(
      ({ pageName }) => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const bodyFont = getComputedStyle(document.body).fontFamily;
        const heading = document.querySelector("main h1, main h2");
        const headingFont = heading
          ? getComputedStyle(heading).fontFamily
          : "";
        const heroBrand = document.querySelector(".type-hero-brand");
        const heroFont = heroBrand
          ? getComputedStyle(heroBrand).fontFamily
          : null;
        const wordmark = document.querySelector(".brand-logo-wordmark-pelagic");
        const wordmarkFont = wordmark
          ? getComputedStyle(wordmark).fontFamily
          : null;

        const isInter = (ff) =>
          /inter/i.test(ff) &&
          !/montserrat/i.test(ff) &&
          !/cormorant/i.test(ff);
        const hasSegoeFallback = (ff) => /segoe ui/i.test(ff);

        let team = null;
        if (pageName === "team") {
          const abCard = document.querySelector(".team-member-card--abhinav");
          const bio = abCard?.querySelector(".team-member-card__bio");
          const portrait = abCard?.querySelector(".team-member-card__portrait");
          const name = abCard?.querySelector(".team-member-card__heading-name");
          const role = abCard?.querySelector(".team-member-card__heading-role");
          const sm = 640;
          const bioFs = bio
            ? parseFloat(getComputedStyle(bio).fontSize)
            : 0;
          const pr = portrait?.getBoundingClientRect();
          const cr = abCard?.getBoundingClientRect();
          const aspect =
            pr && pr.width > 0 ? pr.height / pr.width : 0;
          const nameRect = name?.getBoundingClientRect();
          const roleRect = role?.getBoundingClientRect();
          team = {
            bioFontPx: Math.round(bioFs * 10) / 10,
            bioFontOk: Math.abs(bioFs - 15.7) < 0.05,
            cardH: cr ? Math.round(cr.height) : 0,
            portraitW: pr ? Math.round(pr.width) : 0,
            portraitAspect: Math.round(aspect * 100) / 100,
            cardHeightOk: vw >= sm && cr && Math.abs(cr.height - 515) <= 4,
            portraitOk:
              vw >= sm
                ? Math.round(pr?.width ?? 0) === 228 &&
                  Math.abs(aspect - 2.25) < 0.08
                : Math.abs(aspect - 2.25) < 0.08,
            nameWraps:
              vw >= sm && nameRect && roleRect
                ? nameRect.height > 30 || roleRect.height > 22
                : null,
          };
        }

        return {
          vw,
          sw,
          overflowX: sw > vw + 0.5,
          bodyFont,
          headingFont,
          heroFont,
          wordmarkFont,
          bodyInter: isInter(bodyFont),
          headingInter: heading ? isInter(headingFont) : true,
          heroInter: heroFont ? isInter(heroFont) : true,
          wordmarkInter: wordmarkFont ? isInter(wordmarkFont) : true,
          bodySegoe: hasSegoeFallback(bodyFont),
          team,
        };
      },
      { pageName: pg.name },
    );
    out.push({ page: pg.name, targetWidth: w, ...data });
  }
}
await browser.close();
console.log(JSON.stringify(out, null, 2));
