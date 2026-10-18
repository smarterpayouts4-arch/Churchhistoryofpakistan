"use client";

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
export function HeroBand({ images }: { images: HeroBandImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [images.length, paused]);

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
      <div className={styles.bandFrame}>
        {images.map((img, i) => (
          <div
            key={img.src}
            className={styles.bandSlide}
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <MediaImage
              src={img.src}
              alt={i === index ? img.alt : ""}
              fill
              sizes="(max-width: 640px) 100vw, 1200px"
              className={styles.bandImg}
              style={{ objectFit: "cover", objectPosition: img.position }}
              priority={i === 0}
            />
          </div>
        ))}
        <p className={styles.bandCaption} aria-live="off">
          {current.alt}
        </p>
      </div>
      {images.length > 1 ? (
        <div className={styles.bandDots} role="group" aria-label="Hero photographs">
          {images.map((img, i) => (
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
          ))}
        </div>
      ) : null}
    </div>
  );
}
