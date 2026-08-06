"use client";

import { useEffect, useRef } from "react";

/**
 * Next-step CTA background with a clearer desktop parallax scroll.
 */
export function CtaParallaxMedia({ src }: { src: string }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const section = image.closest("section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // Progress while section crosses the viewport
      const progress = Math.min(Math.max((viewH - rect.top) / (viewH + rect.height), 0), 1);
      const offset = (progress - 0.5) * 80; // ±40px — visibly stronger than before
      image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-pelagic-navy">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt=""
        className="absolute inset-0 h-[120%] w-full object-cover object-center will-change-transform"
        style={{ transform: "translate3d(0, 0, 0) scale(1.12)" }}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
