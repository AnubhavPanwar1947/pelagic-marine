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
            : "border border-pelagic-mist bg-pelagic-sand shadow-sm"
        } ${tall ? "aspect-[21/9] min-h-[280px] sm:min-h-[360px]" : "aspect-[4/3]"}`}
      >
        <iframe
          title={`Map — ${office.label}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="office-map-frame absolute inset-0 h-full w-full border-0 grayscale-[0.15] contrast-[1.02]"
          allowFullScreen
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
