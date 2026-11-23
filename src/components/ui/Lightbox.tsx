"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import styles from "./Lightbox.module.css";

export type LightboxPhoto = {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  meta?: string;
};

/**
 * Accessible photo viewer for a gallery. Cards rendered on the server mark
 * their photo frame with `data-lightbox-open="<group>:<index>"`; this
 * component listens for those clicks, so the cards stay server components.
 * Native <dialog> gives focus trapping and Esc to close. ← / → move between
 * photos, and a horizontal swipe does the same on touch screens.
 */
export function Lightbox({ group, photos }: { group: string; photos: LightboxPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((i: number, opener: HTMLElement | null) => {
    returnFocus.current = opener;
    setIndex(i);
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-lightbox-open]");
      if (!el) return;
      const [g, i] = (el.dataset.lightboxOpen ?? "").split(":");
      if (g !== group) return;
      const n = Number(i);
      if (!Number.isInteger(n) || !photos[n]) return;
      e.preventDefault();
      open(n, el);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [group, photos, open]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setIndex(null);
      returnFocus.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  const photo = index === null ? null : photos[index];

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={photo ? `Photo: ${photo.title}` : "Photo viewer"}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      }}
      onClick={(e) => {
        // Click on the dimmed backdrop (the dialog itself) closes.
        if (e.target === e.currentTarget) close();
      }}
    >
      {photo ? (
        <div className={styles.inner}>
          <div className={styles.bar}>
            <span className={styles.count} aria-live="polite">
              {index! + 1} of {photos.length}
            </span>
            <button type="button" className={styles.close} onClick={close} autoFocus>
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <figure
            className={styles.figure}
            onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
            onTouchEnd={(e) => {
              const start = touchX.current;
              const end = e.changedTouches[0]?.clientX;
              touchX.current = null;
              if (start == null || end == null) return;
              if (Math.abs(end - start) > 48) step(end < start ? 1 : -1);
            }}
          >
            <div className={styles.frame} key={photo.src}>
              <MediaImage src={photo.src} alt={photo.alt} fill sizes="100vw" />
            </div>
            <figcaption className={styles.caption}>
              <strong>{photo.title}</strong>
              {photo.caption ? <span>{photo.caption}</span> : null}
              {photo.meta ? <em>{photo.meta}</em> : null}
            </figcaption>
          </figure>
          {photos.length > 1 ? (
            <>
              <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)}>
                <span aria-hidden="true">‹</span>
                <span className="sr-only">Previous photo</span>
              </button>
              <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)}>
                <span aria-hidden="true">›</span>
                <span className="sr-only">Next photo</span>
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
