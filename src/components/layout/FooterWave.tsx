/**
 * Full-bleed animated wave — ShoreSafe-style SVG parallax layers.
 * Spans complete left → right of the viewport.
 */
export function FooterWave({ className = "" }: { className?: string }) {
  return (
    <div className={`footer-wave ${className}`} aria-hidden>
      <svg
        className="footer-wave-svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="pelagic-gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="footer-wave-parallax">
          <use href="#pelagic-gentle-wave" x="48" y="0" fill="rgba(47, 168, 238, 0.22)" />
          <use href="#pelagic-gentle-wave" x="48" y="3" fill="rgba(255, 255, 255, 0.12)" />
          <use href="#pelagic-gentle-wave" x="48" y="5" fill="rgba(255, 255, 255, 0.2)" />
          <use href="#pelagic-gentle-wave" x="48" y="7" fill="rgba(255, 255, 255, 0.28)" />
        </g>
      </svg>
    </div>
  );
}
