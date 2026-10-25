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
        <nav className={styles.nav} aria-label="Footer">
          {footerNav.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className={styles.copy}>
          © {year} {siteName}. A digital heritage archive.
          Historical claims remain citation-backed; photographs
          show rights status. Complete legal and privacy pages before public launch.
          {" · "}
          <Link href="/admin/login" className={styles.curatorLink}>
            Curator login
          </Link>
        </p>
      </div>
    </footer>
  );
}
