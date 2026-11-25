"use client";

import { adminFetch } from "./adminFetch";
import { useState } from "react";
import type { FeaturedInterview } from "@/lib/cms/types";
import { ImageField } from "./ImageField";
import { PHOTO_SIZES } from "@/lib/media/sizeHints";

function videoDimensions(url: string): Promise<{ width: number; height: number; duration?: number } | null> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () =>
      resolve(
        v.videoWidth
          ? {
              width: v.videoWidth,
              height: v.videoHeight,
              duration: Number.isFinite(v.duration) ? Math.round(v.duration) : undefined,
            }
          : null,
      );
    v.onerror = () => resolve(null);
    v.src = url;
  });
}
import styles from "@/app/admin/admin.module.css";
import { LINE, NAME, PROSE, URL_FIELD } from "./typing";

type Props = {
  initialInterviews: FeaturedInterview[];
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
};

export function FeaturedInterviewsEditor({
  initialInterviews,
  pending,
  setPending,
  setMessage,
  setError,
}: Props) {
  const [interviews, setInterviews] = useState(initialInterviews);

  function patchInterview(id: string, patch: Partial<FeaturedInterview>) {
    setInterviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  async function saveInterview(item: FeaturedInterview) {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await adminFetch(
        `/api/admin/featured-interviews/${encodeURIComponent(item.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: item.title,
            copy: item.copy,
            alt: item.alt,
            featuredOnHome: item.featuredOnHome,
            videoSrc: item.videoSrc,
            posterSrc: item.posterSrc,
            coverSrc: item.coverSrc ?? "",
            coverPosition: item.coverPosition ?? "",
            width: item.width,
            height: item.height,
            orientation: item.orientation,
            speaker: item.speaker ?? "",
            durationSeconds: item.durationSeconds ?? 0,
            captionsSrc: item.captionsSrc ?? "",
            transcript: item.transcript ?? "",
          }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        item?: FeaturedInterview;
      };
      if (!res.ok || !data.item) {
        setError(data.error || "Update failed.");
        return;
      }
      setInterviews((prev) =>
        prev.map((i) => (i.id === item.id ? data.item! : i)),
      );
      setMessage("Interview metadata saved.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="fi-heading">
      <h2 id="fi-heading">Featured Interviews</h2>
      <p className={styles.hint}>
        Edit the title and copy only when the source wording changes. Poster
        and cover use the image upload, which writes a new file and leaves the
        previous one in place. Video stays a path to an existing file under{" "}
        <code>/media/</code>.
      </p>
      <div className={styles.form}>
        {interviews.map((item) => (
          <article key={item.id} className={styles.panel}>
            <p className={styles.hint}>{item.id}</p>
            <label className={styles.label}>
              Title
              <input {...LINE}
                className={styles.input}
                value={item.title}
                onChange={(e) => patchInterview(item.id, { title: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Copy
              <textarea {...PROSE}
                className={styles.textarea}
                value={item.copy}
                onChange={(e) => patchInterview(item.id, { copy: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Speaker (optional — only when confirmed)
              <input {...NAME}
                className={styles.input}
                value={item.speaker ?? ""}
                onChange={(e) => patchInterview(item.id, { speaker: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Transcript (optional — shown under the player)
              <textarea {...PROSE}
                className={styles.textarea}
                rows={5}
                value={item.transcript ?? ""}
                onChange={(e) => patchInterview(item.id, { transcript: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Captions file (optional, .vtt under /media/)
              <input {...URL_FIELD}
                className={styles.input}
                placeholder="/media/archive/interviews/captions/example.vtt"
                value={item.captionsSrc ?? ""}
                onChange={(e) => patchInterview(item.id, { captionsSrc: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Describe the picture
              <textarea {...PROSE}
                className={styles.textarea}
                value={item.alt}
                onChange={(e) => patchInterview(item.id, { alt: e.target.value })}
              />
            </label>
            <ImageField
              kind="video"
              label="Interview video"
              required
              value={item.videoSrc}
              hint="MP4 works on every phone and browser."
              onChange={async (url) => {
                patchInterview(item.id, { videoSrc: url });
                const dims = await videoDimensions(url);
                if (dims) {
                  patchInterview(item.id, {
                    width: dims.width,
                    height: dims.height,
                    orientation: dims.height > dims.width ? "portrait" : "landscape",
                    ...(dims.duration ? { durationSeconds: dims.duration } : {}),
                  });
                }
              }}
            />
            <ImageField
              label="Poster photo (shown before the video plays)"
              size={PHOTO_SIZES.videoCover}
              required
              value={item.posterSrc}
              onChange={(url) => patchInterview(item.id, { posterSrc: url })}
            />
            <ImageField
              label="Cover photo for cards (optional)"
              size={PHOTO_SIZES.videoCover}
              value={item.coverSrc ?? ""}
              position={item.coverPosition || "50% 35%"}
              onPositionChange={(coverPosition) => patchInterview(item.id, { coverPosition })}
              onChange={(url) => patchInterview(item.id, { coverSrc: url })}
              hint="Falls back to the poster photo."
            />
            <label className={`${styles.label} ${styles.checkRow}`}>
              <input
                type="checkbox"
                checked={item.featuredOnHome}
                onChange={(e) =>
                  patchInterview(item.id, { featuredOnHome: e.target.checked })
                }
              />
              Featured on homepage (max 3)
            </label>
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={pending}
              onClick={() => saveInterview(item)}
            >
              Save
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
