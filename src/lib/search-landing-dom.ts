import {
  SEARCH_MIN_QUERY_LENGTH,
  getHighlightTerms,
  isQueryTooShort,
  splitTextByHighlights,
  textMatchesSearchQuery,
} from "./search-index";

const HIGHLIGHT_ROOT_ATTR = "data-search-highlight-root";

export function getHeaderOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--site-header-height");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 75;
}

export function scrollElementBelowHeader(element: HTMLElement, behavior: ScrollBehavior = "smooth") {
  const offset = getHeaderOffsetPx() + 8;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function applyPersistentHighlights(root: HTMLElement, query: string) {
  if (root.hasAttribute(HIGHLIGHT_ROOT_ATTR) || isQueryTooShort(query.trim())) {
    return;
  }
  const terms = getHighlightTerms(query);
  if (!terms.length) {
    return;
  }

  root.setAttribute(HIGHLIGHT_ROOT_ATTR, "true");

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.closest("mark.site-search-highlight")) {
        return NodeFilter.FILTER_REJECT;
      }
      if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const source = textNode.textContent ?? "";
    if (!source.trim()) {
      continue;
    }
    const parts = splitTextByHighlights(source, query);
    if (parts.every((part) => !part.highlight)) {
      continue;
    }
    const fragment = document.createDocumentFragment();
    for (const part of parts) {
      if (!part.text) {
        continue;
      }
      if (part.highlight) {
        const mark = document.createElement("mark");
        mark.className = "site-search-highlight";
        mark.textContent = part.text;
        fragment.appendChild(mark);
      } else {
        fragment.appendChild(document.createTextNode(part.text));
      }
    }
    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}

const BLOCK_SELECTOR =
  "article, section, li, p, h1, h2, h3, h4, h5, h6, [data-search-target], .type-copy";

export function findFallbackSearchTarget(query: string): HTMLElement | null {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return null;
  }
  const main = document.getElementById("main-content");
  if (!main) {
    return null;
  }

  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.closest("header, footer, nav, [aria-hidden='true']")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    const text = current.textContent ?? "";
    if (textMatchesSearchQuery(text, trimmed, "all")) {
      const parent = current.parentElement;
      const block = parent?.closest(BLOCK_SELECTOR);
      if (block instanceof HTMLElement) {
        return block;
      }
      if (parent instanceof HTMLElement) {
        return parent;
      }
    }
    current = walker.nextNode();
  }

  return null;
}

export function focusSearchTarget(element: HTMLElement) {
  const focusable =
    element.querySelector<HTMLElement>("h1, h2, h3, h4, h5, h6, [tabindex]") ?? element;
  if (!focusable.hasAttribute("tabindex")) {
    focusable.setAttribute("tabindex", "-1");
  }
  focusable.focus({ preventScroll: true });
}

export function flashSearchTarget(element: HTMLElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.classList.add("search-landing-target");
  element.setAttribute("data-search-flash", "true");
  if (!reducedMotion) {
    element.classList.add("search-landing-flash");
    window.setTimeout(() => {
      element.classList.remove("search-landing-flash");
      element.removeAttribute("data-search-flash");
    }, 2800);
  } else {
    element.removeAttribute("data-search-flash");
  }
}
