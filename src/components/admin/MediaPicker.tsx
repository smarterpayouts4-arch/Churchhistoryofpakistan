"use client";

import { useEffect, useRef } from "react";
import s from "./studio.module.css";
import { MediaLibrary } from "./MediaLibrary";
import type { LibraryEntry } from "./mediaStore";

/** Modal picker: choose from the library or upload something new. */
export function MediaPicker({
  open,
  kind = "image",
  selectedUrl,
  onClose,
  onPick,
}: {
  open: boolean;
  kind?: "image" | "video";
  selectedUrl?: string;
  onClose: () => void;
  onPick: (entry: LibraryEntry) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className={s.dialog} aria-labelledby="picker-title" onClose={onClose}>
      <div className={s.dialogHead}>
        <h2 id="picker-title">Choose a {kind === "video" ? "video" : "photo"}</h2>
        <button type="button" className={s.iconBtn} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className={s.dialogBody}>
        {open ? (
          <MediaLibrary
            mode="pick"
            kind={kind}
            selectedUrl={selectedUrl}
            onPick={(e) => {
              onPick(e);
              onClose();
            }}
          />
        ) : null}
      </div>
    </dialog>
  );
}
