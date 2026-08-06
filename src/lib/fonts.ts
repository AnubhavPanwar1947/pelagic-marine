import { Cormorant_Garamond, Montserrat } from "next/font/google";

/** Brand wordmark — matches logo lockup */
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/**
 * Tesla.com uses proprietary Universal Sans (Display + Text).
 * Montserrat is the closest free geometric sans (same family as Gotham,
 * Tesla’s previous typeface) for both headings and body.
 */
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
