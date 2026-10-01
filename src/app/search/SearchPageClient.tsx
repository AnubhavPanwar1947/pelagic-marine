"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { SearchResultsList } from "@/components/search/SearchResultsList";
import { SearchSuggestionsList } from "@/components/search/SearchSuggestionsList";
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_FILTER_TABS,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_POPULAR,
  SEARCH_SUGGESTIONS_LIMIT,
  buildSearchDestinationHref,
  countResultsByTab,
  filterResultsByTab,
  isQueryTooShort,
  isSearchFilterTabDisabled,
  searchAllMatches,
  searchPrefixSuggestionMatches,
  searchRelatedMatches,
  type SearchFilterTab,
  type SearchResult,
} from "@/lib/search-index";

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

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(paramQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(paramQuery);
  const [filterTab, setFilterTab] = useState<SearchFilterTab>("all");
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lastSyncedUrlQueryRef = useRef<string | null>(paramQuery);
  const isComposingRef = useRef(false);

  const inputId = useId();
  const statusId = useId();
  const suggestionsListboxId = useId();
  const resultsListboxId = useId();

  useEffect(() => {
    const incoming = paramQuery.trim();
    const lastWritten = (lastSyncedUrlQueryRef.current ?? "").trim();
    if (incoming === lastWritten) {
      return;
    }
    setQuery(paramQuery);
    setDebouncedQuery(paramQuery);
    setFilterTab("all");
    setActiveIndex(-1);
    lastSyncedUrlQueryRef.current = paramQuery;
  }, [paramQuery]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
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
  }, [query]);

  const syncUrl = useCallback(
    (nextQuery: string) => {
      const trimmed = nextQuery.trim();
      lastSyncedUrlQueryRef.current = trimmed;
      const next = trimmed ? `/search/?q=${encodeURIComponent(trimmed)}` : "/search/";
      router.replace(next, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (debouncedQuery.trim() === paramQuery.trim()) {
      return;
    }
    syncUrl(debouncedQuery);
  }, [debouncedQuery, paramQuery, syncUrl]);

  const trimmedQuery = query.trim();
  const trimmedDebounced = debouncedQuery.trim();
  const isDebouncing = trimmedQuery !== trimmedDebounced;

  const allMatches = useMemo(() => {
    if (trimmedDebounced.length < SEARCH_MIN_QUERY_LENGTH) {
      return [];
    }
    return searchAllMatches(debouncedQuery);
  }, [debouncedQuery, trimmedDebounced.length]);

  const prefixSuggestions = useMemo(() => {
    if (trimmedDebounced.length < SEARCH_MIN_QUERY_LENGTH) {
      return [];
    }
    return searchPrefixSuggestionMatches(debouncedQuery, SEARCH_SUGGESTIONS_LIMIT);
  }, [debouncedQuery, trimmedDebounced.length]);

  const relatedMatches = useMemo(() => {
    if (trimmedDebounced.length < SEARCH_MIN_QUERY_LENGTH || allMatches.length > 0) {
      return [];
    }
    return searchRelatedMatches(debouncedQuery);
  }, [debouncedQuery, trimmedDebounced.length, allMatches.length]);

  const comboboxOptions =
    allMatches.length > 0 ? allMatches : prefixSuggestions.length > 0 ? prefixSuggestions : [];

  const showPrefixSuggestions =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH &&
    !isDebouncing &&
    prefixSuggestions.length > 0;

  const tabCounts = useMemo(() => countResultsByTab(allMatches), [allMatches]);
  const filteredMatches = useMemo(
    () => filterResultsByTab(allMatches, filterTab),
    [allMatches, filterTab],
  );

  const showRelated =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH &&
    !isDebouncing &&
    allMatches.length === 0 &&
    relatedMatches.length > 0;

  const showTooShort = trimmedQuery.length > 0 && isQueryTooShort(trimmedQuery);
  const showNoResults =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH &&
    !isDebouncing &&
    allMatches.length === 0 &&
    prefixSuggestions.length === 0 &&
    relatedMatches.length === 0;
  const showResults =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH && !isDebouncing && filteredMatches.length > 0;
  const showFilteredEmpty =
    trimmedDebounced.length >= SEARCH_MIN_QUERY_LENGTH &&
    !isDebouncing &&
    allMatches.length > 0 &&
    filteredMatches.length === 0;

  const statusMessage = useMemo(() => {
    if (!trimmedQuery) {
      return "";
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
    if (showPrefixSuggestions) {
      return `${prefixSuggestions.length} suggestion${prefixSuggestions.length === 1 ? "" : "s"}.`;
    }
    if (showRelated) {
      return `${relatedMatches.length} related suggestion${relatedMatches.length === 1 ? "" : "s"}.`;
    }
    if (showResults) {
      const count = filteredMatches.length;
      return `${count} result${count === 1 ? "" : "s"} found${
        showPrefixSuggestions ? `; ${prefixSuggestions.length} suggestion${prefixSuggestions.length === 1 ? "" : "s"}.` : ""
      }`;
    }
    return "";
  }, [
    trimmedQuery,
    showTooShort,
    isDebouncing,
    showNoResults,
    showPrefixSuggestions,
    prefixSuggestions.length,
    showRelated,
    relatedMatches.length,
    showResults,
    filteredMatches.length,
    trimmedDebounced,
  ]);

  const flushDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setDebouncedQuery(query);
  }, [query]);

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const resolveEnterTarget = (): SearchResult | null => {
    if (trimmedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
      return null;
    }
    if (activeIndex >= 0 && comboboxOptions[activeIndex]) {
      return comboboxOptions[activeIndex];
    }
    return null;
  };

  useEffect(() => {
    if (activeIndex < 0) {
      return;
    }
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, comboboxOptions]);

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!comboboxOptions.length) {
        return;
      }
      setActiveIndex((current) => (current < comboboxOptions.length - 1 ? current + 1 : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!comboboxOptions.length) {
        return;
      }
      setActiveIndex((current) => (current > 0 ? current - 1 : comboboxOptions.length - 1));
      return;
    }
    if (event.key === "Escape") {
      setActiveIndex(-1);
      return;
    }
    if (event.key === "Enter") {
      if (trimmedQuery !== trimmedDebounced) {
        flushDebounce();
      }
      const target = resolveEnterTarget();
      if (target) {
        event.preventDefault();
        navigateTo(buildSearchDestinationHref(target, trimmedQuery || trimmedDebounced));
        return;
      }
      event.preventDefault();
      syncUrl(trimmedQuery);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setDebouncedQuery(query);
    syncUrl(query);
    const target = resolveEnterTarget();
    if (target && trimmedQuery.length >= SEARCH_MIN_QUERY_LENGTH) {
      navigateTo(buildSearchDestinationHref(target, trimmedQuery));
    }
    inputRef.current?.focus();
  };

  const clearQuery = () => {
    setQuery("");
    setDebouncedQuery("");
    setFilterTab("all");
    setActiveIndex(-1);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    lastSyncedUrlQueryRef.current = "";
    router.replace("/search/", { scroll: false });
    inputRef.current?.focus();
  };

  const runSuggestion = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    setFilterTab("all");
    setActiveIndex(-1);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    syncUrl(term);
  };

  return (
    <div className="site-search-page">
      <div className="site-search-page__inner">
        <header className="site-search-page__header">
          <h1 className="site-search-page__title">Search</h1>
        </header>

        <form className="site-search-page__form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor={inputId}>
            Search
          </label>
          <div className="site-search-page__field-row">
            <div className="site-search-field site-search-page__field">
              <SearchIcon className="site-search-field__icon" />
              <input
                id={inputId}
                ref={inputRef}
                type="search"
                name="q"
                role="combobox"
                aria-expanded={showPrefixSuggestions || showResults}
                aria-controls={
                  showPrefixSuggestions
                    ? suggestionsListboxId
                    : showResults
                      ? resultsListboxId
                      : undefined
                }
                aria-autocomplete="list"
                aria-activedescendant={
                  activeIndex >= 0 ? `${suggestionsListboxId}-option-${activeIndex}` : undefined
                }
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(-1);
                }}
                onCompositionStart={() => {
                  isComposingRef.current = true;
                }}
                onCompositionEnd={() => {
                  isComposingRef.current = false;
                }}
                onKeyDown={onInputKeyDown}
                onBlur={() => {
                  if (trimmedQuery !== trimmedDebounced) {
                    flushDebounce();
                  }
                }}
                className="site-search-field__input"
                placeholder="Search Pelagic Marine"
                autoComplete="off"
                enterKeyHint="search"
                aria-describedby={statusId}
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
            <button type="submit" className="site-search-page__submit">Search</button>
          </div>
        </form>

        <p id={statusId} className="site-search-page__status" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </p>

        {showPrefixSuggestions ? (
          <section className="site-search-suggestions" aria-label="Top suggestions">
            <h2 className="site-search-suggestions__heading">Suggestions</h2>
            <SearchSuggestionsList
              results={prefixSuggestions}
              query={debouncedQuery}
              listboxId={suggestionsListboxId}
              activeIndex={activeIndex}
              onNavigate={navigateTo}
              optionRefs={optionRefs}
            />
          </section>
        ) : null}

        {showRelated ? (
          <section className="site-search-suggestions" aria-label="Did you mean">
            <h2 className="site-search-suggestions__heading">Did you mean</h2>
            <SearchSuggestionsList
              results={relatedMatches}
              query={debouncedQuery}
              listboxId={`${suggestionsListboxId}-related`}
              activeIndex={-1}
              onNavigate={navigateTo}
              showRelatedReason
            />
          </section>
        ) : null}

        {!trimmedQuery ? (
          <section className="site-search-page__popular" aria-label="Popular searches">
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
        ) : null}

        {showTooShort ? (
          <p className="site-search-message">Type at least two characters.</p>
        ) : null}

        {showNoResults ? (
          <div className="site-search-message site-search-message--empty">
            <p className="site-search-message__title">
              No results found for &ldquo;{trimmedDebounced}&rdquo;.
            </p>
            <p className="site-search-message__hint">Try LNG, Surveying, or Naval architecture.</p>
          </div>
        ) : null}

        {showFilteredEmpty ? (
          <p className="site-search-message">
            No results in this category. Try another filter or broaden your search.
          </p>
        ) : null}

        {showResults ? (
          <>
            <h2 className="site-search-page__all-results-heading">All results</h2>
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
                    }}
                  >
                    {tab.label}
                    <span className="site-search-tabs__count">({tabCounts[tab.id]})</span>
                  </button>
                );
              })}
            </div>
            <p className="site-search-results__count" aria-hidden="true">
              {filteredMatches.length} {filteredMatches.length === 1 ? "match" : "matches"}
            </p>
            <SearchResultsList
              results={filteredMatches}
              query={debouncedQuery}
              listboxId={resultsListboxId}
              onNavigate={navigateTo}
              layout="flat"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
