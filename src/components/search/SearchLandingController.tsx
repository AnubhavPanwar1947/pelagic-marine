"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { runSearchLanding } from "@/lib/search-landing-dom";

export function SearchLandingController() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("q") ?? "";
  const landExcerpt = searchParams.get("land") ?? "";
  const ranRef = useRef<string>("");

  useEffect(() => {
    if (pathname.replace(/\/$/, "") === "/search") {
      return;
    }
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const key = `${pathname}|${query}|${landExcerpt}|${hash}`;
    if (ranRef.current === key) {
      return;
    }

    let attempts = 0;
    const run = () => {
      const currentHash = window.location.hash;
      const done = runSearchLanding(query, currentHash, landExcerpt);
      if (done || attempts >= 12) {
        ranRef.current = `${pathname}|${query}|${landExcerpt}|${currentHash}`;
        return;
      }
      attempts += 1;
      window.setTimeout(run, 80);
    };

    requestAnimationFrame(run);

    const onHashChange = () => {
      ranRef.current = "";
      attempts = 0;
      run();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname, query, landExcerpt]);

  return null;
}
