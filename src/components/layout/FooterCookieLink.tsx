"use client";

import { openCookieSettings } from "@/lib/consent";

export function FooterCookieLink() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="text-blue-100/90 underline-offset-2 hover:text-white hover:underline"
    >
      Cookies &amp; cache
    </button>
  );
}
