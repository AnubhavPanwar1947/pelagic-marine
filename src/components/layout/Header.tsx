"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { NavSearch } from "@/components/layout/NavSearch";
import { navMenu, type NavDropdownChild, type NavMenuItem } from "@/lib/site-data";

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      }`}
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

const MOBILE_NAV_PANEL_ID = "site-mobile-nav";

function MenuToggleIcon({ open }: { open: boolean }) {
  const line =
    "origin-center transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none";

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path
        d="M5 8h14"
        className={`${line} ${open ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
      />
      <path
        d="M5 12h14"
        className={`${line} ${open ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
      />
      <path
        d="M5 16h14"
        className={`${line} ${open ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
      />
      <path
        d="M7 7L17 17"
        className={`${line} ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      />
      <path
        d="M17 7L7 17"
        className={`${line} ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function navLinkClass(active: boolean) {
  return `site-header-nav-link relative whitespace-nowrap px-1.5 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] transition-colors after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:rounded-full after:bg-pelagic-accent after:transition-transform after:duration-200 xl:px-2.5 xl:text-xs xl:tracking-[0.12em] after:xl:left-2 after:xl:right-2 ${
    active
      ? "text-pelagic-ink after:scale-x-100"
      : "text-pelagic-body after:scale-x-0 hover:text-pelagic-ink hover:after:scale-x-100"
  }`;
}

/** Same nested flyout pattern as live pelagic-marine.vercel.app */
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
          <ul className="max-h-[70vh] w-72 space-y-0.5 overflow-y-auto overscroll-contain rounded-xl border border-pelagic-sand bg-white p-2 shadow-xl ring-1 ring-black/5">
            {child.children!.map((sub) => (
              <li key={`${sub.href}-${sub.label}`}>
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
          {/* No overflow on this panel — overflow would clip the nested flyout (same as live Vercel). */}
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
  panelId,
}: {
  child: NavDropdownChild;
  onNavigate: () => void;
  panelId: string;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(child.children?.length);
  const subPanelId = `${panelId}-${child.label.replace(/\s+/g, "-").toLowerCase()}`;

  if (!hasChildren) {
    return (
      <Link
        href={child.href}
        onClick={onNavigate}
        className="site-mobile-nav-sublink block min-h-11 rounded-lg px-3 py-2.5 text-sm text-pelagic-steel transition hover:bg-pelagic-sky/50 hover:text-pelagic-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
      >
        {child.label}
      </Link>
    );
  }

  return (
    <div className="site-mobile-nav-subgroup rounded-lg border border-pelagic-sand/70 bg-white/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-semibold text-pelagic-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pelagic-accent"
        aria-expanded={open}
        aria-controls={subPanelId}
      >
        <span>{child.label}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div id={subPanelId} className="border-t border-pelagic-sand/80 px-2 pb-2">
          {child.children!.map((sub) => (
            <Link
              key={`${sub.href}-${sub.label}`}
              href={sub.href}
              onClick={onNavigate}
              className="site-mobile-nav-sublink block min-h-11 rounded-lg px-3 py-2.5 text-sm text-pelagic-steel transition hover:bg-pelagic-sky/50 hover:text-pelagic-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
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
  pathname,
  onNavigate,
}: {
  item: NavMenuItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `mobile-nav-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
  const active = isActive(pathname, item.href);

  if (item.type === "link") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`site-mobile-nav-link block min-h-11 rounded-xl px-4 py-3 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent ${
          active
            ? "bg-white text-pelagic-navy shadow-sm ring-1 ring-pelagic-accent/30"
            : "text-pelagic-charcoal hover:bg-white/90"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="site-mobile-nav-accordion overflow-hidden rounded-xl border border-pelagic-sand/80 bg-white/90 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pelagic-accent ${
          active || open ? "text-pelagic-navy" : "text-pelagic-charcoal"
        }`}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>{item.label}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div id={panelId} className="border-t border-pelagic-sand/80 px-3 pb-3 pt-2">
          <Link
            href={item.href}
            onClick={onNavigate}
            className="mb-2 block min-h-11 rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-pelagic-accent transition hover:bg-pelagic-sky/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
          >
            All {item.label === "Decarb" ? "Decarbonization" : item.label} →
          </Link>
          <div className="space-y-1.5">
            {item.children.map((child) => (
              <MobileServiceChild
                key={child.href + child.label}
                child={child}
                onNavigate={onNavigate}
                panelId={panelId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  const closeMenu = useCallback((restoreFocus = false) => {
    shouldRestoreFocusRef.current = restoreFocus;
    setMenuOpen(false);
  }, []);

  const handleSearchOpenChange = useCallback((next: boolean) => {
    if (next) {
      shouldRestoreFocusRef.current = false;
      setMenuOpen(false);
    }
    setSearchOpen(next);
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu(true);
      return;
    }
    setSearchOpen(false);
    setMenuOpen(true);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
    setSearchOpen(false);
  }, [pathname, closeMenu]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => setHeaderHeight(header.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      if (shouldRestoreFocusRef.current) {
        menuButtonRef.current?.focus();
        shouldRestoreFocusRef.current = false;
      }
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu(true);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      ref={headerRef}
      style={
        headerHeight > 0
          ? ({ "--site-header-height": `${headerHeight}px` } as React.CSSProperties)
          : undefined
      }
      className={`sticky top-0 z-50 transition-[box-shadow,background-color,border-color] duration-300 ease-out motion-reduce:transition-none ${
        scrolled || menuOpen || searchOpen
          ? "border-b border-pelagic-sand bg-white shadow-[0_12px_40px_rgba(20,48,110,0.14)] backdrop-blur-lg"
          : "border-b border-transparent bg-white/90 backdrop-blur-md"
      }`}
      data-scrolled={scrolled ? "true" : "false"}
      data-mobile-nav-open={menuOpen ? "true" : "false"}
      data-search-open={searchOpen ? "true" : "false"}
    >
      <div
        className={`site-header-accent h-1 bg-gradient-to-r from-pelagic-navy via-pelagic-accent to-pelagic-light transition-all duration-300 motion-reduce:transition-none ${
          scrolled ? "opacity-100 shadow-[0_1px_8px_rgba(47,168,238,0.35)]" : "opacity-90"
        }`}
        aria-hidden
      />
      <div
        className={`site-header-bar mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-1 px-3 sm:gap-1.5 sm:px-4 nav:gap-1.5 nav:px-4 xl:gap-2 xl:px-8 ${
          scrolled ? "py-2.5" : "py-3"
        }`}
      >
        <div className="min-w-0 shrink">
          <BrandLogo variant="header" />
        </div>

        <nav className="site-header-nav hidden min-w-0 flex-1 items-center justify-center nav:flex nav:gap-0 xl:gap-0.5">
          {navMenu.map((item) => (
            <DesktopNavItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 nav:gap-2">
          <div className="site-header-search">
            <NavSearch open={searchOpen} onOpenChange={handleSearchOpenChange} />
          </div>

          <Link
            href="/contact"
            className="hidden shrink-0 whitespace-nowrap rounded-full bg-pelagic-accent px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-md shadow-pelagic-accent/35 transition hover:bg-pelagic-accent-hover nav:inline-flex nav:px-3.5 nav:py-2 nav:text-[11px] xl:px-4 xl:py-2.5 xl:text-sm"
          >
            Contact us
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2 nav:hidden ${
              menuOpen ? "text-pelagic-accent" : "text-pelagic-navy hover:text-pelagic-accent"
            }`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_NAV_PANEL_ID}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <MenuToggleIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id={MOBILE_NAV_PANEL_ID}
          className="site-mobile-nav-panel fixed inset-x-0 bottom-0 z-40 flex flex-col nav:hidden motion-reduce:transition-none"
          style={{
            top: headerHeight > 0 ? `${headerHeight}px` : undefined,
            height:
              headerHeight > 0 ? `calc(100svh - ${headerHeight}px)` : "calc(100svh - 4.5rem)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
              <nav className="flex flex-col gap-2" aria-label="Mobile">
                {navMenu.map((item) => (
                  <MobileNavItem
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    onNavigate={() => closeMenu()}
                  />
                ))}
              </nav>
            </div>

            <div className="site-mobile-nav-panel__footer shrink-0 border-t border-pelagic-sand/80 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
              <Link
                href="/contact"
                onClick={() => closeMenu()}
                className="site-mobile-nav-panel__cta block min-h-11 rounded-full bg-pelagic-accent py-3 text-center text-sm font-bold text-white transition hover:bg-pelagic-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent focus-visible:ring-offset-2"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
