"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  applyPersistentHighlights,
  findFallbackSearchTarget,
  flashSearchTarget,
  focusSearchTarget,
  scrollElementBelowHeader,
} from "@/lib/search-landing-dom";
import { SEARCH_MIN_QUERY_LENGTH } from "@/lib/search-index";

function runLandingHighlight(query: string, hash: string): boolean {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return true;
  }

  let target: HTMLElement | null = null;
  const anchorId = hash.replace(/^#/, "");
  if (anchorId) {
    target = document.getElementById(anchorId);
  }
  if (!target) {
    target = findFallbackSearchTarget(trimmed);
  }
  if (!target) {
    return false;
  }

  scrollElementBelowHeader(target);
  applyPersistentHighlights(target, trimmed);
  flashSearchTarget(target);
  focusSearchTarget(target);
  return true;
}

export function SearchLandingController() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("q") ?? "";
  const ranRef = useRef<string>("");

  useEffect(() => {
    if (pathname.replace(/\/$/, "") === "/search") {
      return;
    }
    const key = `${pathname}|${query}|${typeof window !== "undefined" ? window.location.hash : ""}`;
    if (ranRef.current === key) {
      return;
    }

    let attempts = 0;
    const run = () => {
      const hash = window.location.hash;
      const done = runLandingHighlight(query, hash);
      if (done || attempts >= 12) {
        ranRef.current = `${pathname}|${query}|${hash}`;
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
  }, [pathname, query]);

  return null;
}
