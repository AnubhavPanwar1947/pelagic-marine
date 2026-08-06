import { Cormorant_Garamond, Jost, Poppins } from "next/font/google";

/** Brand wordmark — matches logo lockup */
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/** UI & body — Poppins (ShoreSafe-style readability) */
export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/** Section headings — Jost (ShoreSafe display sans) */
export const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
