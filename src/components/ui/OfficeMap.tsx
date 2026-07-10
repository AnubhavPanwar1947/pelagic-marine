import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { getGoogleMapsEmbedUrl, getGoogleMapsSearchUrl } from "@/lib/maps";
import type { Office } from "@/lib/site-data";

type OfficeMapProps = {
  office: Office;
  className?: string;
  tall?: boolean;
  dark?: boolean;
};

export function OfficeMap({ office, className = "", tall = false, dark = false }: OfficeMapProps) {
  const embedUrl = getGoogleMapsEmbedUrl(office);
  const mapsUrl = getGoogleMapsSearchUrl(office);

  return (
    <div className={className}>
      <div
        className={`relative overflow-hidden rounded-2xl shadow-lg ${
          dark
            ? "border border-pelagic-gold/35 bg-pelagic-charcoal/40 ring-1 ring-white/10"
            : "border border-pelagic-gold/20 bg-pelagic-cream/30 ring-1 ring-pelagic-gold/10 shadow-pelagic-accent/5"
        } ${tall ? "aspect-[21/9] min-h-[260px] sm:min-h-[320px]" : "aspect-[4/3]"}`}
      >
        <GoogleMapEmbed
          src={embedUrl}
          title={`Map — ${office.label}`}
          className="absolute inset-0 h-full w-full"
          frameClassName="grayscale-[0.15] contrast-[1.02]"
        />
      </div>
      <p className={`mt-3 text-sm leading-6 ${dark ? "text-slate-300" : "text-slate-600"}`}>
        {office.address}
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-2 inline-flex text-sm font-semibold underline-offset-4 hover:underline ${
          dark ? "text-pelagic-gold-light hover:text-white" : "text-pelagic-steel hover:text-pelagic-accent"
        }`}
      >
        Open in Google Maps →
      </a>
    </div>
  );
}
