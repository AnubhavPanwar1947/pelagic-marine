"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

type NavSearchProps = {
  className?: string;
};

export function NavSearch({ className }: NavSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isSearchPage = pathname.replace(/\/$/, "") === "/search";

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (event.key !== "k" && event.key !== "K") {
        return;
      }
      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }
      event.preventDefault();
      router.push("/search/");
    };
    document.addEventListener("keydown", onShortcut);
    return () => document.removeEventListener("keydown", onShortcut);
  }, [router]);

  const focusSearchPageInput = () => {
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLInputElement>(".site-search-page .site-search-field__input")
        ?.focus();
    });
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <Link
        href="/search/"
        className="flex h-11 w-11 items-center justify-center bg-transparent text-pelagic-navy transition-colors hover:text-pelagic-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2"
        aria-label="Open search"
        onClick={(event) => {
          if (isSearchPage) {
            event.preventDefault();
            focusSearchPageInput();
          }
        }}
      >
        <SearchIcon className="h-5 w-5" />
      </Link>
    </div>
  );
}
