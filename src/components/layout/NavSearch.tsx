"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { searchSite, type SearchResult } from "@/lib/search-index";

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

export function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResults(searchSite(query));
  }, [query]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-pelagic-warm bg-pelagic-cream text-pelagic-steel transition hover:border-pelagic-gold hover:text-pelagic-gold"
        aria-label="Search site"
        aria-expanded={open}
      >
        <SearchIcon className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-pelagic-sand bg-white p-3 shadow-xl sm:w-80">
          <label className="sr-only" htmlFor="nav-search">
            Search
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-pelagic-warm bg-pelagic-cream px-3 py-2">
            <SearchIcon className="h-4 w-4 shrink-0 text-pelagic-slate" />
            <input
              id="nav-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Services, sectors, news…"
              className="w-full bg-transparent text-sm text-pelagic-ink outline-none placeholder:text-pelagic-slate"
            />
          </div>

          {query.trim() && (
            <ul className="mt-2 max-h-64 overflow-y-auto">
              {results.length === 0 ? (
                <li className="px-2 py-3 text-sm text-pelagic-slate">No results found.</li>
              ) : (
                results.map((item) => (
                  <li key={`${item.href}-${item.title}`}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-2.5 transition hover:bg-pelagic-cream"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pelagic-gold">
                        {item.category}
                      </span>
                      <p className="text-sm font-medium text-pelagic-ink">{item.title}</p>
                      {item.excerpt && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-pelagic-slate">
                          {item.excerpt}
                        </p>
                      )}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}

          {!query.trim() && (
            <p className="mt-2 px-1 text-xs text-pelagic-slate">
              Try &quot;LNG&quot;, &quot;survey&quot;, or &quot;careers&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
