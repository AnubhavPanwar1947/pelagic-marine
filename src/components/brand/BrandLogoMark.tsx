import Image from "next/image";

export const BRAND_LOGO_CIRCLE_SRC = "/logo-circle.png?v=35";

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
