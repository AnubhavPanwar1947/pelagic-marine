"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { searchSite, type SearchResult } from "@/lib/search-index";

const SEARCH_PLACEHOLDER = "Search services, projects and insights…";
const SEARCH_SUGGESTIONS = ["LNG", "Surveying", "Naval architecture"];

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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SearchResults({
  query,
  results,
  onSelect,
  onSuggestion,
}: {
  query: string;
  results: SearchResult[];
  onSelect: () => void;
  onSuggestion: (suggestion: string) => void;
}) {
  if (!query.trim()) {
    return (
      <div className="min-w-0 px-0.5 pt-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-pelagic-navy">
          Popular searches
        </p>
        <p className="mt-0.5 text-xs text-pelagic-slate">
          Start with a service, capability or topic.
        </p>
        <div className="mt-1 flex flex-col gap-0.5" role="group" aria-label="Popular searches">
          {SEARCH_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestion(suggestion)}
              className="flex min-h-11 w-full items-center truncate rounded-xl border border-pelagic-warm bg-white px-2.5 text-left text-sm font-semibold text-pelagic-navy transition hover:border-pelagic-accent hover:bg-pelagic-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-w-0 px-1 py-3 text-center">
        <p className="text-sm font-semibold text-pelagic-ink">
          No results for &ldquo;{query.trim()}&rdquo;
        </p>
        <p className="mt-1 text-xs text-pelagic-slate">
          Try a broader term such as LNG, surveying or engineering.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 pt-2">
      <div className="mb-0.5 flex items-center justify-between gap-2 px-0.5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-pelagic-navy">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
        <p className="text-[11px] text-pelagic-slate">Select a result</p>
      </div>
      <ul className="space-y-0.5">
        {results.map((item) => (
          <li key={`${item.href}-${item.title}`}>
            <Link
              href={item.href}
              onClick={onSelect}
              className="group flex items-start gap-2 rounded-xl border border-transparent px-2.5 py-1.5 transition hover:border-pelagic-warm hover:bg-pelagic-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
            >
              <span className="min-w-0 flex-1">
                <span className="inline-flex max-w-full rounded-full bg-pelagic-sky px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pelagic-accent">
                  {item.category}
                </span>
                <span className="mt-0.5 block line-clamp-2 break-words text-sm font-semibold leading-snug text-pelagic-ink">
                  {item.title}
                </span>
                {item.excerpt && (
                  <span className="mt-0.5 block line-clamp-2 break-words text-xs leading-relaxed text-pelagic-slate">
                    {item.excerpt}
                  </span>
                )}
              </span>
              <span
                className="mt-1 shrink-0 text-base text-pelagic-accent opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type NavSearchProps = {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NavSearch({ className, open, onOpenChange }: NavSearchProps) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldRestoreFocusRef = useRef(false);
  const inputId = useId();
  const closeSearch = useCallback((restoreFocus = false) => {
    shouldRestoreFocusRef.current = restoreFocus;
    setQuery("");
    onOpenChange(false);
  }, [onOpenChange]);
  const results = searchSite(query);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }

    if (shouldRestoreFocusRef.current) {
      triggerRef.current?.focus();
      shouldRestoreFocusRef.current = false;
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const root = panelRef.current;
    const trigger = triggerRef.current;
    if (!root || !trigger) return;

    const mobileQuery = window.matchMedia("(max-width: 59.9375rem)");

    const updatePosition = () => {
      if (!mobileQuery.matches) {
        root.style.removeProperty("--site-header-search-panel-top");
        return;
      }

      const rect = trigger.getBoundingClientRect();
      root.style.setProperty("--site-header-search-panel-top", `${rect.bottom + 8}px`);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    const observer = new ResizeObserver(updatePosition);
    observer.observe(trigger);

    return () => {
      window.removeEventListener("resize", updatePosition);
      observer.disconnect();
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch(true);
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [open, closeSearch]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeSearch(true);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [open, closeSearch]);

  const handleResultSelect = () => {
    closeSearch(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className ?? ""}`} ref={panelRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeSearch(false) : onOpenChange(true))}
        className={`flex h-11 w-11 items-center justify-center bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2 ${
          open ? "text-pelagic-accent" : "text-pelagic-navy hover:text-pelagic-accent"
        }`}
        aria-label={open ? "Close search" : "Open search"}
        aria-expanded={open}
        aria-controls="site-search-panel"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          id="site-search-panel"
          className="site-header-search-panel flex min-w-0 flex-col overflow-hidden"
          role="dialog"
          aria-label="Site search"
        >
          <label className="sr-only" htmlFor={inputId}>
            Search
          </label>
          <div className="site-header-search-input flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-pelagic-warm bg-pelagic-sky px-2.5 py-2 transition-colors focus-within:border-pelagic-accent focus-within:ring-2 focus-within:ring-pelagic-accent/15">
            <SearchIcon className="h-4 w-4 shrink-0 text-pelagic-slate" />
            <input
              id={inputId}
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={SEARCH_PLACEHOLDER}
              className="min-w-0 flex-1 truncate bg-transparent text-base text-pelagic-ink outline-none placeholder:text-pelagic-slate"
            />
            {query.trim() && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-pelagic-slate transition hover:bg-white hover:text-pelagic-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
                aria-label="Clear search"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            className="site-header-search-panel__results min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain"
            aria-live="polite"
          >
            <SearchResults
              query={query}
              results={results}
              onSelect={handleResultSelect}
              onSuggestion={handleSuggestionSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
