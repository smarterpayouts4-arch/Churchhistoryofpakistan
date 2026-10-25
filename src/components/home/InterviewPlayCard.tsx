"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import styles from "./Interviews.module.css";

export type InterviewPlayCardProps = {
  title: string;
  videoSrc: string;
  /** Optional custom cover; falls back to the uncropped source poster. */
  coverSrc?: string;
  coverPosition?: string;
  posterSrc: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Preserve the source aspect ratio for both preview and playback.
 * On activate, mount the video with native controls.
 */
export function InterviewPlayCard({
  title,
  videoSrc,
  coverSrc,
  coverPosition,
  posterSrc,
  alt,
  width,
  height,
}: InterviewPlayCardProps) {
  const [playing, setPlaying] = useState(false);
  const thumbSrc = coverSrc || posterSrc;

  const startPlayback = useCallback(() => {
    setPlaying(true);
  }, []);

  return (
    <div className={styles.interviewMedia} style={{ aspectRatio: `${width} / ${height}` }}>
      {playing ? (
        <video
          className={styles.interviewVideo}
          controls
          autoPlay
          playsInline
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
            width={width}
            height={height}
            decoding="async"
            sizes="(max-width: 760px) 90vw, 50vw"
            style={coverPosition ? { objectPosition: coverPosition } : undefined}
          />
          <span className={styles.interviewPlayIcon} aria-hidden="true">
            <svg viewBox="0 0 64 64" width="64" height="64" focusable="false">
              <circle cx="32" cy="32" r="30" className={styles.interviewPlayDisc} />
              <path
                d="M26 20.5v23l18-11.5z"
                className={styles.interviewPlayTriangle}
              />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
