import type { ReactNode } from "react";

type SectionMaritimeProps = {
  children: ReactNode;
  className?: string;
  /**
   * Logo-matched section washes (Gibbs & Cox–style distinct blocks).
   * No maritime graph — soft solid + mellow shade only.
   */
  variant?:
    | "sky"
    | "mist"
    | "sand"
    | "plain"
    | "delivery"
    | "services"
    | "decarb"
    | "why";
  as?: "section" | "div";
  /** @deprecated Graph removed sitewide — ignored */
  gridOpacity?: number;
};

const variants: Record<NonNullable<SectionMaritimeProps["variant"]>, string> = {
  sky: "bg-gradient-to-b from-[#eef6fc] via-white to-[#f3f9fb]",
  mist: "bg-gradient-to-b from-[#f3f9fb] via-white to-[#e8f2fa]",
  sand: "bg-gradient-to-b from-[#eef2f6] via-white to-[#f3f9fb]",
  plain: "bg-white",
  /* Homepage distinct blocks — logo navy / mid-blue / azure mixtures */
  delivery: "section-wash-delivery",
  services: "section-wash-services",
  decarb: "section-wash-decarb",
  why: "section-wash-why",
};

/** Branded section shell — logo-palette washes, no graph overlay. */
export function SectionMaritime({
  children,
  className = "",
  variant = "sky",
  as: Tag = "section",
}: SectionMaritimeProps) {
  return (
    <Tag className={`relative z-[1] overflow-hidden ${variants[variant]} ${className}`}>
      <div className="pointer-events-none absolute inset-0 section-shade" aria-hidden />
      <div className="relative">{children}</div>
    </Tag>
  );
}
