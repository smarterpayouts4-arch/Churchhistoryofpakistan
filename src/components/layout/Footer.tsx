import Image from "next/image";
import Link from "next/link";
import { footerNav, CURATOR_DISPLAY_NAME, CURATOR_ROLE_LINE } from "@/content/nav";
import type { SiteNavItem } from "@/lib/cms/types";
import styles from "./Footer.module.css";

export function Footer({
  siteName,
  strapline,
  navItems = footerNav,
  exploreTitle = "Explore",
  aboutTitle = "About this archive",
  aboutCopy = "A local digital heritage archive. Historical claims remain citation-backed; photographs show rights status.",
  curatorLinkLabel = "Curator login",
}: {
  siteName: string;
  strapline: string;
  navItems?: SiteNavItem[];
  exploreTitle?: string;
  aboutTitle?: string;
  aboutCopy?: string;
  curatorLinkLabel?: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.grid}`}>
        <div>
          <div className={styles.brandRow}>
            <Image
              src="/media/brand/archive-cross-mark.svg"
              alt=""
              width={40}
              height={40}
              unoptimized
              className={styles.brandMark}
            />
            <div>
              <div className={styles.brand}>{siteName}</div>
              <p className={styles.strap}>{strapline}</p>
            </div>
          </div>
          <p className={styles.copy} style={{ marginTop: "1rem" }}>
            Curated by {CURATOR_DISPLAY_NAME}. {CURATOR_ROLE_LINE}.
          </p>
        </div>
        <nav className={styles.nav} aria-label={exploreTitle}>
          {navItems.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className={styles.copy} aria-label={aboutTitle}>
          © {year} {siteName}. {aboutCopy}
          {" · "}
          <Link href="/admin/login" className={styles.curatorLink}>
            {curatorLinkLabel}
          </Link>
        </p>
      </div>
    </footer>
  );
}
