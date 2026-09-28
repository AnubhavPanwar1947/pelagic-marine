"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  countSearchResultsByFilterGroup,
  filterSearchResultsByGroup,
  isFilterChipDisabled,
  isKeepTypingQuery,
  SEARCH_DEBOUNCE_MS,
  SEARCH_FILTER_GROUPS,
  searchSiteAllMatches,
  splitTextByHighlights,
  type SearchFilterId,
  type SearchResult,
} from "@/lib/search-index";

const SEARCH_PLACEHOLDER = "Search services, projects and insights…";
const SEARCH_SUGGESTIONS = ["LNG", "Surveying", "Naval architecture"];
const RECENT_SEARCHES_KEY = "pelagic-marine-search-recent";
const MAX_RECENT = 8;
const SEARCH_PANEL_FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function readRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const entry of parsed) {
      if (typeof entry !== "string") {
        continue;
      }
      const trimmed = entry.trim();
      if (!trimmed) {
        continue;
      }
      const key = trimmed.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      deduped.push(trimmed);
    }
    return deduped;
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2 || typeof window === "undefined") {
    return;
  }
  const existing = readRecentSearches().filter(
    (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
  );
  const next = [trimmed, ...existing].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / privacy errors.
  }
}

function clearRecentSearchesStorage() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore.
  }
}

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

function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => splitTextByHighlights(text, query), [text, query]);
  return (
    <>
      {parts.map((part, index) =>
        part.highlight ? (
          <mark key={`${part.text}-${index}`} className="site-header-search-highlight">
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}

function isFocusablePanelElement(element: Element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  if (element.hasAttribute("disabled")) {
    return false;
  }
  return element.getClientRects().length > 0;
}

type NavSearchProps = {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NavSearch({ className, open, onOpenChange }: NavSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [resultFilter, setResultFilter] = useState<SearchFilterId>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestoreFocusRef = useRef(false);

  const inputId = useId();
  const listboxId = useId();
  const escapeHintId = useId();

  const closeSearch = useCallback(
    (restoreFocus = false) => {
      shouldRestoreFocusRef.current = restoreFocus;
      setQuery("");
      setDebouncedQuery("");
      setActiveIndex(-1);
      setResultFilter("all");
      onOpenChange(false);
    },
    [onOpenChange],
  );

  const flushDebouncedQuery = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setDebouncedQuery(query);
  }, [query]);

  const runSearchQuery = useCallback((term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    setActiveIndex(-1);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    inputRef.current?.focus();
  }, []);

  const trimmedQuery = query.trim();
  const trimmedDebounced = debouncedQuery.trim();
  const debouncedSearchable =
    trimmedDebounced.length >= 2 && !isKeepTypingQuery(trimmedDebounced);

  const allMatches = useMemo(
    () => (debouncedSearchable ? searchSiteAllMatches(debouncedQuery) : []),
    [debouncedQuery, debouncedSearchable],
  );

  const filterCounts = useMemo(
    () => countSearchResultsByFilterGroup(allMatches),
    [allMatches],
  );

  const filteredResults = useMemo(
    () => filterSearchResultsByGroup(allMatches, resultFilter).slice(0, 8),
    [allMatches, resultFilter],
  );
  const showKeepTyping =
    trimmedQuery.length > 0 &&
    (isKeepTypingQuery(trimmedQuery) || isKeepTypingQuery(trimmedDebounced));
  const showIdle = !trimmedQuery;
  const showFilters =
    trimmedDebounced.length >= 2 &&
    !isKeepTypingQuery(trimmedDebounced) &&
    allMatches.length > 0;
  const showFilteredEmpty =
    trimmedDebounced.length >= 2 &&
    !isKeepTypingQuery(trimmedDebounced) &&
    allMatches.length > 0 &&
    resultFilter !== "all" &&
    filteredResults.length === 0;

  useEffect(() => {
    if (open) {
      setRecentSearches(readRecentSearches());
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return;
    }

    if (shouldRestoreFocusRef.current) {
      triggerRef.current?.focus();
      shouldRestoreFocusRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [query, open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery, resultFilter]);

  useEffect(() => {
    if (activeIndex < 0) {
      return;
    }
    resultRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filteredResults]);

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
    const handleShortcut = (event: KeyboardEvent) => {
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
      onOpenChange(true);
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (trimmedQuery.length > 0) {
        setQuery("");
        setDebouncedQuery("");
        setActiveIndex(-1);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      closeSearch(true);
    };

    document.addEventListener("keydown", handleEscape, true);
    return () => document.removeEventListener("keydown", handleEscape, true);
  }, [open, trimmedQuery, closeSearch]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        closeSearch(true);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [open, closeSearch]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const getFocusable = () =>
      [...panel.querySelectorAll(SEARCH_PANEL_FOCUSABLE_SELECTOR)].filter(isFocusablePanelElement);

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }
      const focusable = getFocusable();
      if (!focusable.length) {
        return;
      }
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      const active = document.activeElement;
      const inside = panel.contains(active);

      if (!inside) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", handleTab);
    return () => panel.removeEventListener("keydown", handleTab);
  }, [open, query, debouncedQuery, resultFilter, filteredResults.length, recentSearches.length]);

  const navigateToResult = (item: SearchResult, searchTerm: string) => {
    const term = searchTerm.trim();
    if (term) {
      addRecentSearch(term);
      setRecentSearches(readRecentSearches());
    }
    closeSearch(false);
    router.push(item.href);
  };

  const resolveEnterTarget = (): SearchResult | null => {
    const raw = trimmedQuery;
    if (!raw || isKeepTypingQuery(raw)) {
      return null;
    }
    if (activeIndex >= 0 && filteredResults[activeIndex]) {
      return filteredResults[activeIndex];
    }
    const fresh = searchSiteAllMatches(raw);
    const filtered = filterSearchResultsByGroup(fresh, resultFilter);
    return filtered[0] ?? null;
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!filteredResults.length) {
        return;
      }
      setActiveIndex((current) =>
        current < filteredResults.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!filteredResults.length) {
        return;
      }
      setActiveIndex((current) =>
        current > 0 ? current - 1 : filteredResults.length - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (trimmedQuery !== trimmedDebounced) {
        flushDebouncedQuery();
      }
      const target = resolveEnterTarget();
      if (target) {
        event.preventDefault();
        navigateToResult(target, trimmedQuery);
      }
    }
  };

  const handleClearRecent = () => {
    clearRecentSearchesStorage();
    setRecentSearches([]);
  };

  resultRefs.current = [];

  return (
    <div className={`relative ${className ?? ""}`} ref={rootRef}>
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
          ref={panelRef}
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
              role="combobox"
              aria-expanded={filteredResults.length > 0}
              aria-controls={filteredResults.length > 0 ? listboxId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
              }
              aria-describedby={trimmedQuery ? escapeHintId : undefined}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={() => {
                if (trimmedQuery !== trimmedDebounced) {
                  flushDebouncedQuery();
                }
              }}
              placeholder={SEARCH_PLACEHOLDER}
              className="min-w-0 flex-1 break-words bg-transparent text-base text-pelagic-ink outline-none placeholder:text-pelagic-slate"
              autoComplete="off"
            />
            {trimmedQuery && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setDebouncedQuery("");
                  setActiveIndex(-1);
                  inputRef.current?.focus();
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-pelagic-slate transition hover:bg-white hover:text-pelagic-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
                aria-label="Clear search"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {trimmedQuery ? (
            <p id={escapeHintId} className="site-header-search-escape-hint">
              Esc to clear · Esc again to close
            </p>
          ) : null}

          {showFilters ? (
            <div
              className="site-header-search-filters"
              role="group"
              aria-label="Filter results by type"
            >
              {SEARCH_FILTER_GROUPS.map((group) => {
                const pressed = resultFilter === group.id;
                const count = filterCounts[group.id] ?? 0;
                const chipDisabled = isFilterChipDisabled(group.id, filterCounts);
                return (
                  <button
                    key={group.id}
                    type="button"
                    className={`site-header-search-filter-chip${
                      chipDisabled ? " site-header-search-filter-chip--disabled" : ""
                    }${pressed ? " site-header-search-filter-chip--active" : ""}`}
                    aria-pressed={pressed}
                    aria-disabled={chipDisabled ? true : undefined}
                    onClick={() => {
                      if (chipDisabled) {
                        return;
                      }
                      setResultFilter(group.id);
                    }}
                  >
                    {group.label} ({count})
                  </button>
                );
              })}
            </div>
          ) : null}

          <div
            className="site-header-search-panel__results min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain"
            aria-live="polite"
          >
            {showIdle ? (
              <div className="min-w-0 px-0.5 pt-2">
                {recentSearches.length > 0 ? (
                  <div className="mb-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-pelagic-navy">
                        Recent searches
                      </p>
                      <button
                        type="button"
                        onClick={handleClearRecent}
                        className="text-xs font-semibold text-pelagic-accent underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-1 flex flex-col gap-0.5" role="group" aria-label="Recent searches">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => runSearchQuery(term)}
                          className="flex min-h-11 w-full items-center rounded-xl border border-pelagic-warm bg-white px-2.5 text-left text-[15px] font-semibold text-pelagic-navy transition hover:border-pelagic-accent hover:bg-pelagic-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2"
                        >
                          <span className="break-words">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
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
                      onClick={() => runSearchQuery(suggestion)}
                      className="flex min-h-11 w-full items-center rounded-xl border border-pelagic-warm bg-white px-2.5 text-left text-[15px] font-semibold text-pelagic-navy transition hover:border-pelagic-accent hover:bg-pelagic-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2"
                    >
                      <span className="break-words">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {showKeepTyping ? (
              <div className="min-w-0 px-1 py-3 text-center">
                <p className="text-sm font-semibold text-pelagic-ink">Keep typing to search.</p>
                <p className="mt-1 text-xs text-pelagic-slate">
                  Enter at least two characters or a more specific term.
                </p>
              </div>
            ) : null}

            {showFilteredEmpty ? (
              <div className="min-w-0 px-1 py-3 text-center">
                <p className="text-sm font-semibold text-pelagic-ink">
                  No results in this category for &ldquo;{trimmedDebounced}&rdquo;.
                </p>
                <p className="mt-1 text-xs text-pelagic-slate">Try another filter or broaden your query.</p>
              </div>
            ) : null}

            {!showIdle &&
            !showKeepTyping &&
            !showFilteredEmpty &&
            trimmedDebounced.length >= 2 &&
            filteredResults.length === 0 ? (
              <div className="min-w-0 px-1 py-3 text-center">
                <p className="text-sm font-semibold text-pelagic-ink">
                  No results for &ldquo;{trimmedDebounced}&rdquo;
                </p>
                <p className="mt-1 text-xs text-pelagic-slate">
                  Try a broader term such as LNG, surveying or engineering.
                </p>
              </div>
            ) : null}

            {filteredResults.length > 0 ? (
              <div className="min-w-0 pt-2">
                <div className="mb-0.5 flex items-center justify-between gap-2 px-0.5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-pelagic-navy">
                    {filteredResults.length}{" "}
                    {filteredResults.length === 1 ? "result" : "results"}
                  </p>
                  <p className="text-[11px] text-pelagic-slate">↑↓ to move · Enter to open</p>
                </div>
                <ul id={listboxId} className="space-y-0.5" role="listbox">
                  {filteredResults.map((item, index) => {
                    const isActive = activeIndex === index;
                    return (
                      <li key={`${item.href}-${item.title}`} role="none">
                        <Link
                          id={`${listboxId}-option-${index}`}
                          ref={(node) => {
                            resultRefs.current[index] = node;
                          }}
                          href={item.href}
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive ? "true" : undefined}
                          onClick={(event) => {
                            event.preventDefault();
                            navigateToResult(item, trimmedQuery);
                          }}
                          className={`site-header-search-result group flex items-start gap-2 rounded-xl border px-2.5 py-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent ${
                            isActive
                              ? "border-pelagic-accent bg-pelagic-sky"
                              : "border-transparent hover:border-pelagic-warm hover:bg-pelagic-sky"
                          }`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="inline-flex max-w-full rounded-full bg-pelagic-sky px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pelagic-accent">
                              {item.category}
                            </span>
                            <span className="mt-0.5 block break-words text-sm font-semibold leading-snug text-pelagic-ink">
                              <HighlightedText text={item.title} query={debouncedQuery} />
                            </span>
                            {item.excerpt ? (
                              <span className="mt-0.5 block break-words text-xs leading-relaxed text-pelagic-slate">
                                <HighlightedText text={item.excerpt} query={debouncedQuery} />
                              </span>
                            ) : null}
                          </span>
                          <span
                            className="mt-1 shrink-0 text-base text-pelagic-accent opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                            aria-hidden
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
