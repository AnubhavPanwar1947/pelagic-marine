"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export const REVEAL_OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -10% 0px",
};

type UseInViewOptions = {
  once?: boolean;
  observerOptions?: IntersectionObserverInit;
};

export function useInView<T extends Element>(
  options: UseInViewOptions = {}
): { ref: RefObject<T | null>; inView: boolean } {
  const { once = true, observerOptions = REVEAL_OBSERVER_OPTIONS } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      observerOptions
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, observerOptions]);

  return { ref, inView };
}
