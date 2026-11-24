import { MediaImage } from "@/components/ui/MediaImage";
import { mediaMeta, tileFit } from "@/lib/media/meta";
import type { ImageFit } from "@/lib/cms/types";
import styles from "./GalleryImage.module.css";

/**
 * A photo inside a fixed-ratio gallery tile (the parent sets aspect-ratio
 * and position: relative). Every tile is the same shape:
 *  - cover: fills the tile, cropped around the focal point (object-position)
 *  - contain: the whole photo, centred over a softly blurred copy of itself
 *    (documents, panoramas, portraits in a wide tile) — no flat letterbox bars
 * Phones can use a different tile shape (phoneRatio, applied by the parent's
 * CSS at max-width 600px); fit is then chosen separately for that shape so a
 * portrait is never cropped through the face in a short phone tile.
 * Uses the media manifest for a blur placeholder while the photo loads.
 */
export async function GalleryImage({
  src,
  alt,
  ratio,
  phoneRatio,
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
  /** Tile width / height on phones (max-width 600px), e.g. 4 / 3. */
  phoneRatio?: number;
  sizes: string;
  position?: string;
  fit?: ImageFit;
  priority?: boolean;
  className?: string;
}) {
  const meta = await mediaMeta(src);
  const mode = tileFit(meta, ratio, fit);
  const phoneMode = phoneRatio ? tileFit(meta, phoneRatio, fit) : mode;
  const needsBackdrop = (mode === "contain" || phoneMode === "contain") && meta.blur;
  const fitClass = [
    mode === "contain" ? styles.contain : styles.cover,
    phoneMode === "contain" ? styles.phoneContain : styles.phoneCover,
  ].join(" ");
  const backdropClass = [
    styles.backdrop,
    mode === "contain" ? "" : styles.backdropOffDesk,
    phoneMode === "contain" ? styles.backdropOnPhone : styles.backdropOffPhone,
  ].join(" ");
  return (
    <>
      {needsBackdrop ? (
        <span aria-hidden="true" className={backdropClass} style={{ backgroundImage: `url("${meta.blur}")` }} />
      ) : null}
      <MediaImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        blurDataURL={meta.blur}
        className={`${styles.photo} ${fitClass} ${className ?? ""}`}
        // objectFit comes from the fit classes; undefined clears MediaImage's inline default.
        // Phones crop to a shorter 4:3 tile; without a chosen focal point keep the
        // top of the photo (heads) and trim from the bottom.
        style={{ objectFit: undefined, "--focal": position || "50% 30%", "--focal-phone": position || "50% 0%" } as React.CSSProperties}
      />
    </>
  );
}
