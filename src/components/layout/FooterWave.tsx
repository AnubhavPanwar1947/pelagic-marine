/**
 * Soft animated waves (ShoreSafe-style).
 * Exactly 3 layers, very low opacity, slow motion — behind footer copy.
 */
export function FooterWave({
  className = "",
  variant = "footer",
}: {
  className?: string;
  variant?: "footer" | "bridge";
}) {
  const isBridge = variant === "bridge";
  const pathId = isBridge ? "pelagic-bridge-wave" : "pelagic-gentle-wave";

  return (
    <div
      className={`${isBridge ? "footer-wave-bridge" : "footer-wave"} ${className}`}
      aria-hidden
    >
      <svg
        className={isBridge ? "footer-wave-bridge-svg" : "footer-wave-svg"}
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id={pathId}
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="footer-wave-parallax">
          {/* 3 waves only — same soft white, increasing opacity slightly */}
          <use href={`#${pathId}`} x="48" y="0" fill="rgba(255, 255, 255, 0.035)" />
          <use href={`#${pathId}`} x="48" y="3" fill="rgba(255, 255, 255, 0.05)" />
          <use href={`#${pathId}`} x="48" y="5" fill="rgba(255, 255, 255, 0.07)" />
        </g>
      </svg>
    </div>
  );
}
