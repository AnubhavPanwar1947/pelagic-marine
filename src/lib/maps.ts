import type { Office } from "@/lib/site-data";

type OfficeMapTarget = Pick<Office, "coordinates" | "mapQuery" | "address">;

/** Embedded map — uses exact coordinates for a precise pin */
export function getGoogleMapsEmbedUrl(office: OfficeMapTarget): string {
  const { lat, lng } = office.coordinates;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

/** Opens Google Maps app/site — uses building name for best search results */
export function getGoogleMapsSearchUrl(office: OfficeMapTarget): string {
  const query = encodeURIComponent(office.mapQuery || office.address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
