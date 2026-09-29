"use client";

import { useMemo } from "react";
import { splitTextByHighlights } from "@/lib/search-index";

export function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => splitTextByHighlights(text, query), [text, query]);
  return (
    <>
      {parts.map((part, index) =>
        part.highlight ? (
          <mark key={`${part.text}-${index}`} className="site-search-highlight">
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}
