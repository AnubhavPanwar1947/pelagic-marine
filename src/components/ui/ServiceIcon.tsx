import type { ReactNode } from "react";

type ServiceIconProps = {
  slug: string;
  className?: string;
};

export function ServiceIcon({ slug, className = "h-7 w-7" }: ServiceIconProps) {
  const icons: Record<string, ReactNode> = {
    "inspection-audits-surveying": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        <path d="M11 8v6M8 11h6" strokeLinecap="round" />
      </svg>
    ),
    "naval-architecture-design": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M4 18h16" strokeLinecap="round" />
        <path d="M6 18l3-10 3 6 3-8 3 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    engineering: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" strokeLinecap="round" />
      </svg>
    ),
    "lng-alternative-fuels": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M12 3c-4 6-6 9-6 12a6 6 0 1012 0c0-3-2-6-6-12z" strokeLinejoin="round" />
      </svg>
    ),
    "legal-consultancy": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "vessel-operations": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
        <path d="M3 18h18" strokeLinecap="round" />
        <path d="M5 18l2-8h10l2 8" strokeLinejoin="round" />
        <path d="M8 10V7h8v3" strokeLinecap="round" />
        <path d="M12 7V4" strokeLinecap="round" />
      </svg>
    ),
  };

  return <>{icons[slug] ?? icons.engineering}</>;
}
