/**
 * Homepage images — add your own files to: public/images/
 *
 * Drop JPG or PNG files with these exact names (see public/images/README.txt).
 * After adding a file, save and refresh the browser — no code change needed.
 */
export const siteImages = {
  hero: "/images/hero.jpg",
  expertise: "/images/expertise.jpg",
  team: "/images/team.jpg",
  cta: "/images/cta-bg.jpg",
  cases: [
    "/images/case-1.jpg",
    "/images/case-2.jpg",
    "/images/case-3.jpg",
  ],
} as const;

/** Optional hero background video — add public/videos/hero.mp4 (keep under ~8 MB) */
export const siteVideos = {
  hero: "/videos/hero.mp4",
} as const;
