const LOGO_CIRCLE_SRC = "/logo-circle.png?v=32";

type BrandLogoMarkProps = {
  size?: number;
  className?: string;
  shine?: boolean;
};

export function BrandLogoMark({ size = 56, className = "", shine = false }: BrandLogoMarkProps) {
  return (
    <div
      className={`brand-logo-circle relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className={`brand-logo-shell brand-logo-shell--circle relative h-full w-full ${shine ? "brand-logo-shine" : ""}`}
      >
        <img
          src={LOGO_CIRCLE_SRC}
          alt=""
          width={size}
          height={size}
          decoding="async"
          className="brand-logo-img brand-logo-img--circle absolute inset-0 z-[1] h-full w-full object-contain object-center"
        />
        {shine && (
          <>
            <span className="brand-logo-armor-rim pointer-events-none absolute inset-0 z-[2]" />
            <span className="brand-logo-armor-glint pointer-events-none absolute inset-0 z-[3]" />
            <span className="brand-logo-shine-sweep pointer-events-none absolute inset-0 z-[4]" />
          </>
        )}
      </div>
    </div>
  );
}
