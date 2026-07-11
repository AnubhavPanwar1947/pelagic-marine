import Image from "next/image";
import Link from "next/link";

const LOGO_CIRCLE_SRC = "/logo-circle.png?v=35";

type BrandLogoProps = {
  variant?: "header" | "footer" | "promo";
  linked?: boolean;
  compact?: boolean;
  shine?: boolean;
  /** Matches header `bg-white` vs `bg-white/90` when scrolled state changes */
  navSolid?: boolean;
};

function BrandLogoWordmark({
  compact = false,
  promo = false,
}: {
  compact?: boolean;
  promo?: boolean;
}) {
  return (
    <div
      className={`brand-logo-wordmark min-w-0 flex-col justify-center ${
        promo ? "brand-logo-wordmark--promo flex" : "hidden sm:flex"
      }`}
    >
      <span
        className={`brand-logo-wordmark-pelagic font-display block font-bold leading-none tracking-[0.05em] ${
          promo
            ? "text-3xl sm:text-4xl"
            : compact
              ? "text-base"
              : "text-lg lg:text-xl"
        }`}
      >
        PELAGIC
      </span>
      <span
        className={`brand-logo-wordmark-tagline mt-1 block font-semibold uppercase leading-none tracking-[0.24em] ${
          promo
            ? "mt-1.5 text-xs sm:text-sm"
            : compact
              ? "text-[9px]"
              : "text-[10px] lg:text-[11px]"
        }`}
      >
        Marine Solutions
      </span>
    </div>
  );
}

export function BrandLogo({
  variant = "header",
  linked = true,
  compact = false,
  shine = false,
  navSolid = true,
}: BrandLogoProps) {
  const isHeader = variant === "header";
  const isPromo = variant === "promo";
  const isFooter = variant === "footer";
  const showWordmark = isHeader || isFooter || isPromo;
  const lockupShine = showWordmark && (shine || isHeader || isFooter || isPromo);
  const markShine = shine && !showWordmark;

  const diameter = isPromo ? 200 : compact ? 92 : isHeader ? 124 : 96;

  const headerSurface = navSolid ? "bg-white" : "bg-white/90 backdrop-blur-md";

  const mark = (
    <div
      className={`brand-logo-circle group relative inline-flex shrink-0 transition-transform duration-300 group-hover:scale-[1.02] ${
        isPromo
          ? "brand-logo-circle--promo"
          : isHeader
            ? `brand-logo-circle--header ${headerSurface}`
            : ""
      }`}
      style={{ width: diameter, height: diameter }}
    >
      <div
        className={`brand-logo-shell brand-logo-shell--circle relative h-full w-full ${
          isPromo
            ? "brand-logo-shell--promo"
            : isHeader
              ? headerSurface
              : "bg-white"
        } ${markShine ? "brand-logo-shine" : ""}`}
      >
        <Image
          src={LOGO_CIRCLE_SRC}
          alt=""
          width={diameter}
          height={diameter}
          unoptimized
          className="brand-logo-img brand-logo-img--circle absolute inset-0 z-[1] h-full w-full object-contain object-center"
          priority={isHeader || isPromo}
        />
        {markShine && (
          <>
            <span className="brand-logo-armor-rim pointer-events-none absolute inset-0 z-[2]" aria-hidden />
            <span className="brand-logo-armor-glint pointer-events-none absolute inset-0 z-[3]" aria-hidden />
            <span className="brand-logo-shine-sweep pointer-events-none absolute inset-0 z-[4]" aria-hidden />
          </>
        )}
      </div>
    </div>
  );

  const content = (
    <div
      className={`brand-logo-lockup relative inline-flex items-center ${
        isPromo ? "gap-4 sm:gap-5" : "gap-2.5 sm:gap-3"
      } ${lockupShine ? "brand-logo-lockup--shine" : ""}`}
    >
      {mark}
      {showWordmark && <BrandLogoWordmark compact={compact} promo={isPromo} />}
      {lockupShine && (
        <span className="brand-logo-lockup-shine-sweep pointer-events-none" aria-hidden />
      )}
    </div>
  );

  if (linked) {
    return (
      <Link
        href="/"
        className="group inline-flex rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
        aria-label="Pelagic Marine Solutions — home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
