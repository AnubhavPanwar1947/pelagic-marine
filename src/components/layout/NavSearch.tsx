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
import { createPortal } from "react-dom";
import { SearchResultsList } from "@/components/search/SearchResultsList";
import {
  buildSearchDestinationHref,
  buildSearchResultsHref,
  countResultsByTab,
  filterResultsByTab,
  isQueryTooShort,
  isSearchFilterTabDisabled,
  SEARCH_DEBOUNCE_MS,
  SEARCH_FILTER_TABS,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_OVERLAY_PREVIEW_LIMIT,
  SEARCH_POPULAR,
  SEARCH_QUICK_LINKS,
  searchAllMatches,
  type SearchFilterTab,
  type SearchResult,
} from "@/lib/search-index";

const SEARCH_PLACEHOLDER = "Search Pelagic Marine";
const OVERLAY_FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

function isFocusableElement(element: Element) {
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
  const [filterTab, setFilterTab] = useState<SearchFilterTab>("all");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const bodyOverflowRef = useRef<string | null>(null);

  const inputId = useId();
  const listboxId = useId();
  const statusId = useId();
  const dialogId = "site-search-panel";

  const closeSearch = useCallback(
    (restoreFocus = false) => {
      shouldRestoreFocusRef.current = restoreFocus;
      setQuery("");
      setDebouncedQuery("");
      setActiveIndex(-1);
      setFilterTab("all");
      onOpenChange(false);
    },
    [onOpenChange],
  );

  const trimmedQuery = query.trim();
  const trimmedDebounced = debouncedQuery.trim();
  const isDebouncing = trimmedQuery !== trimmedDebounced;

  const allMatches = useMemo(() => {
    if (trimmedDebounced.length < SEARCH_MIN_QUERY_LENGTH) {
      return [];
    }
    return searchAllMatches(debouncedQuery);
  }, [debouncedQuery, trimmedDebounced.length]);

  const tabCounts = useMemo(() => countResultsByTab(allMatches), [allMatches]);

  const tabFilteredMatches = useMemo(
    () => filterResultsByTab(allMatches, filterTab),
    [allMatches, filterTab],
  );

  const filteredMatches = useMemo(
    () => tabFilteredMatches.slice(0, SEARCH_OVERLAY_PREVIEW_LIMIT),
    [tabFilteredMatches],
  );

  const flatResults = useMemo(() => filteredMatches, [filteredMatches]);

  const showIdle = !trimmedQuery;
  const showTooShort = trimmedQuery.length > 0 && isQueryTooShort(trimmedQuery);
  const showResults =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH &&
    !isDebouncing &&
    filteredMatches.length > 0;
  const showNoResults =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH &&
    !isDebouncing &&
    allMatches.length === 0;
  const showFilteredEmpty =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH &&
    !isDebouncing &&
    allMatches.length > 0 &&
    filteredMatches.length === 0;
  const showResultTabs =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH && !isDebouncing && allMatches.length > 0;

  const showViewAllResults =
    showResultTabs && tabFilteredMatches.length > filteredMatches.length;

  const totalMatchCount = tabFilteredMatches.length;

  const statusMessage = useMemo(() => {
    if (showIdle) {
      return "Search Pelagic Marine. Quick links and popular searches are available.";
    }
    if (showTooShort) {
      return "Type at least two characters.";
    }
    if (isDebouncing) {
      return "Searching…";
    }
    if (showNoResults) {
      return `No results found for ${trimmedDebounced}.`;
    }
    if (showResults) {
      return `${totalMatchCount} result${totalMatchCount === 1 ? "" : "s"} found`;
    }
    return "";
  }, [
    showIdle,
    showTooShort,
    isDebouncing,
    showNoResults,
    showResults,
    totalMatchCount,
    trimmedDebounced,
  ]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
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
      setActiveIndex(-1);
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
    if (activeIndex < 0) {
      return;
    }
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, flatResults]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const header = document.querySelector(".site-header");
    const updateTop = () => {
      const height = header?.getBoundingClientRect().height ?? 75;
      document.documentElement.style.setProperty("--site-search-top", `${height}px`);
    };
    updateTop();
    const observer = header ? new ResizeObserver(updateTop) : null;
    if (header && observer) {
      observer.observe(header);
    }
    window.addEventListener("resize", updateTop);
    return () => {
      window.removeEventListener("resize", updateTop);
      observer?.disconnect();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      }
      return;
    }
    bodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      }
    };
  }, [open]);

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
      onOpenChange(true);
    };
    document.addEventListener("keydown", onShortcut);
    return () => document.removeEventListener("keydown", onShortcut);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch(true);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, closeSearch]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    const getFocusable = () =>
      [...overlay.querySelectorAll(OVERLAY_FOCUSABLE)].filter(isFocusableElement);

    const onTab = (event: KeyboardEvent) => {
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
      const inside = overlay.contains(active);

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

    overlay.addEventListener("keydown", onTab);
    return () => overlay.removeEventListener("keydown", onTab);
  }, [open, flatResults.length, showIdle, showResultTabs]);

  const flushDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setDebouncedQuery(query);
  }, [query]);

  const navigateTo = (href: string) => {
    closeSearch(false);
    router.push(href);
  };

  const resolveEnterTarget = (): SearchResult | null => {
    const raw = trimmedQuery;
    if (raw.length < SEARCH_MIN_QUERY_LENGTH) {
      return null;
    }
    if (activeIndex >= 0 && flatResults[activeIndex]) {
      return flatResults[activeIndex];
    }
    const fresh = filterResultsByTab(searchAllMatches(raw), filterTab);
    return fresh[0] ?? null;
  };

  const runSuggestion = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    setActiveIndex(-1);
    setFilterTab("all");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    inputRef.current?.focus();
  };

  const clearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
    setActiveIndex(-1);
    setFilterTab("all");
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    inputRef.current?.focus();
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!flatResults.length) {
        return;
      }
      setActiveIndex((current) => (current < flatResults.length - 1 ? current + 1 : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!flatResults.length) {
        return;
      }
      setActiveIndex((current) => (current > 0 ? current - 1 : flatResults.length - 1));
      return;
    }
    if (event.key === "Enter") {
      if (trimmedQuery !== trimmedDebounced) {
        flushDebounce();
      }
      const target = resolveEnterTarget();
      if (target) {
        event.preventDefault();
        navigateTo(buildSearchDestinationHref(target, trimmedQuery));
      }
    }
  };

  const overlay =
    open && typeof document !== "undefined"
      ? createPortal(
          <>
            <button
              type="button"
              className="site-search-backdrop"
              aria-label="Close search"
              onClick={() => closeSearch(true)}
            />
            <div
              id={dialogId}
              ref={overlayRef}
              className={`site-search-overlay${isDebouncing ? " site-search-overlay--pending" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label="Site search"
            >
              <div className="site-search-overlay__inner">
                <div className="site-search-overlay__toolbar">
                  <label className="sr-only" htmlFor={inputId}>
                    Search
                  </label>
                  <div className="site-search-field">
                    <SearchIcon className="site-search-field__icon" />
                    <input
                      id={inputId}
                      ref={inputRef}
                      type="search"
                      role="combobox"
                      aria-expanded={showResults}
                      aria-controls={showResults ? listboxId : undefined}
                      aria-autocomplete="list"
                      aria-activedescendant={
                        activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
                      }
                      aria-describedby={statusId}
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setActiveIndex(-1);
                      }}
                      onKeyDown={onInputKeyDown}
                      onBlur={() => {
                        if (trimmedQuery !== trimmedDebounced) {
                          flushDebounce();
                        }
                      }}
                      placeholder={SEARCH_PLACEHOLDER}
                      className="site-search-field__input"
                      autoComplete="off"
                      enterKeyHint="search"
                    />
                    {trimmedQuery ? (
                      <button
                        type="button"
                        className="site-search-field__clear"
                        onClick={clearQuery}
                        aria-label="Clear search"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="site-search-overlay__close"
                    onClick={() => closeSearch(true)}
                    aria-label="Close search"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                {isDebouncing ? (
                  <div className="site-search-overlay__progress" aria-hidden="true">
                    <span className="site-search-overlay__progress-bar" />
                  </div>
                ) : null}

                <p id={statusId} className="sr-only" aria-live="polite" aria-atomic="true">
                  {statusMessage}
                </p>

                <div className="site-search-overlay__body">
                  {showIdle ? (
                    <div className="site-search-idle">
                      <section className="site-search-idle__section">
                        <h2 className="site-search-idle__heading">Quick links</h2>
                        <ul className="site-search-quick-links">
                          {SEARCH_QUICK_LINKS.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="site-search-quick-links__link"
                                onClick={(event) => {
                                  event.preventDefault();
                                  navigateTo(link.href);
                                }}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section className="site-search-idle__section">
                        <h2 className="site-search-idle__heading">Popular searches</h2>
                        <div className="site-search-popular" role="group" aria-label="Popular searches">
                          {SEARCH_POPULAR.map((term) => (
                            <button
                              key={term}
                              type="button"
                              className="site-search-popular__chip"
                              onClick={() => runSuggestion(term)}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>
                  ) : null}

                  {showTooShort ? (
                    <p className="site-search-message">Type at least two characters.</p>
                  ) : null}

                  {showNoResults ? (
                    <div className="site-search-message site-search-message--empty">
                      <p className="site-search-message__title">
                        No results found for &ldquo;{trimmedDebounced}&rdquo;.
                      </p>
                      <p className="site-search-message__hint">
                        Try LNG, Surveying, or Naval architecture.
                      </p>
                    </div>
                  ) : null}

                  {showFilteredEmpty ? (
                    <p className="site-search-message">
                      No results in this category. Try another filter or broaden your search.
                    </p>
                  ) : null}

                  {showResultTabs ? (
                    <div
                      className="site-search-tabs"
                      role="tablist"
                      aria-label="Filter search results"
                    >
                      {SEARCH_FILTER_TABS.map((tab) => {
                        const disabled = isSearchFilterTabDisabled(tab.id, tabCounts);
                        const selected = filterTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            id={`${dialogId}-tab-${tab.id}`}
                            aria-selected={selected}
                            aria-disabled={disabled ? true : undefined}
                            tabIndex={disabled ? -1 : 0}
                            className={`site-search-tabs__tab${
                              selected ? " site-search-tabs__tab--active" : ""
                            }${disabled ? " site-search-tabs__tab--disabled" : ""}`}
                            onClick={() => {
                              if (disabled) {
                                return;
                              }
                              setFilterTab(tab.id);
                              setActiveIndex(-1);
                            }}
                          >
                            {tab.label}
                            <span className="site-search-tabs__count">({tabCounts[tab.id]})</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {showResults ? (
                    <div className="site-search-results">
                      <p className="site-search-results__count" aria-hidden="true">
                        {totalMatchCount} {totalMatchCount === 1 ? "match" : "matches"}
                      </p>
                      <SearchResultsList
                        results={filteredMatches}
                        query={debouncedQuery}
                        listboxId={listboxId}
                        activeIndex={activeIndex}
                        onNavigate={navigateTo}
                        optionRefs={optionRefs}
                      />
                      {showViewAllResults ? (
                        <div className="site-search-view-all">
                          <Link
                            href={buildSearchResultsHref(debouncedQuery)}
                            className="site-search-view-all__link"
                            onClick={() => closeSearch(false)}
                          >
                            View all {totalMatchCount} results
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeSearch(false) : onOpenChange(true))}
        className={`flex h-11 w-11 items-center justify-center bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2 ${
          open ? "text-pelagic-accent" : "text-pelagic-navy hover:text-pelagic-accent"
        }`}
        aria-label={open ? "Close search" : "Open search"}
        aria-expanded={open}
        aria-controls={dialogId}
      >
        <SearchIcon className="h-5 w-5" />
      </button>
      {overlay}
    </div>
  );
}
