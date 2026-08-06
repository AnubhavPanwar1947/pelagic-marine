"use client";

import { useEffect, useRef } from "react";

/**
 * Next-step CTA background — strong ken-burns + scroll parallax so motion is obvious.
 */
export function CtaParallaxMedia({ src }: { src: string }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      image.style.transform = "translate3d(0, 0, 0) scale(1.12)";
      return;
    }

    let raf = 0;
    let start = performance.now();

    const apply = (now: number) => {
      const section = image.closest("section");
      if (!section) {
        raf = requestAnimationFrame(apply);
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = Math.min(Math.max((viewH - rect.top) / (viewH + rect.height), 0), 1);
      const scrollOffset = (progress - 0.5) * 110;

      const t = (now - start) / 1000;
      // Visible ambient motion (~±24px, clear zoom pulse)
      const driftY = Math.sin(t * 0.35) * 24;
      const driftX = Math.cos(t * 0.22) * 18;
      const pulse = 1.14 + Math.sin(t * 0.28) * 0.06;

      image.style.transform = `translate3d(${driftX}px, ${scrollOffset + driftY}px, 0) scale(${pulse})`;
      raf = requestAnimationFrame(apply);
    };

    raf = requestAnimationFrame(apply);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-pelagic-navy">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt=""
        className="absolute -inset-[8%] h-[116%] w-[116%] max-w-none object-cover object-center will-change-transform"
        style={{ transform: "translate3d(0, 0, 0) scale(1.14)" }}
        decoding="async"
        draggable={false}
      />
      <div className="home-cta-orb home-cta-orb--a pointer-events-none absolute inset-0" aria-hidden />
      <div className="home-cta-orb home-cta-orb--b pointer-events-none absolute inset-0" aria-hidden />
      <div className="home-cta-shimmer pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}
