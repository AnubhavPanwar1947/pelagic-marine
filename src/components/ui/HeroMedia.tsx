/**
 * Full-bleed hero photo — image only, no overlays / parallax / scale.
 * Source: 2400×1350 (16:9). Prefer 2560×1440+ for retina.
 */
export function HeroMedia({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero.jpg?v=bridge-5"
        alt="Pelagic Marine surveyor on the bridge overlooking harbour operations"
        width={2400}
        height={1350}
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
