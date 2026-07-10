import type { ReactNode } from "react";

type ContactPanelShellProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export function ContactPanelShell({
  children,
  className = "",
  innerClassName = "",
}: ContactPanelShellProps) {
  return (
    <div
      className={`contact-card-gradient-shell contact-card-gradient-shell--medium flex h-full w-full rounded-2xl p-[2px] shadow-xl ${className}`}
    >
      <div
        className={`contact-page-form flex h-full w-full flex-col overflow-hidden rounded-[14px] border border-white/55 bg-white shadow-xl ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
