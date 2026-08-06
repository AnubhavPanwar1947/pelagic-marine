"use client";

import { useEffect, useRef } from "react";

/**
 * Next-step CTA background — scroll parallax + slow ambient drift.
 */
export function CtaParallaxMedia({ src }: { src: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let frame = 0;
    let raf = 0;
    let start = performance.now();

    const apply = (now: number) => {
      const section = image.closest("section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = Math.min(Math.max((viewH - rect.top) / (viewH + rect.height), 0), 1);
      scrollY.current = (progress - 0.5) * 72;

      const t = (now - start) / 1000;
      const driftY = Math.sin(t * 0.18) * 10;
      const driftX = Math.cos(t * 0.12) * 6;
      const pulse = 1.1 + Math.sin(t * 0.15) * 0.025;

      image.style.transform = `translate3d(${driftX}px, ${scrollY.current + driftY}px, 0) scale(${pulse})`;
      raf = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
      });
    };

    raf = requestAnimationFrame(apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-pelagic-navy">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt=""
        className="absolute inset-0 h-[125%] w-full object-cover object-center will-change-transform"
        style={{ transform: "translate3d(0, 0, 0) scale(1.12)" }}
        decoding="async"
        draggable={false}
      />
      {/* Soft animated light wash over the photo */}
      <div className="home-cta-light pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}
