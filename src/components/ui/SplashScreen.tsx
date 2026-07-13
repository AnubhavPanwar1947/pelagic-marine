"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SPLASH_KEY = "pelagic-splash-seen";
const DURATION_MS = 2400;
const SPLASH_LOGO_SRC = "/logo-full.png";

export function SplashScreen() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    if (sessionStorage.getItem(SPLASH_KEY)) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setFadeOut(true), DURATION_MS - 350);
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
      className={`splash-screen fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="animate-splash-scale">
        <div className="splash-logo-wrap relative inline-block">
          <Image
            src={SPLASH_LOGO_SRC}
            alt="Pelagic Marine Solutions"
            width={280}
            height={409}
            priority
            unoptimized
            className="relative z-[1] h-auto w-[min(42vw,148px)] max-w-[160px] sm:w-[168px]"
          />
          <span className="splash-logo-shine pointer-events-none" aria-hidden />
        </div>
      </div>
      <div className="mt-8 h-px w-16 overflow-hidden rounded-full bg-pelagic-sand/80">
        <div className="h-full animate-splash-bar bg-pelagic-accent/70" />
      </div>
    </div>
  );
}
