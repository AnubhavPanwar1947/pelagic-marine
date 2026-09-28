import type { Metadata } from "next";
import { ContactLocalBusinessSchema } from "@/components/contact/ContactLocalBusinessSchema";

export const metadata: Metadata = {
  title: { absolute: "Contact — Pelagic Marine" },
  description:
    "Contact Pelagic Marine LLC, Dubai. Office No. 104, Almas Business Center, Al Raffa. info@pelagic-marine.com, +971 50 394 1049.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContactLocalBusinessSchema />
      {children}
    </>
  );
}
