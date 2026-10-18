"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/content/nav";
import type { SiteNavItem } from "@/lib/cms/types";
import styles from "./Header.module.css";

export function Header({ siteName, navItems = primaryNav }: { siteName: string; navItems?: SiteNavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile sheet is open: lock page scroll, keep Tab inside the
  // header, and let Escape close it and return focus to the menu button.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !headerRef.current) return;
      const focusables = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>("a[href], button"),
      ).filter((el) => el.offsetParent !== null || el === buttonRef.current);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = headerRef.current.contains(active);
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
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${open ? styles.isOpen : ""}`}
    >
      <div className={`shell ${styles.inner}`}>
        <Link
          className={styles.brand}
          href="/"
          aria-label={`${siteName} home`}
          onClick={() => setOpen(false)}
        >
          <span className={styles.brandMark}>
            <Image
              src="/media/brand/archive-cross-mark.svg"
              alt=""
              width={40}
              height={40}
              unoptimized
            />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandStrong}>{siteName}</span>
            <span className={styles.brandSmall}>Preserving our heritage</span>
          </span>
        </Link>

        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuLabel}>{open ? "Close" : "Menu"}</span>
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <nav
          id="primary-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          aria-label="Primary"
        >
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const current =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const isCta = item.href === "/contribute";
              return (
                <li key={item.href} className={isCta ? styles.ctaItem : undefined}>
                  <Link
                    href={item.href}
                    className={isCta ? styles.navCta : styles.navLink}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className={styles.sheetNote} aria-hidden="true">
            {siteName} · Preserving our heritage
          </p>
        </nav>
      </div>
    </header>
  );
}
