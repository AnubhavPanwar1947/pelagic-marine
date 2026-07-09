"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";

const SPLASH_KEY = "pelagic-splash-seen";
const DURATION_MS = 3000;

export function SplashScreen() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    if (sessionStorage.getItem(SPLASH_KEY)) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setFadeOut(true), DURATION_MS - 400);
    const hideTimer = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setVisible(false);
      document.body.style.overflow = "";
    }, DURATION_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-pelagic-sky via-pelagic-cream to-pelagic-sunset transition-opacity duration-500 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="animate-splash-scale">
        <BrandLogo variant="header" linked={false} />
      </div>
      <p className="mt-6 text-sm font-medium tracking-[0.35em] text-pelagic-steel uppercase">
        Marine Consultants
      </p>
      <div className="mt-10 h-0.5 w-24 overflow-hidden rounded-full bg-pelagic-warm">
        <div className="h-full animate-splash-bar bg-pelagic-gold" />
      </div>
    </div>
  );
}
