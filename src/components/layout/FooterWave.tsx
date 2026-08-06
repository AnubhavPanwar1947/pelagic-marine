/**
 * Single-color animated wave (ShoreSafe-style).
 * Sits BEHIND footer copy so text stays readable.
 * Tall enough to cover ~half the footer.
 */
export function FooterWave({
  className = "",
  variant = "footer",
}: {
  className?: string;
  /** footer = tall half-height wave; bridge = transition between CTA and footer */
  variant?: "footer" | "bridge";
}) {
  const isBridge = variant === "bridge";

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
            id={isBridge ? "pelagic-bridge-wave" : "pelagic-gentle-wave"}
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="footer-wave-parallax">
          {/* One color only — soft white so navy footer text stays readable */}
          <use
            href={isBridge ? "#pelagic-bridge-wave" : "#pelagic-gentle-wave"}
            x="48"
            y="0"
            fill="rgba(255, 255, 255, 0.08)"
          />
        </g>
      </svg>
    </div>
  );
}
