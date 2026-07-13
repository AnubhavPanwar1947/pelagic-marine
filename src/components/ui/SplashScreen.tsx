"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SPLASH_KEY = "pelagic-splash-seen";
const DURATION_MS = 3000;
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
      className={`splash-screen fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="animate-splash-scale">
        <div className="brand-logo-lockup brand-logo-lockup--shine relative inline-block">
          <Image
            src={SPLASH_LOGO_SRC}
            alt="Pelagic Marine Solutions"
            width={480}
            height={701}
            priority
            unoptimized
            className="relative z-[1] h-auto w-[min(72vw,300px)] max-w-[320px] sm:w-[340px]"
          />
          <span className="brand-logo-lockup-shine-sweep pointer-events-none" aria-hidden />
        </div>
      </div>
      <div className="mt-10 h-0.5 w-24 overflow-hidden rounded-full bg-pelagic-sand/70">
        <div className="h-full animate-splash-bar bg-pelagic-accent/80" />
      </div>
    </div>
  );
}
