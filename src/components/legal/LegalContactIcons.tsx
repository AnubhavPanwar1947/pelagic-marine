import type { ReactNode } from "react";

export type LegalContactIconKind = "mail" | "phone" | "location";

/** Use on Contact Us `<ul>` inside `.legal-prose` to suppress default disc markers. */
export const legalContactListClassName =
  "legal-contact-list min-w-0 list-none space-y-2 break-words pl-0";

const iconSvgClassName = "size-4 shrink-0 text-pelagic-charcoal";

function LegalContactIconSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconSvgClassName}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function LegalContactIconSlot({ kind }: { kind: LegalContactIconKind }) {
  return (
    <span
      className="inline-flex h-[1.75em] w-4 shrink-0 items-center justify-center self-start text-[length:inherit] text-pelagic-charcoal"
      aria-hidden="true"
    >
      <LegalContactIcon kind={kind} />
    </span>
  );
}

export function LegalContactIcon({ kind }: { kind: LegalContactIconKind }) {
  switch (kind) {
    case "mail":
      return (
        <LegalContactIconSvg>
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </LegalContactIconSvg>
      );
    case "phone":
      return (
        <LegalContactIconSvg>
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </LegalContactIconSvg>
      );
    case "location":
      return (
        <LegalContactIconSvg>
          <path d="M12 21s-8-4.5-8-11a8 8 0 1 1 16 0c0 6.5-8 11-8 11z" />
          <circle cx={12} cy={10} r={3} />
        </LegalContactIconSvg>
      );
  }
}

type LegalContactListItemProps = {
  kind: LegalContactIconKind;
  className?: string;
  children: ReactNode;
};

export function LegalContactListItem({ kind, className = "", children }: LegalContactListItemProps) {
  return (
    <li className={`flex min-w-0 items-start gap-2 break-words ${className}`.trim()}>
      <LegalContactIconSlot kind={kind} />
      <span className="min-w-0 break-words">{children}</span>
    </li>
  );
}
