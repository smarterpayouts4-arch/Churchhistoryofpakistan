import type { CSSProperties, ReactNode } from "react";
import { CURATOR_DISPLAY_NAME, CURATOR_ROLE_LINE } from "@/content/nav";
import { MediaImage } from "@/components/ui/MediaImage";
import styles from "@/components/home/MyConnection.module.css";

export function ConnectionLayout({
  children,
  portraitSrc,
  className,
  style,
}: {
  children: ReactNode;
  portraitSrc: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className ? `${styles.connectionGrid} ${className}` : styles.connectionGrid}
      style={style}
    >
      <div className={styles.connectionCopy}>{children}</div>
      <figure className={styles.connectionPortrait}>
        <MediaImage
          src={portraitSrc}
          alt={`Portrait of ${CURATOR_DISPLAY_NAME}`}
          width={1122}
          height={1402}
          sizes="(max-width: 760px) 90vw, 360px"
        />
        <figcaption>
          <p className={styles.connectionCaption}>{CURATOR_DISPLAY_NAME}</p>
          <p className={styles.connectionMeta}>{CURATOR_ROLE_LINE}</p>
        </figcaption>
      </figure>
    </div>
  );
}

export function ConnectionBulletList({
  bullets,
  pullQuote,
}: {
  bullets: string[];
  pullQuote?: string;
}) {
  return (
    <>
      <ul className={styles.connectionList}>
        {bullets.map((para) => (
          <li key={para.slice(0, 48)}>
            <span className={styles.check} aria-hidden="true">
              ✓
            </span>
            <span>{para}</span>
          </li>
        ))}
      </ul>
      {pullQuote ? (
        <blockquote className={styles.connectionPull}>“{pullQuote}”</blockquote>
      ) : null}
    </>
  );
}
