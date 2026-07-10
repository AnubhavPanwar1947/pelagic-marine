export type OfficeRegion = "India" | "UAE";

export type OfficeId = "mumbai" | "dehradun" | "dubai";

export type MapHubId = "india" | "uae";

export type Office = {
  id: OfficeId;
  label: string;
  address: string;
  region: OfficeRegion;
  hubId: MapHubId;
  phone: string;
  /** Building-focused query for Google Maps search links */
  mapQuery: string;
  /** Verified pin coordinates for embedded maps */
  coordinates: { lat: number; lng: number };
  /** Short line for contact office cards */
  tagline?: string;
  hours?: string;
  /** Shown as chips on office cards */
  services?: string[];
};

export type MapHub = {
  id: MapHubId;
  label: string;
  region: OfficeRegion;
  coordinates: { lat: number; lng: number };
  officeIds: OfficeId[];
};

export const mapHubs: MapHub[] = [
  {
    id: "india",
    label: "India",
    region: "India",
    coordinates: { lat: 20.5937, lng: 78.9629 },
    officeIds: ["mumbai", "dehradun"],
  },
  {
    id: "uae",
    label: "Dubai",
    region: "UAE",
    coordinates: { lat: 25.25443, lng: 55.28639 },
    officeIds: ["dubai"],
  },
];

export const offices: Office[] = [
  {
    id: "mumbai",
    label: "Mumbai",
    address: "18th Floor, Cyber One, Sector 30, Vashi, Navi Mumbai 400703",
    region: "India",
    hubId: "india",
    phone: "+91 7895039068",
    mapQuery: "Cyber One, Sector 30, Vashi, Navi Mumbai",
    coordinates: { lat: 19.077989, lng: 72.998214 },
    tagline: "Surveys, engineering & fleet support",
    hours: "Mon–Sat · 9:00–18:00 IST",
    services: ["Surveys", "Engineering", "Advisory"],
  },
  {
    id: "dehradun",
    label: "Dehradun",
    address: "3/11 D, 2nd Floor Gyan Tower, Garhi Cantonment, Dehradun 248001",
    region: "India",
    hubId: "india",
    phone: "+91 7895039068",
    mapQuery: "Gyan Tower, Garhi Cantonment, Dehradun",
    coordinates: { lat: 30.316496, lng: 78.032192 },
    tagline: "Design, analysis & technical consultancy",
    hours: "Mon–Sat · 9:00–18:00 IST",
    services: ["Naval arch", "Engineering", "Legal"],
  },
  {
    id: "dubai",
    label: "Dubai",
    address: "Office No. 104, Almas Business Center, Aghaadir Building, Al Raffa, Dubai",
    region: "UAE",
    hubId: "uae",
    phone: "+971 50 394 1049",
    mapQuery: "Almas Business Center, Al Raffa, Dubai",
    coordinates: { lat: 25.25443, lng: 55.28639 },
    tagline: "Middle East shipping & offshore advisory",
    hours: "Sun–Thu · 9:00–18:00 GST",
    services: ["Offshore", "Shipping", "Clean fuels"],
  },
];

export function getOfficeById(id: OfficeId): Office {
  const office = offices.find((o) => o.id === id);
  if (!office) throw new Error(`Unknown office: ${id}`);
  return office;
}

export function getOfficeIndex(id: OfficeId): number {
  return offices.findIndex((o) => o.id === id);
}

export function getHubOffices(hubId: MapHubId): Office[] {
  const hub = mapHubs.find((h) => h.id === hubId);
  if (!hub) return [];
  return hub.officeIds.map(getOfficeById);
}

export function getHubForOffice(office: Office): MapHub {
  return mapHubs.find((h) => h.id === office.hubId)!;
}
