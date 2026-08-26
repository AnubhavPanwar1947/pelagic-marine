/** Shared `sizes` values aligned to layout containers (max-w-7xl, grids, cards). */
export const imageSizes = {
  fullViewport: "100vw",
  pageHero: "100vw",
  /** Two-column content inside max-w-7xl (lg:grid-cols-2). */
  contentHalf:
    "(max-width: 1023px) calc(100vw - 2rem), min(36rem, calc((min(100vw, 80rem) - 4rem) / 2))",
  /** Three-column project cards (lg:grid-cols-3). */
  projectCard:
    "(max-width: 1023px) calc(100vw - 2rem), min(24rem, calc((min(100vw, 80rem) - 4rem) / 3))",
  /** News list thumbnail (md:grid-cols-[280px_1fr]). */
  newsCard: "(max-width: 767px) calc(100vw - 2rem), 280px",
  /** Sector cards (md:grid-cols-2). */
  sectorCard:
    "(max-width: 767px) calc(100vw - 2rem), min(22rem, calc((min(100vw, 80rem) - 4rem) / 2))",
  /** Team portrait column (sm: 11.5rem). */
  teamPortrait: "(max-width: 639px) calc(100vw - 2rem), 184px",
  /** Office cards in contact grid. */
  officeCard:
    "(max-width: 1023px) calc(100vw - 2rem), min(24rem, calc((min(100vw, 80rem) - 4rem) / 2))",
  /** Contact hero decorative panel (hidden below lg). */
  contactHero: "(max-width: 1023px) 0px, 50vw",
  /** Full-width banner inside max-w-7xl section. */
  sectionBanner:
    "(max-width: 639px) calc(100vw - 2rem), min(72rem, calc(100vw - 4rem))",
} as const;
