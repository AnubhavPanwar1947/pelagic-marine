import { company } from "@/lib/site-data";
import type { SocialBrand } from "@/components/ui/SocialBrandIcon";

const whatsappMessage = encodeURIComponent(
  "Hello Pelagic Marine — I would like to enquire about marine consultancy services."
);

export type SocialLink = {
  brand: SocialBrand;
  label: string;
  href: string;
  external: boolean;
};

export const socialLinks: SocialLink[] = [
  {
    brand: "linkedin",
    label: "LinkedIn",
    href: company.linkedin,
    external: true,
  },
  {
    brand: "whatsapp",
    label: "WhatsApp",
    href: `https://wa.me/${company.whatsapp}?text=${whatsappMessage}`,
    external: true,
  },
  ...( "instagram" in company &&
  typeof company.instagram === "string" &&
  company.instagram
    ? [
        {
          brand: "instagram" as const,
          label: "Instagram",
          href: company.instagram,
          external: true,
        },
      ]
    : []),
  {
    brand: "email",
    label: "Email",
    href: `mailto:${company.emails.info}`,
    external: false,
  },
];
