import { Cormorant_Garamond, Inter } from "next/font/google";

/** Serif display — matches logo wordmark */
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/** UI & body — crisp, Google-grade readability */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
