import { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type ContactSectionIntroProps = {
  step: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

/** Bright content panel — pops above vibrant section backgrounds. */
export function ContactSectionIntro({
  step,
  eyebrow,
  title,
  description,
  children,
}: ContactSectionIntroProps) {
  return (
    <Reveal>
      <div className="contact-content-bright rounded-3xl border border-white/80 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pelagic-gold text-sm font-bold text-white shadow">
            {step}
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-pelagic-gold">{eyebrow}</p>
        </div>
        <h2 className="font-display mt-4 text-2xl font-semibold text-pelagic-ink sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-pelagic-charcoal">{description}</p>
        {children}
      </div>
    </Reveal>
  );
}
