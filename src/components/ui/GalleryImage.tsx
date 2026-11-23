import { MediaImage } from "@/components/ui/MediaImage";
import { mediaMeta, tileFit } from "@/lib/media/meta";
import type { ImageFit } from "@/lib/cms/types";
import styles from "./GalleryImage.module.css";

/**
 * A photo inside a fixed-ratio gallery tile (the parent sets aspect-ratio
 * and position: relative). Every tile is the same shape:
 *  - cover: fills the tile, cropped around the focal point (object-position)
 *  - contain: the whole photo, centred over a softly blurred copy of itself
 *    (documents, panoramas) — no flat letterbox bars
 * Uses the media manifest for a blur placeholder while the photo loads.
 */
export async function GalleryImage({
  src,
  alt,
  ratio,
  sizes,
  position,
  fit,
  priority,
  className,
}: {
  src: string;
  alt: string;
  /** Tile width / height, e.g. 4 / 5. */
  ratio: number;
  sizes: string;
  position?: string;
  fit?: ImageFit;
  priority?: boolean;
  className?: string;
}) {
  const meta = await mediaMeta(src);
  const mode = tileFit(meta, ratio, fit);
  return (
    <>
      {mode === "contain" && meta.blur ? (
        <span aria-hidden="true" className={styles.backdrop} style={{ backgroundImage: `url("${meta.blur}")` }} />
      ) : null}
      <MediaImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        blurDataURL={meta.blur}
        className={`${styles.photo} ${className ?? ""}`}
        style={{
          objectFit: mode,
          objectPosition: mode === "cover" ? position || "50% 30%" : "50% 50%",
        }}
      />
    </>
  );
}
