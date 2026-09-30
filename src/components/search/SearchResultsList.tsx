"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import {
  SEARCH_GROUP_LABELS,
  SEARCH_GROUP_ORDER,
  buildSearchDestinationHref,
  groupSearchResults,
  type SearchResult,
} from "@/lib/search-index";
import { HighlightedText } from "./HighlightedText";

function buildIndexedGroups(
  grouped: ReturnType<typeof groupSearchResults>,
): { group: (typeof SEARCH_GROUP_ORDER)[number]; items: { item: SearchResult; index: number }[] }[] {
  let runningIndex = 0;
  const sections: {
    group: (typeof SEARCH_GROUP_ORDER)[number];
    items: { item: SearchResult; index: number }[];
  }[] = [];

  for (const group of SEARCH_GROUP_ORDER) {
    const items = grouped[group].map((item) => {
      const entry = { item, index: runningIndex };
      runningIndex += 1;
      return entry;
    });
    if (items.length > 0) {
      sections.push({ group, items });
    }
  }

  return sections;
}

type SearchResultsListProps = {
  results: SearchResult[];
  query: string;
  listboxId: string;
  activeIndex?: number;
  onNavigate?: (href: string) => void;
  optionRefs?: MutableRefObject<(HTMLAnchorElement | null)[]>;
  className?: string;
  /** When false, links go to the page only (no ?q= / anchor). Default true when query is long enough. */
  useDestinationHref?: boolean;
  layout?: "grouped" | "flat";
};

export function SearchResultsList({
  results,
  query,
  listboxId,
  activeIndex = -1,
  onNavigate,
  optionRefs,
  className,
  useDestinationHref = true,
  layout = "grouped",
}: SearchResultsListProps) {
  const groupedWithIndices = buildIndexedGroups(groupSearchResults(results));

  if (layout === "flat") {
    return (
      <ul id={listboxId} role="listbox" className={className ?? "site-search-results__list"}>
        {results.map((item, index) => {
          const isActive = activeIndex === index;
          const href = useDestinationHref ? buildSearchDestinationHref(item, query) : item.href;
          return (
            <li key={item.resultKey ?? `${item.href}-${item.title}`} role="none">
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
                className="site-search-result-row"
              >
                <span className="site-search-result-row__main">
                  <span className="site-search-result-row__category">{item.category}</span>
                  {item.breadcrumb ? (
                    <span className="site-search-result-row__breadcrumb">{item.breadcrumb}</span>
                  ) : null}
                  <span className="site-search-result-row__title">
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

  return (
    <ul id={listboxId} role="listbox" className={className ?? "site-search-results__list"}>
      {groupedWithIndices.map((section, sectionIndex) => (
        <li key={section.group} className="site-search-results__group">
          {sectionIndex > 0 ? (
            <hr className="site-search-results__divider" aria-hidden="true" />
          ) : null}
          <p className="site-search-results__group-label">{SEARCH_GROUP_LABELS[section.group]}</p>
          <ul className="site-search-results__rows">
            {section.items.map(({ item, index }) => {
              const isActive = activeIndex === index;
              const href =
                useDestinationHref ? buildSearchDestinationHref(item, query) : item.href;
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
                    className="site-search-result-row"
                  >
                    <span className="site-search-result-row__main">
                      <span className="site-search-result-row__category">{item.category}</span>
                      <span className="site-search-result-row__title">
                        <HighlightedText text={item.title} query={query} />
                      </span>
                      {item.excerpt ? (
                        <span className="site-search-result-row__excerpt">
                          <HighlightedText text={item.excerpt} query={query} />
                        </span>
                      ) : null}
                    </span>
                    <span className="site-search-result-row__arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
