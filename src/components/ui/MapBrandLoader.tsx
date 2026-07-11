import { BrandLogoMark } from "@/components/brand/BrandLogoMark";

type MapBrandLoaderProps = {
  compact?: boolean;
};

export function MapBrandLoader({ compact = false }: MapBrandLoaderProps) {
  const logoSize = compact ? 32 : 40;

  return (
    <div className="card-maritime flex max-w-[min(92%,18rem)] flex-col items-center gap-2.5 rounded-2xl border px-5 py-4 text-center shadow-lg shadow-pelagic-accent/10 sm:px-6 sm:py-5">
      <BrandLogoMark size={logoSize} />
      <div className="leading-none">
        <p
          className={`font-display font-bold tracking-[0.08em] text-pelagic-ink ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          PELAGIC
        </p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-pelagic-accent sm:text-[10px]">
          Marine Consultants
        </p>
      </div>
      <div className="h-0.5 w-12 overflow-hidden rounded-full bg-pelagic-sand/80">
        <div className="h-full w-2/5 animate-pulse rounded-full bg-pelagic-accent" />
      </div>
    </div>
  );
}
