"use client";

import { ReactNode, useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

export type RevealVariant = "text" | "image" | "card" | "fade";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — keep under 300ms total per section */
  delay?: number;
  variant?: RevealVariant;
};

const VARIANT_CLASS: Record<RevealVariant, string> = {
  text: "reveal-on-scroll--text",
  image: "reveal-on-scroll--image",
  card: "reveal-on-scroll--card",
  fade: "reveal-on-scroll--fade",
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "text",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${VARIANT_CLASS[variant]} ${
        mounted && !inView ? "is-pending" : ""
      } ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
