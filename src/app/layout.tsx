import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { dmSans, playfair } from "@/lib/fonts";
import { company } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${company.name} | Marine & Engineering Consultancy`,
    template: `%s | ${company.name}`,
  },
  description:
    "Pelagic Marine Solutions delivers round-the-clock marine surveying, naval architecture, engineering, LNG advisory, and maritime legal consultancy across India and Dubai.",
  keywords: [
    "marine consultancy",
    "ship surveying",
    "naval architecture",
    "maritime legal",
    "LNG bunkering",
    "decarbonization",
    "Pelagic Marine",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SplashScreen />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
