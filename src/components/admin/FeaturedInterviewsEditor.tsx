"use client";

import { useState } from "react";
import type { FeaturedInterview } from "@/lib/cms/types";
import { ImageCropUpload } from "./ImageCropUpload";
import styles from "@/app/admin/admin.module.css";

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
      const res = await fetch(
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
              <input
                className={styles.input}
                value={item.title}
                onChange={(e) => patchInterview(item.id, { title: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Copy
              <textarea
                className={styles.textarea}
                value={item.copy}
                onChange={(e) => patchInterview(item.id, { copy: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Alt text
              <textarea
                className={styles.textarea}
                value={item.alt}
                onChange={(e) => patchInterview(item.id, { alt: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Video path
              <input
                className={styles.input}
                value={item.videoSrc}
                onChange={(e) =>
                  patchInterview(item.id, { videoSrc: e.target.value })
                }
              />
            </label>
            <label className={styles.label}>
              Poster path
              <input
                className={styles.input}
                value={item.posterSrc}
                onChange={(e) =>
                  patchInterview(item.id, { posterSrc: e.target.value })
                }
              />
            </label>
            <ImageCropUpload
              destination="uploads"
              onUploaded={(path) => patchInterview(item.id, { posterSrc: path })}
            />
            <label className={styles.label}>
              Cover focal position (mobile crop; e.g. 50% 20% keeps upper faces)
              <input
                className={styles.input}
                value={item.coverPosition ?? ""}
                placeholder="50% 35%"
                onChange={(e) =>
                  patchInterview(item.id, { coverPosition: e.target.value })
                }
              />
            </label>
            <label className={styles.label}>
              Cover path (optional)
              <input
                className={styles.input}
                value={item.coverSrc ?? ""}
                onChange={(e) =>
                  patchInterview(item.id, { coverSrc: e.target.value })
                }
              />
            </label>
            <ImageCropUpload
              destination="uploads"
              onUploaded={(path) => patchInterview(item.id, { coverSrc: path })}
            />
            <label
              className={styles.label}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
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
