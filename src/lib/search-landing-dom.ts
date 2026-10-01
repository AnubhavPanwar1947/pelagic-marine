import { normalizeSearchText } from "./search-matching";
import { SEARCH_LAND_TARGET_ID } from "./search-types";
import {
  SEARCH_MIN_QUERY_LENGTH,
  getHighlightTerms,
  isQueryTooShort,
  splitTextByHighlights,
  textMatchesSearchQuery,
} from "./search-index";

const HIGHLIGHT_ROOT_ATTR = "data-search-highlight-root";

const HIGHLIGHT_SKIP_SELECTOR = "header, footer, nav, [aria-hidden='true']";

/** Smallest on-page blocks to scroll to (not whole articles). */
const SCROLL_TARGET_SELECTOR =
  "p, li, h1, h2, h3, h4, h5, h6, dd, .legal-clause, [data-search-target], blockquote";

function isTextNodeInHighlightScope(node: Node): boolean {
  const parent = node.parentElement;
  if (!parent) {
    return false;
  }
  if (parent.closest("mark.site-search-highlight")) {
    return false;
  }
  if (parent.closest(HIGHLIGHT_SKIP_SELECTOR)) {
    return false;
  }
  if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
    return false;
  }
  return true;
}

export function getMainContentElement(): HTMLElement | null {
  return document.getElementById("main-content");
}

export function clearPersistentHighlights(root: HTMLElement) {
  root.removeAttribute(HIGHLIGHT_ROOT_ATTR);
  const marks = root.querySelectorAll("mark.site-search-highlight");
  for (const mark of marks) {
    const parent = mark.parentNode;
    if (!parent) {
      continue;
    }
    parent.replaceChild(document.createTextNode(mark.textContent ?? ""), mark);
  }
  const landTarget = root.querySelector(`#${SEARCH_LAND_TARGET_ID}`);
  if (landTarget instanceof HTMLElement && landTarget.getAttribute("data-search-land") === "true") {
    landTarget.removeAttribute("id");
    landTarget.removeAttribute("data-search-land");
  }
  root.normalize();
}

export function applyPersistentHighlights(root: HTMLElement, query: string) {
  clearPersistentHighlights(root);
  if (isQueryTooShort(query.trim())) {
    return;
  }
  const terms = getHighlightTerms(query);
  if (!terms.length) {
    return;
  }

  root.setAttribute(HIGHLIGHT_ROOT_ATTR, "true");

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return isTextNodeInHighlightScope(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
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

export function scrollToSearchLandingTarget(element: HTMLElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
  const run = () => scrollElementBelowHeader(element, behavior);
  run();
  requestAnimationFrame(() => {
    run();
    window.setTimeout(run, 100);
    window.setTimeout(run, 350);
  });
}

function normalizeLandText(text: string): string {
  return normalizeSearchText(text).replace(/\s+/g, " ").trim();
}

function scoreParagraphAgainstLand(paragraphText: string, landExcerpt: string): number {
  const paragraph = normalizeLandText(paragraphText);
  const land = normalizeLandText(landExcerpt);
  if (!paragraph || !land) {
    return 0;
  }
  if (paragraph.includes(land)) {
    return 10_000;
  }
  const landPrefix = land.slice(0, Math.min(land.length, 72));
  if (landPrefix.length >= 8 && paragraph.includes(landPrefix)) {
    return 5_000;
  }
  const landWords = land.split(" ").filter((word) => word.length >= 2);
  let matchedWords = 0;
  for (const word of landWords) {
    if (paragraph.includes(word)) {
      matchedWords += 1;
    }
  }
  return matchedWords * 12;
}

export function scrollTargetForMark(mark: HTMLElement): HTMLElement {
  const block = mark.closest(SCROLL_TARGET_SELECTOR);
  if (block instanceof HTMLElement) {
    return block;
  }
  return mark;
}

function allHighlightMarks(main: HTMLElement): HTMLElement[] {
  return [...main.querySelectorAll("mark.site-search-highlight")].filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );
}

export function resolveLandingScrollTarget(
  main: HTMLElement,
  hash: string,
  landExcerpt: string,
): HTMLElement | null {
  const marks = allHighlightMarks(main);
  if (!marks.length) {
    return null;
  }

  const anchorId = hash.replace(/^#/, "");
  if (anchorId && anchorId !== SEARCH_LAND_TARGET_ID) {
    const anchorEl = document.getElementById(anchorId);
    if (anchorEl && main.contains(anchorEl)) {
      const anchorMark = anchorEl.querySelector("mark.site-search-highlight");
      if (anchorMark instanceof HTMLElement) {
        return scrollTargetForMark(anchorMark);
      }
    }
  }

  const land = landExcerpt.trim();
  if (land) {
    let best: { el: HTMLElement; score: number } | null = null;
    for (const mark of marks) {
      const block = scrollTargetForMark(mark);
      const score = scoreParagraphAgainstLand(block.textContent ?? "", land);
      if (!best || score > best.score) {
        best = { el: block, score };
      }
    }
    if (best && best.score > 0) {
      return best.el;
    }
  }

  return scrollTargetForMark(marks[0]!);
}

export function pinLandingTargetId(element: HTMLElement): string {
  if (element.id && element.id !== SEARCH_LAND_TARGET_ID) {
    return element.id;
  }
  element.id = SEARCH_LAND_TARGET_ID;
  element.setAttribute("data-search-land", "true");
  return SEARCH_LAND_TARGET_ID;
}

export function findFallbackSearchTarget(query: string): HTMLElement | null {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return null;
  }
  const main = getMainContentElement();
  if (!main) {
    return null;
  }

  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return isTextNodeInHighlightScope(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    const text = current.textContent ?? "";
    if (textMatchesSearchQuery(text, trimmed, "any")) {
      const parent = current.parentElement;
      const block = parent?.closest(SCROLL_TARGET_SELECTOR);
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

export function findFirstHighlightMark(main: HTMLElement): HTMLElement | null {
  const mark = main.querySelector("mark.site-search-highlight");
  if (mark instanceof HTMLElement) {
    return scrollTargetForMark(mark);
  }
  return null;
}

export function runSearchLanding(
  query: string,
  hash: string,
  landExcerpt: string,
): boolean {
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) {
    return true;
  }

  const main = getMainContentElement();
  if (!main) {
    return false;
  }

  applyPersistentHighlights(main, trimmed);

  const marks = main.querySelectorAll("mark.site-search-highlight");
  if (marks.length === 0) {
    return false;
  }

  let target = resolveLandingScrollTarget(main, hash, landExcerpt);
  if (!target) {
    target = findFirstHighlightMark(main);
  }
  if (!target) {
    return false;
  }

  pinLandingTargetId(target);
  scrollToSearchLandingTarget(target);
  flashSearchTarget(target);
  focusSearchTarget(target);
  return true;
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
