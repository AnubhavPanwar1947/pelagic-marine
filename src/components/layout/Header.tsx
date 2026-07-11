"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { NavSearch } from "@/components/layout/NavSearch";
import { company, navMenu, type NavDropdownChild, type NavMenuItem } from "@/lib/site-data";

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
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
  return `relative whitespace-nowrap px-2 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-pelagic-accent after:transition-transform after:duration-200 xl:px-2.5 ${
    active
      ? "text-pelagic-ink after:scale-x-100"
      : "text-pelagic-body after:scale-x-0 hover:text-pelagic-ink hover:after:scale-x-100"
  }`;
}

function DesktopServiceChild({
  child,
  onClose,
}: {
  child: NavDropdownChild;
  onClose: () => void;
}) {
  const [subOpen, setSubOpen] = useState(false);
  const hasChildren = Boolean(child.children?.length);

  if (!hasChildren) {
    return (
      <Link
        href={child.href}
        onClick={onClose}
        className="block rounded-xl px-3 py-3 transition hover:bg-pelagic-sky/60"
      >
        <span className="text-sm font-semibold text-pelagic-ink">{child.label}</span>
        {child.description && (
          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-pelagic-slate">
            {child.description}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
    >
      <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition hover:bg-pelagic-sky/60">
        <Link
          href={child.href}
          onClick={onClose}
          className="text-sm font-semibold text-pelagic-ink"
        >
          {child.label}
        </Link>
        <Chevron open={subOpen} />
      </div>
      {subOpen && (
        <div className="absolute top-0 left-full z-50 pl-2">
          <ul className="max-h-[70vh] w-72 space-y-0.5 overflow-y-auto rounded-xl border border-pelagic-sand bg-white p-2 shadow-xl ring-1 ring-black/5">
            {child.children!.map((sub) => (
              <li key={sub.href}>
                <Link
                  href={sub.href}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2 text-sm text-pelagic-steel transition hover:bg-pelagic-sky/50 hover:text-pelagic-ink"
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
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
              wide ? "w-[min(90vw,22rem)]" : "w-80"
            }`}
          >
            <Link
              href={item.href}
              className="mb-2 block rounded-lg bg-pelagic-sky/50 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-pelagic-navy hover:bg-pelagic-sky"
              onClick={() => setOpen(false)}
            >
              View all {item.label === "Decarb" ? "Decarbonization" : item.label} →
            </Link>
            <ul className="space-y-1">
              {item.children.map((child) => (
                <li key={child.href + child.label}>
                  <DesktopServiceChild child={child} onClose={() => setOpen(false)} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileServiceChild({
  child,
  onNavigate,
}: {
  child: NavDropdownChild;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(child.children?.length);

  if (!hasChildren) {
    return (
      <Link
        href={child.href}
        onClick={onNavigate}
        className="block rounded-lg px-2 py-2 text-sm text-pelagic-steel hover:bg-pelagic-sky/50"
      >
        {child.label}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-pelagic-sand/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-2 py-2 text-sm font-semibold text-pelagic-charcoal"
      >
        {child.label}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="border-t border-pelagic-sand px-2 pb-2">
          <Link
            href={child.href}
            onClick={onNavigate}
            className="mt-2 block rounded-lg px-2 py-1.5 text-xs font-bold text-pelagic-accent"
          >
            All {child.label} →
          </Link>
          {child.children!.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={onNavigate}
              className="block rounded-lg px-2 py-2 text-sm text-pelagic-steel hover:bg-pelagic-sky/50"
            >
              {sub.label}
            </Link>
          ))}
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
        className="rounded-lg px-3 py-2.5 text-sm font-semibold text-pelagic-charcoal hover:bg-pelagic-sky/50"
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
            className="mt-2 block rounded-lg px-2 py-2 text-xs font-bold text-pelagic-accent"
          >
            All {item.label === "Decarb" ? "Decarbonization" : item.label} →
          </Link>
          <div className="space-y-1">
            {item.children.map((child) => (
              <MobileServiceChild key={child.href + child.label} child={child} onNavigate={onNavigate} />
            ))}
          </div>
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
          ? "border-b border-pelagic-sand bg-white shadow-[0_8px_30px_rgba(20,48,110,0.1)]"
          : "border-b border-transparent bg-white/90 backdrop-blur-md"
      }`}
    >
      <div
        className={`h-1 bg-gradient-to-r from-pelagic-navy via-pelagic-accent to-pelagic-light transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-90"
        }`}
        aria-hidden
      />
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <BrandLogo variant="header" compact={scrolled} navSolid={scrolled} />

        <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex lg:gap-0 xl:gap-0.5">
          {navMenu.map((item) => (
            <DesktopNavItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden md:block">
            <NavSearch />
          </div>

          <Link
            href="/contact"
            className="hidden rounded-full bg-[#266aae] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-[#266aae]/35 transition hover:bg-[#1a5f9e] sm:inline-flex xl:text-sm"
          >
            Contact us
          </Link>

          <button
            type="button"
            className="rounded-lg border border-pelagic-sand bg-white px-3 py-2 text-sm font-semibold text-pelagic-navy lg:hidden"
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
          <div className="mb-4 md:hidden">
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
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-[#266aae] py-2.5 text-center text-sm font-bold text-white shadow-md shadow-[#266aae]/35 transition hover:bg-[#1a5f9e]"
            >
              Contact us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
