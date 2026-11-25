import type { ReactNode } from "react";
import Link from "next/link";
import type { FamilyArchiveItem } from "@/lib/cms/types";
import { GalleryImage } from "@/components/ui/GalleryImage";
import { ArchivePublicRecord } from "@/components/ui/ArchivePublicRecord";
import styles from "@/components/home/FamilyArchives.module.css";

/** Tile shape for every archive photo (4:5 suits this mostly-portrait collection). */
export const ARCHIVE_TILE_RATIO = 4 / 5;
/** Phones (max-width 600px) use a shorter 4:3 tile so one photo never fills the screen. */
export const ARCHIVE_PHONE_TILE_RATIO = 4 / 3;

export async function ArchiveCard({
  item,
  titleTag: Title = "h3",
  children,
  lightbox,
  sizes = "(max-width: 600px) calc(100vw - 2.5rem), (max-width: 1100px) 46vw, 420px",
  href,
}: {
  item: FamilyArchiveItem;
  titleTag?: "h2" | "h3";
  children?: ReactNode;
  /** "<group>:<index>" — makes the photo open in the matching <Lightbox>. */
  lightbox?: string;
  /** next/image sizes for the grid this card sits in. */
  sizes?: string;
  /** Where tapping the title goes (the homepage links each card to its record). */
  href?: string;
}) {
  return (
    <article id={Title === "h2" ? item.id : undefined} className={styles.archiveCard}>
      <div className={styles.archiveFrame}>
        <GalleryImage
          src={item.imageSrc}
          alt={item.alt}
          ratio={ARCHIVE_TILE_RATIO}
          phoneRatio={ARCHIVE_PHONE_TILE_RATIO}
          sizes={sizes}
          position={item.imagePosition}
          fit={item.imageFit}
          className={styles.archivePhoto}
        />
        <div className={styles.archiveOverlay} aria-hidden="true">
          <span>{item.provenance}</span>
        </div>
        {lightbox ? (
          <button type="button" className={styles.enlarge} data-lightbox-open={lightbox}>
            <span className="sr-only">View larger photo: {item.title}</span>
            <span className={styles.enlargeHint} aria-hidden="true">View larger</span>
          </button>
        ) : null}
      </div>
      <Title>
        {href ? <Link className={styles.titleLink} href={href}>{item.title}</Link> : item.title}
      </Title>
      <p className={styles.archiveCaption}>{item.caption}</p>
      <ArchivePublicRecord item={item} />
      {children}
    </article>
  );
}
