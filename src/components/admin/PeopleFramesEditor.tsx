"use client";

import { adminFetch } from "./adminFetch";
import { useState } from "react";
import type { PeopleFrame } from "@/lib/cms/types";
import { ImageField } from "./ImageField";
import styles from "@/app/admin/admin.module.css";
import { LINE, PROSE } from "./typing";

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
      const res = await adminFetch("/api/admin/people-frames", {
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
              <input {...LINE}
                className={styles.input}
                value={frame.title}
                onChange={(e) => patchFrame(frame.id, { title: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Alt text
              <textarea {...PROSE}
                className={styles.textarea}
                value={frame.alt}
                onChange={(e) => patchFrame(frame.id, { alt: e.target.value })}
              />
            </label>
            <ImageField
              label="Photo"
              required
              value={frame.src}
              onChange={(url) => patchFrame(frame.id, { src: url, position: undefined })}
              position={frame.position}
              onPositionChange={(position) => patchFrame(frame.id, { position })}
              fit={frame.fit}
              onFitChange={(fit) => patchFrame(frame.id, { fit })}
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
