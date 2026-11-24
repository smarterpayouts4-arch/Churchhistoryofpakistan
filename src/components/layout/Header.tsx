"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SiteNavItem } from "@/lib/cms/types";
import { primaryNav } from "@/content/nav";
import styles from "./Header.module.css";

/** Below this width the links move into the slide-in side drawer (keep in sync with Header.module.css). */
const DRAWER_QUERY = "(max-width: 1180px)";

export function Header({ siteName, navItems = primaryNav }: { siteName: string; navItems?: SiteNavItem[] }) {
  const pathname = usePathname();
  // Remember which page the drawer was opened on, so it closes by itself after navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer if the window grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia(DRAWER_QUERY);
    const onChange = () => {
      if (!mq.matches) setOpenOn(null);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  // While the drawer is open: lock page scroll, move focus into it, keep Tab
  // inside it, and let Escape close it and return focus to the menu button.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenOn(null);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !navRef.current) return;
      const focusables = Array.from(
        navRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = navRef.current.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={styles.header} data-scrolled={scrolled}>
      <div className={`shell ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label={`${siteName} home`} onClick={() => setOpen(false)}>
          <Image src="/media/brand/archive-cross-mark.svg" alt="" width={42} height={42} unoptimized />
          <span className={styles.brandText}>
            <span className={styles.brandStrong}>{siteName}</span>
            <span className={styles.brandSmall}>Preserving our heritage</span>
          </span>
        </Link>

        <button
          id="menu-toggle"
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span className={styles.burger} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={styles.menuLabel}>Menu</span>
        </button>

        <div
          className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
          aria-hidden="true"
          data-testid="nav-backdrop"
          onClick={() => close()}
        />

        <nav
          id="primary-nav"
          ref={navRef}
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          aria-label="Primary"
          data-open={open}
        >
          <div className={styles.drawerHead}>
            <span className={styles.drawerTitle}>Menu</span>
            <button
              ref={closeRef}
              type="button"
              className={styles.closeButton}
              aria-label="Close menu"
              onClick={() => close()}
            >
              <span aria-hidden="true">×</span>
              <span className={styles.closeLabel}>Close</span>
            </button>
          </div>
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={i === navItems.length - 1 ? styles.cta : undefined}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              onClick={() => close(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className={styles.admin}
            rel="nofollow"
            prefetch={false}
            aria-current={isCurrent("/admin") ? "page" : undefined}
            onClick={() => close(false)}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
