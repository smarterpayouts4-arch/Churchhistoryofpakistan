"use client";

import { useRef, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import s from "./studio.module.css";
import { adminFetch } from "./adminFetch";
import { toast } from "./toast";

type Revision = {
  id: string;
  at: string;
  by: string;
  version: string;
  summary: string;
  restoredFrom?: string;
};

function when(iso: string) {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} h ago`;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** "History" button + dialog: every saved version of one section, with Restore. */
export function HistoryButton({ doc, label }: { doc: string; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const slug = doc.replace(/\.json$/, "");

  async function open() {
    ref.current?.showModal();
    setRevisions(null);
    setPreview(null);
    const res = await adminFetch(`/api/admin/docs/${slug}/revisions`);
    const body = (await res.json().catch(() => ({}))) as { revisions?: Revision[]; currentVersion?: string };
    setRevisions(body.revisions ?? []);
    setCurrent(body.currentVersion ?? null);
  }

  async function show(id: string) {
    const res = await adminFetch(`/api/admin/docs/${slug}/revisions/${id}`);
    const body = (await res.json().catch(() => ({}))) as { data?: unknown };
    setPreview({ id, text: JSON.stringify(body.data, null, 2) });
  }

  async function restore(r: Revision) {
    // Photos/videos deleted since this version can't come back: say so first.
    const check = await adminFetch(`/api/admin/docs/${slug}/revisions/${r.id}`);
    const info = (await check.json().catch(() => ({}))) as { warning?: string | null; deleted?: { blocked?: boolean } };
    if (info.deleted?.blocked) return void toast.error(info.warning || "This version can't be restored.");
    const warning = info.warning ? `\n\n${info.warning} Everything else will be restored.` : "";
    if (!window.confirm(`Restore the version from ${when(r.at)}? The current version stays in History, so this can be undone.${warning}`)) return;
    setBusy(true);
    const res = await adminFetch(`/api/admin/docs/${slug}/revisions/${r.id}`, { method: "POST" });
    const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string | null };
    setBusy(false);
    if (res.ok) {
      if (body.message) toast.info(`${label}: ${body.message} Reloading…`);
      else toast.success(`${label}: earlier version restored. Reloading…`);
      window.setTimeout(() => window.location.reload(), body.message ? 3500 : 900);
    } else if (res.status !== 409) {
      toast.error(body.error || "Could not restore that version.");
    }
  }

  return (
    <>
      <button type="button" className={styles.secondaryBtn} onClick={open}>
        ↺ History
      </button>
      <dialog ref={ref} className={s.dialog} aria-labelledby={`hist-${slug}`}>
        <div className={s.dialogHead}>
          <h2 id={`hist-${slug}`}>History · {label}</h2>
          <button type="button" className={s.iconBtn} onClick={() => ref.current?.close()} aria-label="Close">
            ×
          </button>
        </div>
        <div className={s.dialogBody}>
          <p className={styles.hint} style={{ marginBottom: "1rem" }}>
            Every save is kept (the last 40). Restoring never deletes anything: it saves the older version as a
            new step.
          </p>
          {revisions === null ? (
            <p className={styles.hint}>Loading…</p>
          ) : revisions.length === 0 ? (
            <p className={styles.hint}>No saves yet. History starts with the first change you save.</p>
          ) : (
            <ol className={s.list}>
              {revisions.map((r, i) => {
                const isCurrent = i === revisions.findIndex((x) => x.version === current);
                const same = r.version === current;
                return (
                <li key={r.id} className={s.listRow}>
                  <div className={s.listMain}>
                    <strong>
                      {r.summary}
                      {isCurrent ? " · current" : same ? " · same as current" : ""}
                    </strong>
                    <small>
                      {when(r.at)} · {r.by === "original" ? "original content" : r.by}
                    </small>
                  </div>
                  <button type="button" className={s.smallBtn} onClick={() => show(r.id)}>
                    View
                  </button>
                  <button type="button" className={s.smallBtn} disabled={busy || same} onClick={() => restore(r)}>
                    Restore
                  </button>
                  {preview?.id === r.id ? <pre className={s.pre} style={{ width: "100%" }}>{preview.text}</pre> : null}
                </li>
                );
              })}
            </ol>
          )}
        </div>
      </dialog>
    </>
  );
}
