import Image from "next/image";
import Link from "next/link";
import { footerNav, CURATOR_DISPLAY_NAME, CURATOR_ROLE_LINE } from "@/content/nav";
import styles from "./Footer.module.css";

export function Footer({
  siteName,
  strapline,
}: {
  siteName: string;
  strapline: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.grid}`}>
        <div className={styles.brandCol}>
          <div className={styles.brandRow}>
            <span className={styles.brandMark}>
              <Image
                src="/media/brand/archive-cross-mark.svg"
                alt=""
                width={36}
                height={36}
                unoptimized
              />
            </span>
            <div className={styles.brand}>{siteName}</div>
          </div>
          <p className={styles.strap}>{strapline}</p>
          <p className={styles.copy}>
            Curated by {CURATOR_DISPLAY_NAME}. {CURATOR_ROLE_LINE}.
          </p>
        </div>
        <div>
          <p className={styles.colTitle}>Explore</p>
          <nav aria-label="Footer">
            <ul className={styles.nav}>
              {footerNav.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.noteCol}>
          <p className={styles.colTitle}>About this archive</p>
          <p className={styles.copy}>
            © {year} {siteName}. A local digital heritage archive. Historical claims
            remain citation-backed; photographs show rights status.
          </p>
          <Link href="/admin/login" className={styles.curatorLink}>
            Curator login
          </Link>
        </div>
      </div>
      <div className={`shell ${styles.wordmarkWrap}`} aria-hidden="true">
        <p className={styles.wordmark}>{siteName}</p>
      </div>
    </footer>
  );
}
