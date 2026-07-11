"use client";

import { contactPage } from "@/lib/site-data";

const iconMap = {
  project: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  technical: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  urgent: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  careers: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
} as const;

export function ContactIntentPaths() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {contactPage.intentPaths.map((path) => {
        const icon = iconMap[path.icon as keyof typeof iconMap];
        const isForm = "target" in path && path.target === "enquiry-form";
        const className =
          "group card-maritime flex flex-col rounded-xl border p-3 shadow-sm transition hover:border-pelagic-accent/50 hover:shadow-md";

        const content = (
          <>
            <div className="flex items-start gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pelagic-cream text-pelagic-accent transition group-hover:bg-pelagic-accent group-hover:text-white">
                {icon}
              </span>
              <div className="min-w-0">
                <p className="font-display text-xs font-semibold leading-snug text-pelagic-ink sm:text-sm">
                  {path.title}
                </p>
                <p className="type-caption mt-0.5 leading-snug">
                  {path.description}
                </p>
              </div>
            </div>
            <span className="type-muted mt-2 inline-flex font-bold uppercase tracking-wide text-pelagic-accent">
              {path.cta} →
            </span>
          </>
        );

        if (isForm) {
          return (
            <a key={path.id} href={`#${path.target}`} className={className}>
              {content}
            </a>
          );
        }

        return (
          <a
            key={path.id}
            href={"href" in path ? path.href : "#"}
            className={className}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
