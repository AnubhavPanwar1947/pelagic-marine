"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BrandLogoHomeLinkProps = {
  className: string;
  children: React.ReactNode;
};

export function BrandLogoHomeLink({ className, children }: BrandLogoHomeLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      scroll
      className={className}
      aria-label="Pelagic Marine — home"
      onClick={() => {
        if (pathname === "/") {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }}
    >
      {children}
    </Link>
  );
}
