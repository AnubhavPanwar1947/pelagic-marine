type ContactSectionBridgeProps = {
  label?: string;
};

export function ContactSectionBridge({ label = "Continue exploring" }: ContactSectionBridgeProps) {
  return (
    <div className="flex justify-center py-6" aria-hidden>
      <div className="flex flex-col items-center gap-1 text-pelagic-accent">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
        <span className="contact-scroll-cue text-lg leading-none">↓</span>
      </div>
    </div>
  );
}
