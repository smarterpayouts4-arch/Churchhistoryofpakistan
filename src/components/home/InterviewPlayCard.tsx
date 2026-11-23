"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import styles from "./Interviews.module.css";

export type InterviewPlayCardProps = {
  title: string;
  videoSrc: string;
  /** Optional custom cover; falls back to the source poster frame. */
  coverSrc?: string;
  coverPosition?: string;
  posterSrc: string;
  /** Blur placeholder of the poster (media manifest); also the frame backdrop. */
  posterBlur?: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Every interview plays in the same 16:9 frame. Portrait and square clips
 * are shown whole and centred over a softly blurred copy of their poster,
 * so they are never shrunk into a thin strip or cropped. Nothing is
 * downloaded until the visitor presses play (then preload=metadata +
 * autoplay with native controls).
 */
export function InterviewPlayCard({
  title,
  videoSrc,
  coverSrc,
  coverPosition,
  posterSrc,
  posterBlur,
  alt,
  width,
  height,
}: InterviewPlayCardProps) {
  const [playing, setPlaying] = useState(false);
  const thumbSrc = coverSrc || posterSrc;
  const portrait = height > width;

  const startPlayback = useCallback(() => {
    setPlaying(true);
  }, []);

  return (
    <div className={styles.interviewMedia} data-orientation={portrait ? "portrait" : "landscape"}>
      {posterBlur ? (
        <span
          aria-hidden="true"
          className={styles.interviewBackdrop}
          style={{ backgroundImage: `url("${posterBlur}")` }}
        />
      ) : null}
      {playing ? (
        <video
          className={styles.interviewVideo}
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={thumbSrc}
          width={width}
          height={height}
          aria-label={alt}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <button
          type="button"
          className={styles.interviewCoverButton}
          onClick={startPlayback}
          aria-label={`Play ${title}`}
        >
          <Image
            className={styles.interviewCoverImage}
            src={thumbSrc}
            alt=""
            fill
            quality={80}
            sizes="(max-width: 600px) calc(100vw - 2.5rem), (max-width: 980px) 46vw, 420px"
            {...(posterBlur ? { placeholder: "blur" as const, blurDataURL: posterBlur } : {})}
            style={coverPosition ? { objectPosition: coverPosition } : undefined}
          />
          <span className={styles.interviewPlayIcon} aria-hidden="true">
            <svg viewBox="0 0 64 64" width="64" height="64" focusable="false">
              <circle cx="32" cy="32" r="30" className={styles.interviewPlayDisc} />
              <path d="M26 20.5v23l18-11.5z" className={styles.interviewPlayTriangle} />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
