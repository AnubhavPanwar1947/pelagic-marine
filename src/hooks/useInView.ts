"use client";

import { RefObject, useLayoutEffect, useRef, useState } from "react";

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
): { ref: RefObject<T | null>; inView: boolean; armed: boolean } {
  const { once = true, observerOptions = REVEAL_OBSERVER_OPTIONS } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setInView(true);
      setArmed(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const initiallyVisible =
      rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;
    if (initiallyVisible) {
      setInView(true);
      setArmed(true);
      if (once) return;
    } else {
      setArmed(true);
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

  return { ref, inView, armed };
}
