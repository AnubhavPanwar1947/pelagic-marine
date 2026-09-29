import Image from "next/image";

export const BRAND_LOGO_CIRCLE_SRC = "/logo-circle.png?v=35";

/** Full horizontal lockup on light / white backgrounds. */
export const BRAND_LOGO_HORIZONTAL_SRC = "/images/icons/logo.svg";

/** Full horizontal lockup on dark or transparent backgrounds. */
export const BRAND_LOGO_WHITE_HORIZONTAL_SRC = "/images/icons/white-logo.svg";
export const BRAND_LOGO_HORIZONTAL_WIDTH = 150;
export const BRAND_LOGO_HORIZONTAL_HEIGHT = 45;

type BrandLogoMarkProps = {
  size?: number;
  className?: string;
};

export function BrandLogoMark({ size = 56, className = "" }: BrandLogoMarkProps) {
  return (
    <div
      className={`brand-logo-circle relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="brand-logo-shell brand-logo-shell--circle relative h-full w-full">
        <Image
          src={BRAND_LOGO_CIRCLE_SRC}
          alt=""
          width={size}
          height={size}
          className="brand-logo-img brand-logo-img--circle absolute inset-0 z-[1] h-full w-full object-contain object-center"
        />
      </div>
    </div>
  );
}
