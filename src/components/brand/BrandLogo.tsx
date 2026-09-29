import Image from "next/image";
import Link from "next/link";
import {
  BRAND_LOGO_CIRCLE_SRC,
  BRAND_LOGO_HORIZONTAL_HEIGHT,
  BRAND_LOGO_HORIZONTAL_SRC,
  BRAND_LOGO_HORIZONTAL_WIDTH,
} from "@/components/brand/BrandLogoMark";

type BrandLogoProps = {
  variant?: "header" | "footer" | "promo";
  linked?: boolean;
  compact?: boolean;
  shine?: boolean;
};

function BrandLogoWordmark({
  compact = false,
  promo = false,
  footer = false,
}: {
  compact?: boolean;
  promo?: boolean;
  footer?: boolean;
}) {
  return (
    <div
      className={`brand-logo-wordmark min-w-0 flex-col justify-center ${
        promo
          ? "brand-logo-wordmark--promo flex"
          : footer
            ? "brand-logo-wordmark--footer flex"
            : "brand-logo-wordmark--header hidden min-[17.5rem]:flex"
      }`}
    >
      <span
        className={`brand-logo-wordmark-pelagic block font-bold uppercase leading-none ${
          promo
            ? "text-3xl sm:text-4xl"
            : footer
              ? "text-base sm:text-lg"
              : compact
                ? "text-base"
                : "text-lg lg:text-xl"
        }`}
      >
        PELAGIC
      </span>
      <span
        className={`brand-logo-wordmark-tagline mt-0.5 block font-normal uppercase leading-none ${
          promo
            ? "text-xs sm:text-sm"
            : footer
              ? "text-[9px] sm:text-[10px]"
              : compact
                ? "text-[9px]"
                : "text-[10px] lg:text-[11px]"
        }`}
      >
        MARINE
      </span>
    </div>
  );
}

function BrandLogoCircleMark({
  diameter,
  isHeader,
  isFooter,
  isPromo,
  priority,
}: {
  diameter: number;
  isHeader: boolean;
  isFooter: boolean;
  isPromo: boolean;
  priority: boolean;
}) {
  return (
    <div
      className={`brand-logo-anchor-slot relative shrink-0${
        isHeader ? " brand-logo-anchor-slot--header brand-logo-anchor-slot--header-fallback" : ""
      }${isFooter ? " brand-logo-anchor-slot--footer" : ""}`}
      style={isHeader || isFooter ? undefined : { width: diameter, height: diameter }}
    >
      <div
        className={`brand-logo-circle absolute inset-0 inline-flex ${
          isPromo
            ? "brand-logo-circle--promo"
            : isHeader || isFooter
              ? "brand-logo-circle--header"
              : ""
        }`}
      >
        <div
          className={`brand-logo-shell brand-logo-shell--circle relative h-full w-full ${
            isPromo
              ? "brand-logo-shell--promo"
              : isHeader || isFooter
                ? "brand-logo-shell--header"
                : "bg-white"
          }`}
        >
          <Image
            src={BRAND_LOGO_CIRCLE_SRC}
            alt=""
            width={isHeader ? 100 : isFooter ? 88 : diameter}
            height={isHeader ? 100 : isFooter ? 88 : diameter}
            className="brand-logo-img brand-logo-img--circle absolute inset-0 z-[1] h-full w-full object-contain object-center"
            priority={priority}
          />
        </div>
      </div>
    </div>
  );
}

export function BrandLogo({
  variant = "header",
  linked = true,
  compact = false,
  shine = false,
}: BrandLogoProps) {
  const isHeader = variant === "header";
  const isPromo = variant === "promo";
  const isFooter = variant === "footer";
  const showWordmark = isFooter || isPromo;
  const lockupShine = shine && showWordmark;

  const diameter = isPromo ? 200 : compact ? 92 : isFooter ? 88 : isHeader ? 100 : 96;

  const headerFullLogo = isHeader ? (
    <div className="brand-logo-full-svg min-h-0 min-w-0 shrink" aria-hidden>
      <Image
        src={BRAND_LOGO_HORIZONTAL_SRC}
        alt=""
        width={BRAND_LOGO_HORIZONTAL_WIDTH}
        height={BRAND_LOGO_HORIZONTAL_HEIGHT}
        className="brand-logo-full-svg__img"
        sizes="(min-width: 60rem) 320px, (min-width: 40rem) 280px, 200px"
        priority
      />
    </div>
  ) : null;

  const mark = (
    <BrandLogoCircleMark
      diameter={diameter}
      isHeader={isHeader}
      isFooter={isFooter}
      isPromo={isPromo}
      priority={isHeader || isPromo}
    />
  );

  const content = (
    <div
      className={`brand-logo-lockup relative inline-flex min-w-0 items-center${
        isPromo ? " brand-logo-lockup--promo" : ""
      }${isHeader ? " brand-logo-lockup--header brand-logo-lockup--header-svg" : ""}${
        isFooter ? " brand-logo-lockup--footer" : ""
      }${compact && isHeader ? " brand-logo-lockup--compact" : ""} ${lockupShine ? "brand-logo-lockup--shine" : ""}`}
    >
      {headerFullLogo}
      {mark}
      {showWordmark && (
        <div className="brand-logo-wordmark-group inline-flex items-stretch">
          <span className="brand-logo-lockup-divider shrink-0" aria-hidden />
          <BrandLogoWordmark compact={compact} promo={isPromo} footer={isFooter} />
        </div>
      )}
      {lockupShine && (
        <span className="brand-logo-lockup-shine-sweep pointer-events-none" aria-hidden />
      )}
    </div>
  );

  if (linked) {
    return (
      <Link
        href="/"
        className={`group inline-flex min-w-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent${
          isHeader ? " brand-logo-home-link" : ""
        }`}
        aria-label="Pelagic Marine — home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
