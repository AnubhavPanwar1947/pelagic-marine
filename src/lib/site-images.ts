/**
 * Site imagery — local files in public/images/ take priority when present.
 * Remote Unsplash URLs are fallbacks (allowed in next.config.ts); Next.js optimizes them.
 * Replace any URL with a local path (e.g. "/images/case-1.jpg") when boss-approved photos arrive.
 */
function u(id: string, w: number, h: number, q = 88) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;
}

export const siteImages = {
  hero: "/images/hero.jpg",
  contactHero: "/images/contact-hero.jpg",
  expertise: u("photo-1578645024771-21df5e60af96", 1200, 1500),
  team: u("photo-1529107386315-5eafae266a63", 2400, 1000),
  cta: u("photo-1544551763-5cf5a5c5e61d", 2400, 1400),
  decarbonization: u("photo-1532601228370-a1c69299fc04", 1920, 1080),
  cases: [
    u("photo-1611270627529-a18006394599", 1200, 750),
    u("photo-1494412578317-4c933aa5369f", 1200, 750),
    u("photo-1543832928-1e1c7ca855f3", 1200, 750),
  ],
  sectors: {
    "maritime-shipping": u("photo-1494412578317-4c933aa5369f", 900, 600),
    "offshore-oil-gas": u("photo-1544551763-46a013bb70d5", 900, 600),
    renewables: u("photo-1532601228370-a1c69299fc04", 900, 600),
    "ports-infrastructure": "/images/contact-hero.jpg",
  },
  pageHeroes: {
    about: u("photo-1529107386315-5eafae266a63", 2400, 1200),
    services: u("photo-1578645024771-21df5e60af96", 2400, 1200),
    sectors: u("photo-1544551763-46a013bb70d5", 2400, 1200),
    projects: "/images/contact-hero.jpg",
    decarbonization: u("photo-1473341303090-7cfada5af405", 2400, 1200),
    news: u("photo-1497366216548-37526070297c", 2400, 1200),
    careers: u("photo-1521737711862-ece3dec7f191", 2400, 1200),
  },
  news: [
    u("photo-1497366216548-37526070297c", 800, 500),
    u("photo-1558618666-fcd25c85cd64", 800, 500),
    u("photo-1611270627529-a18006394599", 800, 500),
  ],
  /** Office card headers — replace with boss-approved photos when ready */
  offices: [
    "/images/port-test.jpg",
    u("photo-1529107386315-5eafae266a63", 900, 500),
    u("photo-1512453979798-5ea266f8880c", 900, 500),
  ],
} as const;

/** Optional hero background video — add public/videos/hero.mp4 (keep under ~8 MB) */
export const siteVideos = {
  hero: "/videos/hero.mp4",
} as const;
