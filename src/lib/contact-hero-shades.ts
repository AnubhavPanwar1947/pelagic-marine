export type ContactHeroShadeId =
  | "teal-gold"
  | "teal-gold-mellow"
  | "teal-gold-dawn"
  | "teal-gold-harbour"
  | "teal-gold-sunset"
  | "teal-gold-premium"
  | "teal-gold-soft"
  | "deep-navy"
  | "ocean-sky"
  | "sunset-warm"
  | "marine-classic"
  | "soft-minimal"
  | "blue-depth"
  | "blue-horizon"
  | "blue-azure"
  | "blue-midnight";

export type ContactHeroShadeGroup = "teal-gold" | "blue" | "other";

export const contactHeroShades: {
  id: ContactHeroShadeId;
  label: string;
  tagline: string;
  ribbon: string;
  body: string;
  group: ContactHeroShadeGroup;
}[] = [
  {
    id: "teal-gold-mellow",
    label: "Teal Gold Mellow",
    tagline: "Soft cream, sand & sea — current",
    ribbon: "linear-gradient(90deg, #5b9aa0, #8ecfc4 42%, #d9c4a0)",
    body: "Pastel teal wash + gentle gold haze",
    group: "teal-gold",
  },
  {
    id: "teal-gold",
    label: "Teal Gold Standard",
    tagline: "Brand classic — balanced teal & gold",
    ribbon: "linear-gradient(90deg, #0f766e, #0d9488 40%, #c9941a)",
    body: "Sky shimmer + soft slate",
    group: "teal-gold",
  },
  {
    id: "teal-gold-dawn",
    label: "Teal Gold Dawn",
    tagline: "Morning glow — gold horizon rays",
    ribbon: "linear-gradient(90deg, #0f766e, #14b8a6 35%, #e0b04a 100%)",
    body: "Warm dawn mesh + gold sweep",
    group: "teal-gold",
  },
  {
    id: "teal-gold-harbour",
    label: "Teal Gold Harbour",
    tagline: "Deep teal — port & water feel",
    ribbon: "linear-gradient(90deg, #0c4f4a, #0f766e 55%, #c9941a)",
    body: "Harbour mist + teal wave band",
    group: "teal-gold",
  },
  {
    id: "teal-gold-sunset",
    label: "Teal Gold Sunset",
    tagline: "Gold-forward — warm & inviting",
    ribbon: "linear-gradient(90deg, #0d9488, #c9941a 45%, #e0b04a 100%)",
    body: "Amber cream bloom + sunset sweep",
    group: "teal-gold",
  },
  {
    id: "teal-gold-premium",
    label: "Teal Gold Premium",
    tagline: "Rich layers — flagship look",
    ribbon: "linear-gradient(90deg, #134e4a, #0f766e 35%, #d4a017 72%, #e0b04a)",
    body: "Deep radial teal/gold mesh",
    group: "teal-gold",
  },
  {
    id: "teal-gold-soft",
    label: "Teal Gold Soft",
    tagline: "Lightest brand — cream & pastel",
    ribbon: "linear-gradient(90deg, #0f766e, #5eead4 42%, #fcd34d)",
    body: "Pelagic cream with soft teal wash",
    group: "teal-gold",
  },
  {
    id: "ocean-sky",
    label: "Ocean Sky",
    tagline: "Fresh maritime blue",
    ribbon: "linear-gradient(90deg, #0369a1, #0284c7 45%, #0ea5e9)",
    body: "Light sky blue wash",
    group: "blue",
  },
  {
    id: "blue-depth",
    label: "Blue Depth",
    tagline: "Deep ocean — navy to cyan",
    ribbon: "linear-gradient(90deg, #0c4a6e 0%, #0369a1 45%, #0ea5e9 100%)",
    body: "Ocean radial glow + wave band",
    group: "blue",
  },
  {
    id: "blue-horizon",
    label: "Blue Horizon",
    tagline: "Sky meets sea — vertical fade",
    ribbon: "linear-gradient(90deg, #1e3a5f, #2563eb 50%, #7dd3fc)",
    body: "Horizon gradient mesh",
    group: "blue",
  },
  {
    id: "blue-azure",
    label: "Blue Azure",
    tagline: "Bright corporate blue",
    ribbon: "linear-gradient(90deg, #1d4ed8, #3b82f6 40%, #38bdf8 100%)",
    body: "Azure bloom + light sweep",
    group: "blue",
  },
  {
    id: "blue-midnight",
    label: "Blue Midnight",
    tagline: "Dark navy authority",
    ribbon: "linear-gradient(90deg, #0f172a, #1e3a8a 55%, #3b82f6)",
    body: "Midnight mist + subtle stars",
    group: "blue",
  },
  {
    id: "deep-navy",
    label: "Deep Navy",
    tagline: "Authority — LR / DNV style",
    ribbon: "linear-gradient(90deg, #1a1614, #2c2420 50%, #0f766e)",
    body: "Cool white with navy mist",
    group: "other",
  },
  {
    id: "sunset-warm",
    label: "Sunset Warm",
    tagline: "Warm & welcoming",
    ribbon: "linear-gradient(90deg, #b45309, #c9941a 50%, #e0b04a)",
    body: "Cream and amber glow",
    group: "other",
  },
  {
    id: "marine-classic",
    label: "Marine Classic",
    tagline: "Flat professional teal",
    ribbon: "#0f766e",
    body: "Clean white, no shimmer",
    group: "other",
  },
  {
    id: "soft-minimal",
    label: "Soft Minimal",
    tagline: "Lightest — Sea Delta feel",
    ribbon: "linear-gradient(90deg, #f3ece2, #e8f2fa)",
    body: "Pelagic cream, subtle only",
    group: "other",
  },
];

export const defaultContactHeroShade: ContactHeroShadeId = "teal-gold-mellow";

const themedShadeIds = new Set<ContactHeroShadeId>(
  contactHeroShades.filter((s) => s.group === "blue" || s.group === "teal-gold").map((s) => s.id)
);

export function isThemedHeroShade(id: ContactHeroShadeId) {
  return themedShadeIds.has(id);
}

/** @deprecated Use isThemedHeroShade */
export function isBlueHeroShade(id: ContactHeroShadeId) {
  return contactHeroShades.some((s) => s.group === "blue" && s.id === id);
}

export function previewBodyClass(id: ContactHeroShadeId) {
  switch (id) {
    case "soft-minimal":
      return "bg-pelagic-cream";
    case "marine-classic":
      return "bg-white";
    case "ocean-sky":
    case "blue-azure":
      return "bg-sky-50";
    case "blue-horizon":
      return "bg-gradient-to-b from-sky-100 to-blue-50";
    case "blue-depth":
      return "bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50";
    case "blue-midnight":
      return "bg-gradient-to-b from-slate-100 to-blue-50/80";
    case "teal-gold-dawn":
      return "bg-gradient-to-br from-amber-50 via-teal-50/80 to-slate-50";
    case "teal-gold-harbour":
      return "bg-gradient-to-br from-teal-50 via-slate-50 to-cyan-50/60";
    case "teal-gold-sunset":
      return "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-teal-50/50";
    case "teal-gold-premium":
      return "bg-gradient-to-br from-teal-50 via-amber-50/50 to-slate-50";
    case "teal-gold-mellow":
    case "teal-gold-soft":
      return "bg-gradient-to-br from-pelagic-cream to-teal-50/30";
    case "sunset-warm":
      return "bg-amber-50/80";
    case "deep-navy":
      return "bg-slate-100";
    default:
      return "bg-slate-50";
  }
}
