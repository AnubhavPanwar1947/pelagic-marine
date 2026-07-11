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
    "bg-pelagic-accent text-white shadow-lg shadow-pelagic-accent/30 hover:bg-pelagic-blue",
  secondary:
    "bg-pelagic-navy text-white shadow-md hover:bg-pelagic-charcoal",
  outline:
    "border-2 border-pelagic-accent/30 bg-white text-pelagic-navy hover:border-pelagic-accent hover:text-pelagic-accent",
  light:
    "border-2 border-white bg-white text-pelagic-navy shadow-lg hover:bg-pelagic-accent hover:border-pelagic-accent hover:text-white",
};

export function Button({
  href,
  children,
  variant = "primary",
  external,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-normal transition-all duration-300 ${variants[variant]} ${className}`;

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
