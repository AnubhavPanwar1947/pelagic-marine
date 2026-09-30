"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SPLASH_KEY = "pelagic-splash-seen";
const DURATION_MS = 2400;
const SPLASH_LOGO_SRC = "/splash-screen.png";
const SPLASH_LOGO_WIDTH = 500;
const SPLASH_LOGO_HEIGHT = 500;

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
      className={`splash-screen fixed inset-0 z-[100] flex min-h-0 flex-col items-center justify-center overflow-y-auto overscroll-contain p-4 transition-opacity duration-500 ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="animate-splash-scale">
        <div className="splash-logo-wrap relative inline-block">
          <Image
            src={SPLASH_LOGO_SRC}
            alt="Pelagic Marine"
            width={SPLASH_LOGO_WIDTH}
            height={SPLASH_LOGO_HEIGHT}
            priority
            className="splash-logo-img"
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
