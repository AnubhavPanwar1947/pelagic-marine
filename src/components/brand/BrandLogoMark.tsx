type BrandLogoMarkProps = {
  size?: number;
  className?: string;
};

/** Compact logo mark for map loaders and inline badges */
export function BrandLogoMark({ size = 44, className = "" }: BrandLogoMarkProps) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src="/logo.png?v=2"
        alt=""
        width={size}
        height={size}
        decoding="async"
        className="block h-full w-full object-contain"
      />
    </div>
  );
}
