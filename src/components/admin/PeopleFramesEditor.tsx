"use client";

import { useState } from "react";
import type { PeopleFrame } from "@/lib/cms/types";
import { ImageCropUpload } from "./ImageCropUpload";
import styles from "@/app/admin/admin.module.css";

type Props = {
  initialFrames: PeopleFrame[];
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
};

export function PeopleFramesEditor({
  initialFrames,
  pending,
  setPending,
  setMessage,
  setError,
}: Props) {
  const [frames, setFrames] = useState(initialFrames);

  function patchFrame(id: string, patch: Partial<PeopleFrame>) {
    setFrames((prev) =>
      prev.map((frame) => (frame.id === id ? { ...frame, ...patch } : frame)),
    );
  }

  async function saveFrames() {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/people-frames", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        data?: { frames: PeopleFrame[] };
      };
      if (!res.ok || !data.data) {
        setError(data.error || "People frames save failed.");
        return;
      }
      setFrames(data.data.frames);
      setMessage("People stills saved. Biographies stay forthcoming.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="people-heading">
      <h2 id="people-heading">People stills</h2>
      <p className={styles.hint}>
        Replace the picture, title, or alt text for the three forthcoming
        frames. This tab does not create biographies.
      </p>
      <div className={styles.form}>
        {frames.map((frame) => (
          <article key={frame.id} className={styles.panel}>
            <p className={styles.hint}>{frame.id}</p>
            <label className={styles.label}>
              Title
              <input
                className={styles.input}
                value={frame.title}
                onChange={(e) => patchFrame(frame.id, { title: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Alt text
              <textarea
                className={styles.textarea}
                value={frame.alt}
                onChange={(e) => patchFrame(frame.id, { alt: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Image path
              <input
                className={styles.input}
                value={frame.src}
                onChange={(e) => patchFrame(frame.id, { src: e.target.value })}
              />
            </label>
            <ImageCropUpload
              destination="uploads"
              onUploaded={(path) => patchFrame(frame.id, { src: path })}
            />
          </article>
        ))}
        <button
          type="button"
          className={styles.primaryBtn}
          disabled={pending}
          onClick={saveFrames}
        >
          Save people stills
        </button>
      </div>
    </section>
  );
}
