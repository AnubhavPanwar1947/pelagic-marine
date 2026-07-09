import { company } from "@/lib/site-data";

export function ContactLocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": company.offices.map((office) => ({
      "@type": "LocalBusiness",
      name: `Pelagic Marine — ${office.label}`,
      description: office.tagline ?? company.tagline,
      telephone: office.phone,
      email: company.emails.info,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.address,
        addressCountry: office.region === "UAE" ? "AE" : "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: office.coordinates.lat,
        longitude: office.coordinates.lng,
      },
      url: "https://pelagic-marine.vercel.app/contact",
      parentOrganization: {
        "@type": "Organization",
        name: company.legalName,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
