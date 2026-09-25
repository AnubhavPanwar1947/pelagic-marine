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
        const sm = 640;
        const pill = document.querySelector("main .btn-responsive");
        const pillStyle = pill ? getComputedStyle(pill) : null;
        const pillRect = pill?.getBoundingClientRect();
        const headerCta = document.querySelector(".site-header-contact-cta");
        const headerStyle = headerCta ? getComputedStyle(headerCta) : null;
        const submit =
          document.querySelector(".contact-submit-btn:not(.hidden)") ||
          document.querySelector(".contact-submit-btn");
        const submitStyle = submit ? getComputedStyle(submit) : null;
        const parse = (s) => (s ? parseFloat(s) : 0);
        let team = null;
        if (pageName === "team") {
          const bio = document.querySelector(
            ".team-member-card--abhinav .team-member-card__bio",
          );
          const card = document.querySelector(".team-member-card--abhinav");
          const portrait = card?.querySelector(".team-member-card__portrait");
          const bioFs = bio ? parse(getComputedStyle(bio).fontSize) : 0;
          const cr = card?.getBoundingClientRect();
          const pr = portrait?.getBoundingClientRect();
          const aspect =
            pr && pr.width > 0 ? pr.height / pr.width : 0;
          team = {
            bioFontOk: Math.abs(bioFs - 15.7) < 0.05,
            cardHeightOk: vw >= sm && cr && Math.abs(cr.height - 515) <= 4,
            portraitOk:
              vw >= sm
                ? Math.round(pr?.width ?? 0) === 228 &&
                  Math.abs(aspect - 2.25) < 0.08
                : Math.abs(aspect - 2.25) < 0.08,
          };
        }
        const labelInside =
          pill &&
          pillRect &&
          pill.scrollWidth <= pillRect.width + 2 &&
          pill.scrollHeight <= pillRect.height + 4;
        return {
          vw,
          sw,
          overflowX: sw > vw + 0.5,
          pill: pill
            ? {
                weight: parse(pillStyle.fontWeight),
                weightOk: parse(pillStyle.fontWeight) === 500,
                inter: /inter/i.test(pillStyle.fontFamily),
                synthesis: pillStyle.fontSynthesis,
                synthesisOk: pillStyle.fontSynthesis === "none",
                fontSize: parse(pillStyle.fontSize),
                lineHeight: pillStyle.lineHeight,
                letterSpacing: pillStyle.letterSpacing,
                labelInside: labelInside || pillRect.width === 0,
              }
            : null,
          headerContact:
            headerStyle && headerCta?.offsetParent !== null
              ? {
                  weight: parse(headerStyle.fontWeight),
                  weightOk: parse(headerStyle.fontWeight) === 500,
                  synthesisOk: headerStyle.fontSynthesis === "none",
                }
              : headerCta
                ? { hidden: true }
                : null,
          contactSubmit: submitStyle
            ? {
                weight: parse(submitStyle.fontWeight),
                weightOk: parse(submitStyle.fontWeight) === 500,
                synthesisOk: submitStyle.fontSynthesis === "none",
                visible: submit && !submit.classList.contains("hidden"),
              }
            : null,
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
