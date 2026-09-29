import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SearchPageClient } from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search services, articles, and pages across the Pelagic Marine website.",
};

function SearchFallback() {
  return (
    <div className="site-search-page">
      <div className="site-search-page__inner">
        <p className="site-search-page__status">Loading search…</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SectionMaritime variant="mist" className="py-10 sm:py-14" gridOpacity={40}>
      <Suspense fallback={<SearchFallback />}>
        <SearchPageClient />
      </Suspense>
    </SectionMaritime>
  );
}
