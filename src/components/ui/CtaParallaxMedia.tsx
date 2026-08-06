"use client";

import { useEffect, useRef } from "react";

/**
 * Next-step CTA background — CSS ken-burns + JS scroll parallax.
 * Motion is intentionally strong so it reads clearly behind the scrim.
 */
export function CtaParallaxMedia({ src }: { src: string }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;

    const apply = () => {
      const section = image.closest("section");
      if (!section) {
        raf = requestAnimationFrame(apply);
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = Math.min(Math.max((viewH - rect.top) / (viewH + rect.height), 0), 1);
      // Extra scroll drift layered on top of CSS ken-burns
      image.style.setProperty("--cta-scroll-y", `${(progress - 0.5) * 90}px`);
      raf = requestAnimationFrame(apply);
    };

    raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a2744]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt=""
        className="home-cta-kenburns absolute left-1/2 top-1/2 h-[130%] w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center will-change-transform"
        decoding="async"
        draggable={false}
      />
      <div className="home-cta-orb home-cta-orb--a pointer-events-none absolute inset-0" aria-hidden />
      <div className="home-cta-orb home-cta-orb--b pointer-events-none absolute inset-0" aria-hidden />
      <div className="home-cta-shimmer pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}
