/**
 * Full-bleed hero photo.
 * Focal point: surveyor + jacket branding on the left — keep that in frame.
 */
export function HeroMedia({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero.jpg?v=bridge-6"
        alt="Pelagic Marine surveyor on the bridge overlooking harbour operations"
        width={2400}
        height={1350}
        className="absolute inset-0 h-full w-full object-cover object-[28%_center] sm:object-[32%_center] lg:object-[38%_center]"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
