import type { ReactNode } from "react";
import Link from "next/link";
import type { CathedralRecord } from "@/lib/cms/types";
import { GalleryImage } from "@/components/ui/GalleryImage";
import styles from "@/components/home/Churches.module.css";

export async function PlaceCard({
  cathedral,
  titleTag: Title = "h3",
  children,
  href,
}: {
  cathedral: CathedralRecord;
  titleTag?: "h2" | "h3";
  children?: ReactNode;
  /** Where tapping the title goes (the homepage links each card to its church). */
  href?: string;
}) {
  const open = cathedral.photo_status === "open_license";

  return (
    <article id={Title === "h2" ? cathedral.id : undefined} className={styles.placeCard}>
      <div className={styles.placeMedia}>
        <GalleryImage
          src={cathedral.local_file}
          ratio={4 / 3}
          alt={
            open
              ? `Exterior of ${cathedral.cathedral}, ${cathedral.city}`
              : `Archival placeholder for ${cathedral.cathedral}, ${cathedral.city}`
          }
          sizes="(max-width: 600px) calc(100vw - 2.5rem), (max-width: 1100px) 46vw, 320px"
        />
        <span className={`${styles.rightsBadge} ${open ? "" : styles.rightsPending}`}>
          {open ? "Reusable photo verified" : "Photo permission pending"}
        </span>
      </div>
      <div className={styles.placeCopy}>
        <p className="eyebrow">{cathedral.diocese}</p>
        <Title>
          {href ? <Link className={styles.titleLink} href={href}>{cathedral.cathedral}</Link> : cathedral.cathedral}
        </Title>
        <p>{cathedral.city}</p>
        <p className={styles.address}>{cathedral.address}</p>
        {children}
      </div>
    </article>
  );
}
