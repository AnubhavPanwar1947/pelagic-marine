import type { Office } from "@/lib/site-data";

type OfficeNetworkBackdropProps = {
  offices: Office[];
};

export function OfficeNetworkBackdrop({ offices }: OfficeNetworkBackdropProps) {
  void offices;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-teal-400/45 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-300/50 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/30 blur-3xl" />
    </div>
  );
}
