import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { ConsentAwareAnalytics } from "@/components/ui/ConsentAwareAnalytics";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { cormorant, inter } from "@/lib/fonts";
import { company } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pelagic-marine.vercel.app"),
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: company.name,
    title: `${company.name} | Marine & Engineering Consultancy`,
    description:
      "Naval architecture, surveys, engineering and clean-fuel advisory — from India and Dubai.",
    images: [{ url: "/logo.svg", width: 512, height: 512, alt: company.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | Marine & Engineering Consultancy`,
    description:
      "Naval architecture, surveys, engineering and clean-fuel advisory — from India and Dubai.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-pelagic-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-pelagic-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <SplashScreen />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
