import type { ReactNode } from "react";
import type { CathedralRecord } from "@/lib/cms/types";
import { MediaImage } from "@/components/ui/MediaImage";
import styles from "@/components/home/Churches.module.css";

export function PlaceCard({
  cathedral,
  titleTag: Title = "h3",
  children,
}: {
  cathedral: CathedralRecord;
  titleTag?: "h2" | "h3";
  children?: ReactNode;
}) {
  const open = cathedral.photo_status === "open_license";

  return (
    <article id={Title === "h2" ? cathedral.id : undefined} className={styles.placeCard}>
      <div className={styles.placeMedia}>
        <MediaImage
          src={cathedral.local_file}
          alt={
            open
              ? `Exterior of ${cathedral.cathedral}, ${cathedral.city}`
              : `Archival placeholder for ${cathedral.cathedral}, ${cathedral.city}`
          }
          fill
          style={{ objectFit: "contain", objectPosition: "center" }}
          sizes="(max-width: 768px) 100vw, (max-width: 980px) 50vw, 33vw"
        />
        <span className={`${styles.rightsBadge} ${open ? "" : styles.rightsPending}`}>
          {open ? "Reusable photo verified" : "Photo permission pending"}
        </span>
      </div>
      <div className={styles.placeCopy}>
        <p className="eyebrow">{cathedral.diocese}</p>
        <Title>
          {cathedral.cathedral}
        </Title>
        <p>{cathedral.city}</p>
        <p className={styles.address}>{cathedral.address}</p>
        {children}
      </div>
    </article>
  );
}
