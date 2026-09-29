"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import { buildSearchDestinationHref, type SearchResult } from "@/lib/search-index";
import { HighlightedText } from "./HighlightedText";

type SearchSuggestionsListProps = {
  results: SearchResult[];
  query: string;
  listboxId: string;
  activeIndex?: number;
  onNavigate?: (href: string) => void;
  optionRefs?: MutableRefObject<(HTMLAnchorElement | null)[]>;
};

export function SearchSuggestionsList({
  results,
  query,
  listboxId,
  activeIndex = -1,
  onNavigate,
  optionRefs,
}: SearchSuggestionsListProps) {
  return (
    <ul
      id={listboxId}
      role="listbox"
      aria-label="Search suggestions"
      className="site-search-suggestions__list"
    >
      {results.map((item, index) => {
        const isActive = activeIndex === index;
        const href = buildSearchDestinationHref(item, query);
        return (
          <li key={`${item.href}-${item.title}`} role="none">
            <Link
              id={`${listboxId}-option-${index}`}
              ref={
                optionRefs
                  ? (node) => {
                      optionRefs.current[index] = node;
                    }
                  : undefined
              }
              href={href}
              role="option"
              aria-selected={isActive}
              data-active={isActive ? "true" : undefined}
              onClick={
                onNavigate
                  ? (event) => {
                      event.preventDefault();
                      onNavigate(href);
                    }
                  : undefined
              }
              className="site-search-suggestion-row"
            >
              <span className="site-search-suggestion-row__main">
                <span className="site-search-result-row__category">{item.category}</span>
                <span className="site-search-suggestion-row__title">
                  <HighlightedText text={item.title} query={query} />
                </span>
                {item.excerpt ? (
                  <span className="site-search-result-row__excerpt">
                    <HighlightedText text={item.excerpt} query={query} />
                  </span>
                ) : null}
              </span>
              <span className="site-search-result-row__arrow" aria-hidden>→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
