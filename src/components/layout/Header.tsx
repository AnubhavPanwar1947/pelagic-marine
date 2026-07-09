"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { NavSearch } from "@/components/layout/NavSearch";
import { company, navMenu, type NavMenuItem } from "@/lib/site-data";

const phoneHref = `tel:${company.phones.india.replace(/\s/g, "")}`;

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function navLinkClass(active: boolean) {
  return `relative px-2 py-2 text-xs font-medium transition-colors after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-pelagic-gold after:transition-transform after:duration-200 xl:px-2.5 xl:text-sm ${
    active
      ? "text-pelagic-ink after:scale-x-100"
      : "text-pelagic-steel after:scale-x-0 hover:text-pelagic-ink hover:after:scale-x-100"
  }`;
}

function DesktopNavItem({
  item,
  pathname,
}: {
  item: NavMenuItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = isActive(pathname, item.href);

  const openMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 280);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [open]);

  if (item.type === "link") {
    return (
      <Link href={item.href} className={navLinkClass(active)}>
        {item.label}
      </Link>
    );
  }

  const wide = item.label === "Services";

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 ${navLinkClass(open || active)}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <Chevron open={open} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 z-50 pt-2"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div
            className={`rounded-2xl border border-pelagic-sand bg-white p-3 shadow-xl ring-1 ring-black/5 ${
              wide ? "w-[min(90vw,36rem)]" : "w-80"
            }`}
          >
            <Link
              href={item.href}
              className="mb-2 block rounded-lg bg-pelagic-cream px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-pelagic-gold hover:bg-pelagic-sand"
              onClick={() => setOpen(false)}
            >
              View all {item.label} →
            </Link>
            <ul className={wide ? "grid gap-1 sm:grid-cols-2" : "space-y-1"}>
              {item.children.map((child) => (
                <li key={child.href + child.label}>
                  <Link
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 transition hover:bg-pelagic-cream"
                  >
                    <span className="text-sm font-semibold text-pelagic-ink">
                      {child.label}
                    </span>
                    {child.description && (
                      <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-pelagic-slate">
                        {child.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: NavMenuItem;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (item.type === "link") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="rounded-lg px-3 py-2.5 text-sm font-medium text-pelagic-charcoal hover:bg-pelagic-cream"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-pelagic-sand/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-pelagic-charcoal"
      >
        {item.label}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="border-t border-pelagic-sand px-2 pb-2">
          <Link
            href={item.href}
            onClick={onNavigate}
            className="mt-2 block rounded-lg px-2 py-2 text-xs font-bold text-pelagic-gold"
          >
            All {item.label} →
          </Link>
          {item.children.map((child) => (
            <Link
              key={child.href + child.label}
              href={child.href}
              onClick={onNavigate}
              className="block rounded-lg px-2 py-2 text-sm text-pelagic-steel hover:bg-pelagic-cream"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? "border-b border-pelagic-mist bg-white shadow-[0_8px_30px_rgba(26,22,20,0.08)]"
          : "border-b border-transparent bg-white/75 backdrop-blur-md"
      }`}
    >
      <div
        className={`h-1 bg-gradient-to-r from-pelagic-accent via-pelagic-gold to-pelagic-gold-light transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-70"
        }`}
        aria-hidden
      />
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:gap-2 lg:px-8 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3.5"
        }`}
      >
        <BrandLogo variant="header" compact={scrolled} />

        <nav className="hidden items-center lg:flex lg:gap-0.5 xl:gap-1">
          {navMenu.map((item) => (
            <DesktopNavItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <NavSearch />
          </div>

          <a
            href={phoneHref}
            className="hidden items-center gap-1.5 rounded-full border border-pelagic-accent/30 bg-pelagic-sky/50 px-3 py-2 text-xs font-bold text-pelagic-accent transition hover:border-pelagic-accent hover:bg-pelagic-sky lg:inline-flex lg:px-4 lg:text-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pelagic-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pelagic-accent" />
            </span>
            24/7 Urgent
          </a>

          <Link
            href="/contact"
            className={`hidden lg:inline-flex ${navLinkClass(isActive(pathname, "/contact"))}`}
          >
            Contact
          </Link>

          <Link
            href="/login"
            className="hidden rounded-full bg-pelagic-gold px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-pelagic-gold/25 transition hover:bg-pelagic-gold-light sm:inline-flex lg:px-3 lg:py-2 lg:text-xs xl:px-4 xl:py-2.5 xl:text-sm"
          >
            Client Login
          </Link>

          <button
            type="button"
            className="rounded-lg border border-pelagic-warm bg-pelagic-cream px-3 py-2 text-sm font-medium text-pelagic-charcoal lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-pelagic-sand bg-white px-4 py-4 lg:hidden">
          <div className="mb-4 sm:hidden">
            <NavSearch />
          </div>
          <nav className="flex flex-col gap-2">
            {navMenu.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                onNavigate={() => setOpen(false)}
              />
            ))}
            <a
              href={phoneHref}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-pelagic-accent/40 bg-pelagic-sky/40 px-4 py-2.5 text-sm font-bold text-pelagic-accent"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-pelagic-accent" />
              24/7 Urgent · {company.phones.india}
            </a>
            <Link
              href="/contact"
              className="mt-2 rounded-full border border-pelagic-warm py-2.5 text-center text-sm font-semibold text-pelagic-charcoal md:hidden"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="mt-2 rounded-full bg-pelagic-gold py-2.5 text-center text-sm font-bold text-white sm:hidden"
            >
              Client Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
