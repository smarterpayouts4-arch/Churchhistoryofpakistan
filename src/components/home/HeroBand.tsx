"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import type { HeroBandImage } from "@/lib/cms/types";
import styles from "./Hero.module.css";

/**
 * Hero photo band: one cinematic frame, slow crossfade through the
 * curator-chosen archive photos. Pauses on hover/focus and when the tab
 * is hidden; respects prefers-reduced-motion (static first photo).
 * Fixed aspect ratio — no layout shift while rotating.
 */
/** Up to this many photos get dots; more get a "3 / 20" stepper. */
const MAX_DOTS = 6;

/** href: where tapping the photo goes (the Family Archive). */
export function HeroBand({ images, href }: { images: HeroBandImage[]; href?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (images.length < 2 || paused || !rotationEnabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [images.length, paused, rotationEnabled]);

  if (!images.length) return null;
  const current = images[index] ?? images[0]!;

  return (
    <div
      className={styles.band}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <FrameLink href={href} label={`${current.alt} — open the Family Archive`}>
        {images.map((img, i) => {
          // Only the current photo and its neighbours are in the page, so a
          // 20-photo slideshow doesn't download all 20 at once.
          const d = Math.abs(i - index);
          if (d > 1 && d !== images.length - 1) return null;
          return (
            <div
              key={`${i}-${img.src}`}
              className={styles.bandSlide}
              style={{ opacity: i === index ? 1 : 0 }}
              aria-hidden={i !== index}
            >
              <MediaImage
                src={img.src}
                alt={i === index ? img.alt : ""}
                fill
                sizes="(max-width: 760px) 90vw, 50vw"
                className={styles.bandImg}
                style={{ objectFit: "cover", objectPosition: img.position }}
                priority={i === 0}
              />
            </div>
          );
        })}
        <p className={styles.bandCaption} aria-live="off">
          {current.alt}
        </p>
      </FrameLink>
      {images.length > 1 ? (
        <div className={styles.bandDots} role="group" aria-label="Hero photographs">
          <button type="button" className={styles.rotationButton} onClick={() => setRotationEnabled(v => !v)} aria-pressed={!rotationEnabled}>{rotationEnabled ? "Pause slideshow" : "Resume slideshow"}</button>
          {images.length <= MAX_DOTS ? (
            images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={styles.bandDotBtn}
                aria-label={`Show photo ${i + 1}: ${img.alt}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              >
                <span className={i === index ? styles.bandDotActive : styles.bandDot} aria-hidden="true" />
              </button>
            ))
          ) : (
            // Many photos: a compact "3 / 20" stepper instead of a wall of dots.
            <span className={styles.bandStepper}>
              <button
                type="button"
                className={styles.bandStepBtn}
                aria-label="Previous photo"
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              >
                ‹
              </button>
              <span className={styles.bandCount} aria-live="polite">
                {index + 1} / {images.length}
              </span>
              <button
                type="button"
                className={styles.bandStepBtn}
                aria-label="Next photo"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
              >
                ›
              </button>
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** The photo frame; a link when href is given, so tapping the photo goes somewhere. */
function FrameLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return <div className={styles.bandFrame}>{children}</div>;
  return (
    <Link href={href} className={`${styles.bandFrame} ${styles.bandFrameLink}`} aria-label={label}>
      {children}
    </Link>
  );
}
