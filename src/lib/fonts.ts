import { Cormorant_Garamond, Inter } from "next/font/google";

/** Primary UI typeface — body and headings */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  fallback: ["Segoe UI", "sans-serif"],
});

/** Homepage hero brand name — serif only */
export const heroBrandSerif = Cormorant_Garamond({
  variable: "--font-hero-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
