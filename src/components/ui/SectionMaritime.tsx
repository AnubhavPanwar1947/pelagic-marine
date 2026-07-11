import type { ReactNode } from "react";

type SectionMaritimeProps = {
  children: ReactNode;
  className?: string;
  /** 0–100 — graph visibility on section backdrop */
  gridOpacity?: number;
  variant?: "sky" | "mist" | "sand" | "plain";
  as?: "section" | "div";
};

const variants = {
  sky: "bg-gradient-to-b from-pelagic-sky/35 via-white to-pelagic-mist/25",
  mist: "bg-gradient-to-b from-pelagic-mist/40 via-white to-pelagic-sky/20",
  sand: "bg-gradient-to-b from-pelagic-sand/30 via-white to-pelagic-mist/20",
  plain: "bg-white",
};

/** Branded section shell — soft blue wash + maritime graph (sections only; cards stay plain). */
export function SectionMaritime({
  children,
  className = "",
  gridOpacity = 46,
  variant = "sky",
  as: Tag = "section",
}: SectionMaritimeProps) {
  return (
    <Tag className={`relative overflow-hidden ${variants[variant]} ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-maritime-grid"
        style={{ opacity: gridOpacity / 100 }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
