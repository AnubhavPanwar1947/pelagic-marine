import type { Metadata } from "next";
import { ContactLocalBusinessSchema } from "@/components/contact/ContactLocalBusinessSchema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Pelagic Marine — offices in Mumbai, Dehradun (HQ), and Dubai. 24/7 marine surveying, engineering, and legal consultancy across India and the UAE.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContactLocalBusinessSchema />
      {children}
    </>
  );
}
