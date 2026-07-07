import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "light";
  external?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-pelagic-gold text-white shadow-lg shadow-pelagic-gold/30 hover:bg-pelagic-gold-light",
  secondary:
    "bg-pelagic-ink text-white shadow-md hover:bg-pelagic-charcoal",
  outline:
    "border-2 border-pelagic-charcoal/20 bg-white text-pelagic-ink hover:border-pelagic-gold hover:text-pelagic-gold",
  light:
    "border-2 border-white bg-white text-pelagic-ink shadow-lg hover:bg-pelagic-gold hover:border-pelagic-gold hover:text-white",
};

export function Button({
  href,
  children,
  variant = "primary",
  external,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
