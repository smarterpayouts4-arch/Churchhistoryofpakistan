"use client";

import { useEffect, useRef, useState } from "react";
import type { ConflictInfo } from "./adminFetch";
import s from "./studio.module.css";
import a from "@/app/admin/admin.module.css";

type Pending = { info: ConflictInfo; resolve: (c: "overwrite" | "reload" | "cancel") => void };

const DOC_NAMES: Record<string, string> = {
  "homepage.json": "the homepage",
  "home-layout.json": "the homepage layout",
  "site.json": "site settings",
  "family-archives.json": "the Family Archive",
  "featured-interviews.json": "interviews",
  "people-frames.json": "people photos",
  "cathedrals.json": "churches",
  "curator-profile.json": "the curator profile",
  "blog.json": "the blog",
};

/** Shown when someone else saved the same section while you were editing. */
export function ConflictDialog() {
  const [pending, setPending] = useState<Pending | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function onConflict(e: Event) {
      e.preventDefault();
      setPending((e as CustomEvent<Pending>).detail);
    }
    window.addEventListener("admin-conflict", onConflict);
    return () => window.removeEventListener("admin-conflict", onConflict);
  }, []);

  useEffect(() => {
    if (pending && !ref.current?.open) ref.current?.showModal();
  }, [pending]);

  function choose(c: "overwrite" | "reload" | "cancel") {
    pending?.resolve(c);
    setPending(null);
    ref.current?.close();
  }

  const when = pending?.info.updatedAt ? new Date(pending.info.updatedAt).toLocaleString() : null;

  return (
    <dialog
      ref={ref}
      className={s.dialogSmall}
      aria-labelledby="conflict-title"
      onCancel={(e) => {
        e.preventDefault();
        choose("cancel");
      }}
    >
      <div className={s.dialogHead}>
        <h2 id="conflict-title">Someone else just saved this</h2>
      </div>
      <div className={s.dialogBody}>
        <p style={{ marginTop: 0 }}>
          {pending?.info.updatedBy && pending.info.updatedBy !== "original" ? (
            <strong>{pending.info.updatedBy}</strong>
          ) : (
            "Another person"
          )}{" "}
          saved changes to {DOC_NAMES[pending?.info.doc ?? ""] ?? "this section"}
          {when ? ` at ${when}` : ""} after you opened this page.
        </p>
        <p className={a.hint}>
          <strong>Load their version</strong> reloads the page so you can see their work (your unsaved
          edits here will be lost). <strong>Keep mine</strong> saves your version over theirs — their
          version stays in History, so it can be restored.
        </p>
      </div>
      <div className={s.dialogFoot}>
        <button type="button" className={a.secondaryBtn} onClick={() => choose("cancel")}>
          Cancel
        </button>
        <button type="button" className={a.secondaryBtn} onClick={() => choose("reload")}>
          Load their version
        </button>
        <button type="button" className={a.primaryBtn} onClick={() => choose("overwrite")}>
          Keep mine
        </button>
      </div>
    </dialog>
  );
}
