type BrandLogoMarkProps = {
  size?: number;
  className?: string;
};

/** Circular emblem with gold armor — sized container for map loaders and inline marks */
export function BrandLogoMark({ size = 44, className = "" }: BrandLogoMarkProps) {
  const frameSize = size + 10;

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: frameSize, height: frameSize }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-pelagic-gold/45 via-pelagic-gold-light/25 to-pelagic-gold/45 opacity-80 blur-sm" />
      <div className="logo-armor relative flex h-full w-full items-center justify-center rounded-full p-[3px] shadow-md shadow-pelagic-gold/20">
        <div className="logo-armor-shine pointer-events-none absolute inset-0 z-20 rounded-full" />
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white via-pelagic-sand to-white p-[2px] ring-1 ring-pelagic-gold/60">
          <img
            src="/logo.svg"
            alt=""
            width={size}
            height={size}
            decoding="async"
            className="relative z-10 block rounded-full object-contain contrast-[1.08] saturate-[1.05]"
            style={{ width: size, height: size }}
          />
        </div>
      </div>
    </div>
  );
}
