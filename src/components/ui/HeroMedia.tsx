/**
 * Full-bleed hero photo, capped at native width so ultrawide screens
 * don't upscale past 2400px (that softens/“distorts” a 16:9 asset).
 * Focal point: surveyor + jacket branding on the left.
 */
export function HeroMedia({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#071a33] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero.jpg?v=bridge-hd-1"
        alt="Pelagic Marine surveyor on the bridge overlooking harbour operations"
        width={2400}
        height={1350}
        className="absolute inset-0 h-full w-full object-cover object-[30%_42%] sm:object-[34%_40%] lg:object-[38%_38%] [image-rendering:auto]"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
