import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Pelagic Marine — 24/7 marine surveying, engineering, and legal consultancy. Offices in Mumbai, Dehradun, and Dubai.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
