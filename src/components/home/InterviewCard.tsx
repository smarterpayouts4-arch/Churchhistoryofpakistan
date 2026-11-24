"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./Interviews.module.css";

export type InterviewCardProps = {
  title: string;
  /** Small label above the title (programme / series). */
  eyebrow?: string;
  description: string;
  speaker?: string;
  durationSeconds?: number;
  videoSrc: string;
  posterSrc: string;
  posterBlur?: string;
  coverPosition?: string;
  alt: string;
  width: number;
  height: number;
  sourceUrl?: string;
  provenance?: string;
  captionsSrc?: string;
  transcript?: string;
  headingLevel?: "h2" | "h3";
  /** Wide "featured" layout (used when a grid has a single video). */
  featured?: boolean;
};

/** 267 -> "4:27"; 3725 -> "1:02:05". */
export function formatDuration(total?: number): string | null {
  if (!total || !Number.isFinite(total)) return null;
  const s = Math.round(total);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

/**
 * Oral-history style video card: a clean 16:9 poster with a play button and
 * running time, then title, speaker and a short description. Pressing play
 * opens the video in a modal player (native <dialog>: focus is kept inside,
 * Esc or the backdrop closes, focus returns to the card). The video file is
 * only requested once the player opens.
 */
export function InterviewCard(props: InterviewCardProps) {
  const {
    title,
    eyebrow,
    description,
    speaker,
    durationSeconds,
    videoSrc,
    posterSrc,
    posterBlur,
    coverPosition,
    alt,
    width,
    height,
    sourceUrl,
    provenance,
    captionsSrc,
    transcript,
    headingLevel = "h3",
    featured,
  } = props;
  const Heading = headingLevel;
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const duration = formatDuration(durationSeconds);
  const portrait = height > width;
  // Some source captions only repeat the title; don't show them twice.
  const plain = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const showDescription = Boolean(description) && !plain(title).includes(plain(description));

  const show = useCallback(() => setOpen(true), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  return (
    <article className={styles.card} data-featured={featured ? "true" : undefined}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.thumb}
        onClick={show}
        aria-haspopup="dialog"
        // The name includes the running time exactly as shown on the poster.
        aria-label={`Play video: ${title}${duration ? `, ${duration}` : ""}`}
      >
        {portrait && posterBlur ? (
          <span aria-hidden="true" className={styles.thumbBackdrop} style={{ backgroundImage: `url("${posterBlur}")` }} />
        ) : null}
        <Image
          src={posterSrc}
          alt=""
          fill
          quality={80}
          className={styles.thumbImage}
          sizes={
            featured
              ? "(max-width: 760px) calc(100vw - 2.5rem), 760px"
              : "(max-width: 600px) calc(100vw - 2.5rem), (max-width: 980px) 46vw, 420px"
          }
          {...(posterBlur ? { placeholder: "blur" as const, blurDataURL: posterBlur } : {})}
          style={{ objectFit: portrait ? "contain" : "cover", objectPosition: coverPosition || "50% 50%" }}
        />
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
            <path d="M8 5.5v13l10.5-6.5z" />
          </svg>
        </span>
        {duration ? (
          <span className={styles.duration} aria-hidden="true">
            {duration}
          </span>
        ) : null}
      </button>

      <div className={styles.cardBody}>
        {eyebrow ? <p className={styles.cardEyebrow}>{eyebrow}</p> : null}
        <Heading className={styles.cardTitle}>
          <button type="button" className={styles.titleButton} onClick={show} aria-haspopup="dialog">
            {title}
          </button>
        </Heading>
        {speaker ? <p className={styles.speaker}>{speaker}</p> : null}
        {showDescription ? <p className={styles.description}>{description}</p> : null}
        {provenance ? <p className={styles.provenance}>{provenance}</p> : null}
        <p className={styles.cardMeta}>
          {captionsSrc ? <span>Captions</span> : null}
          {transcript ? <span>Transcript</span> : null}
          {sourceUrl ? (
            <span>
              <a className="tapLink" href={sourceUrl} rel="noopener noreferrer" target="_blank">
                Original post<span className="sr-only"> (opens Facebook in a new tab)</span>
              </a>
            </span>
          ) : null}
        </p>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.player}
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {open ? (
          <div className={styles.playerInner}>
            <div className={styles.playerBar}>
              <p id={titleId} className={styles.playerTitle}>
                {title}
              </p>
              <button type="button" className={styles.playerClose} onClick={close}>
                Close<span aria-hidden="true"> ×</span>
              </button>
            </div>
            <div className={styles.playerFrame}>
              {posterBlur ? (
                <span aria-hidden="true" className={styles.thumbBackdrop} style={{ backgroundImage: `url("${posterBlur}")` }} />
              ) : null}
              <video
                className={styles.playerVideo}
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={posterSrc}
                width={width}
                height={height}
                aria-label={alt}
              >
                <source src={videoSrc} type="video/mp4" />
                {captionsSrc ? <track kind="captions" src={captionsSrc} srcLang="en" label="Captions" default /> : null}
              </video>
            </div>
            <div className={styles.playerInfo}>
              <p className={styles.playerMeta}>
                {[speaker, duration, provenance].filter(Boolean).join(" · ")}
              </p>
              {showDescription ? <p className={styles.playerDescription}>{description}</p> : null}
              {transcript ? (
                <details className={styles.transcript}>
                  <summary>Transcript</summary>
                  <div>
                    {transcript.split(/\n{2,}/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </details>
              ) : (
                <p className={styles.transcriptNote}>A transcript has not been added for this video yet.</p>
              )}
            </div>
          </div>
        ) : null}
      </dialog>
    </article>
  );
}
