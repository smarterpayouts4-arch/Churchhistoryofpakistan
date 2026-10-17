import type { ReactNode } from "react";
import type { FamilyArchiveItem } from "@/lib/cms/types";
import { MediaImage } from "@/components/ui/MediaImage";
import { ArchivePublicRecord } from "@/components/ui/ArchivePublicRecord";
import styles from "@/components/home/FamilyArchives.module.css";

export function ArchiveCard({
  item,
  titleTag: Title = "h3",
  children,
}: {
  item: FamilyArchiveItem;
  titleTag?: "h2" | "h3";
  children?: ReactNode;
}) {
  return (
    <article className={styles.archiveCard}>
      <div className={styles.archiveFrame}>
        <MediaImage
          src={item.imageSrc}
          alt={item.alt}
          fill
          style={{ objectFit: "contain", objectPosition: "center" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px"
          className={styles.archivePhoto}
        />
        <div className={styles.archiveOverlay} aria-hidden="true">
          <span>{item.provenance}</span>
        </div>
      </div>
      <Title className={styles.archiveTitle}>
        {item.title}
      </Title>
      <p className={styles.archiveCaption}>{item.caption}</p>
      <ArchivePublicRecord item={item} />
      {children}
    </article>
  );
}
