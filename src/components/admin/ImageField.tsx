"use client";

import { useId, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import s from "./studio.module.css";
import { MediaPicker } from "./MediaPicker";
import { Thumb } from "./Thumb";
import type { LibraryEntry } from "./mediaStore";

type Props = {
  label: string;
  value: string;
  onChange: (url: string, entry?: LibraryEntry) => void;
  kind?: "image" | "video";
  required?: boolean;
  hint?: string;
  /** Optional focal point ("50% 20%"): click the preview to set it. */
  position?: string;
  onPositionChange?: (pos: string) => void;
  /** Optional gallery fit: "contain" = show the whole photo in its tile (no cropping). */
  fit?: "cover" | "contain";
  onFitChange?: (fit: "cover" | "contain" | undefined) => void;
};

/**
 * Photo / video field: preview + "Choose…" (library picker with upload).
 * No URLs to type. Optional click-to-set focal point keeps faces framed.
 */
export function ImageField({
  label,
  value,
  onChange,
  kind = "image",
  required,
  hint,
  position,
  onPositionChange,
  fit,
  onFitChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const [px, py] = (position ?? "50% 50%").split(/\s+/).map((v) => parseFloat(v));
  const noun = kind === "video" ? "video" : "photo";

  return (
    <div className={s.field} role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className={s.fieldLabel}>
        {label}
        {required ? " *" : ""}
      </span>
      <div className={s.fieldBody}>
        <div className={s.fieldPreview}>
          {value ? (
            <>
              <Thumb src={value} kind={kind} position={position} sizes="160px" />
              {onPositionChange && kind === "image" ? (
                <button
                  type="button"
                  className={s.focalButton}
                  aria-label="Set the focus point: click on the most important part of the photo (for example a face)"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
                    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
                    onPositionChange(`${x}% ${y}%`);
                  }}
                >
                  <span className={s.focalDot} style={{ left: `${px || 50}%`, top: `${Number.isNaN(py) ? 50 : py}%` }} />
                </button>
              ) : null}
            </>
          ) : (
            <span className={s.fieldPreviewEmpty}>No {noun} chosen</span>
          )}
        </div>
        <div>
          <p className={s.fieldName}>{value ? decodeURIComponent(value.split("/").pop() ?? value) : `Choose a ${noun} from the library or upload a new one.`}</p>
          {hint ? <p className={styles.hint} style={{ marginBottom: "0.45rem" }}>{hint}</p> : null}
          {onPositionChange && value && kind === "image" ? (
            <p className={styles.hint} style={{ marginBottom: "0.45rem" }}>
              Tip: click the preview on the most important spot (e.g. a face) to keep it in frame.
            </p>
          ) : null}
          {onFitChange && value && kind === "image" ? (
            <label className={`${styles.hint} ${styles.checkRow}`} style={{ marginBottom: "0.45rem" }}>
              <input
                type="checkbox"
                checked={fit === "contain"}
                onChange={(e) => onFitChange(e.target.checked ? "contain" : undefined)}
              />
              Show the whole photo (no cropping) — best for documents, plaques and wide panoramas.
            </label>
          ) : null}
          <div className={styles.rowActions}>
            <button type="button" className={styles.secondaryBtn} onClick={() => setOpen(true)}>
              {value ? `Replace ${noun}` : `Choose ${noun}`}
            </button>
            {value && !required ? (
              <button type="button" className={s.smallBtn} onClick={() => onChange("")}>
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <MediaPicker
        open={open}
        kind={kind}
        selectedUrl={value}
        onClose={() => setOpen(false)}
        onPick={(entry) => onChange(entry.url, entry)}
      />
    </div>
  );
}
