"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed hero photo with scroll parallax.
 * Image moves slower than page scroll — classic marine/landing pattern.
 */
export function HeroMedia({ className = "" }: { className?: string }) {
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
      const sectionHeight = section.offsetHeight || 1;
      // Move image opposite to scroll, capped so it stays covered
      const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1.4);
      const offset = progress * 90; // px — subtle, professional
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
    <div className={`absolute inset-0 overflow-hidden bg-pelagic-navy ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src="/images/hero.jpg?v=bridge-3"
        alt="Pelagic Marine surveyor on the bridge overlooking harbour operations"
        className="absolute inset-0 h-[120%] w-full object-cover object-center will-change-transform"
        style={{ top: "-10%", transform: "translate3d(0, 0, 0) scale(1.12)" }}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
