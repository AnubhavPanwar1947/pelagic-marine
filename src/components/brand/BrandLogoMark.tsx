const EMBLEM_ASPECT = 1.16;
const LOGO_SRC = "/logo.png?v=17";

type BrandLogoMarkProps = {
  size?: number;
  className?: string;
  shine?: boolean;
};

export function BrandLogoMark({ size = 56, className = "", shine = true }: BrandLogoMarkProps) {
  const height = size;
  const width = Math.round(size / EMBLEM_ASPECT);

  return (
    <div
      className={`brand-logo-shell relative shrink-0 overflow-visible ${shine ? "brand-logo-shine" : ""} ${className}`}
      style={{ width, height }}
      aria-hidden
    >
      <img
        src={LOGO_SRC}
        alt=""
        width={width}
        height={height}
        decoding="async"
        className="brand-logo-img relative z-[1] block h-full w-full object-contain object-center"
      />
      {shine && (
        <>
          <span className="brand-logo-armor-rim pointer-events-none absolute inset-0 z-[2]" />
          <span className="brand-logo-armor-glint pointer-events-none absolute inset-0 z-[3]" />
          <span className="brand-logo-shine-sweep pointer-events-none absolute inset-0 z-[4]" />
        </>
      )}
    </div>
  );
}
