"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav } from "@/content/nav";
import styles from "./Header.module.css";

export function Header({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Link
          className={styles.brand}
          href="/"
          aria-label={`${siteName} home`}
          onClick={() => setOpen(false)}
        >
          <Image
            src="/media/brand/archive-cross-mark.svg"
            alt=""
            width={42}
            height={42}
            unoptimized
          />
          <span className={styles.brandText}>
            <span className={styles.brandStrong}>{siteName}</span>
            <span className={styles.brandSmall}>Preserving our heritage</span>
          </span>
        </Link>

        <button
          id="menu-toggle"
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close ×" : "Menu +"}
        </button>

        <nav
          id="primary-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          aria-label="Primary"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              document.getElementById("menu-toggle")?.focus();
            }
          }}
        >
          {primaryNav.map((item) => {
            const current =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
