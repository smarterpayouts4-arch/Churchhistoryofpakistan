"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitStory, type ShareStoryState } from "./actions";
import styles from "../pages.module.css";

const initial: ShareStoryState = { ok: false, message: "" };

const FIELD_MAP: Record<string, { name: string; type: "text" | "email" | "textarea" | "file" | "checkbox" }> = {
  "Your name": { name: "contributor_name", type: "text" },
  // Older saved label (before the "Share Your Story" wording) still works.
  "Contributor name": { name: "contributor_name", type: "text" },
  "Private contact email": { name: "contact_email", type: "email" },
  "Person/place/event represented": { name: "subject", type: "text" },
  "Approximate date": { name: "approx_date", type: "text" },
  "Story/description": { name: "story", type: "textarea" },
  "Source/context": { name: "source_context", type: "textarea" },
  "Photo/document uploads": { name: "uploads", type: "file" },
  "Rights confirmation": { name: "rights_confirmation", type: "checkbox" },
  "Publication consent": { name: "publication_consent", type: "checkbox" },
  "Preferred public credit": { name: "public_credit", type: "text" },
};

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
const RESIZE_EDGE = 2000;

type Props = {
  contributionFields: string[];
  attachments: { enabled: boolean; maxFiles: number; maxTotalBytes: number };
};

function formatBytes(n: number) {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Photos are scaled down in the browser (longest side 2000 px, JPEG) so a
 * phone picture fits the upload limit. PDFs and already-small images are
 * sent unchanged.
 */
async function prepareFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 900 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, RESIZE_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

const STORY_MAX = 8000;

export function ShareStoryForm({ contributionFields, attachments }: Props) {
  const [state, action, pending] = useActionState(submitStory, initial);
  const [files, setFiles] = useState<File[]>([]);
  const [preparing, setPreparing] = useState(false);
  const [fileError, setFileError] = useState("");
  const [lengths, setLengths] = useState<Record<string, number>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // After a successful send, clear the chosen files (adjusting state during
  // render, per React guidance) and reset the text fields.
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.ok) {
      setFiles([]);
      setLengths({});
    }
  }
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  const total = files.reduce((n, f) => n + f.size, 0);

  async function onPick(list: FileList | null) {
    setFileError("");
    const picked = Array.from(list ?? []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!picked.length) return;
    const allowed = picked.filter((f) => ACCEPT.split(",").includes(f.type));
    if (allowed.length < picked.length) {
      setFileError("Some files were skipped: please choose JPEG, PNG or WebP photos, or PDF documents. (iPhone HEIC photos: share them as “Most Compatible” / JPEG.)");
    }
    setPreparing(true);
    const prepared = await Promise.all(allowed.map(prepareFile));
    setPreparing(false);
    const next = [...files, ...prepared].slice(0, attachments.maxFiles);
    if (files.length + prepared.length > attachments.maxFiles) {
      setFileError(`You can attach up to ${attachments.maxFiles} files.`);
    }
    setFiles(next);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (total > attachments.maxTotalBytes) {
      setFileError(`The files are ${formatBytes(total)} together; the limit is ${formatBytes(attachments.maxTotalBytes)}. Please remove one.`);
      return;
    }
    const fd = new FormData(e.currentTarget);
    fd.delete("uploads");
    for (const f of files) fd.append("uploads", f, f.name);
    startTransition(() => action(fd));
  }

  return (
    <form ref={formRef} className={styles.form} action={action} onSubmit={onSubmit}>
      {/* Spam trap: hidden from people and screen readers. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {contributionFields.map((label) => {
        const meta = FIELD_MAP[label] ?? {
          name: label.toLowerCase().replace(/\W+/g, "_"),
          type: "text" as const,
        };
        if (meta.type === "checkbox") {
          return (
            <div className={styles.field} key={label}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name={meta.name} required />
                <span>
                  {label} <span className={styles.requiredMark}>(required)</span>
                </span>
              </label>
            </div>
          );
        }
        if (meta.type === "textarea") {
          return (
            <div className={styles.field} key={label}>
              <label htmlFor={meta.name}>{label}</label>
              <textarea
                id={meta.name}
                name={meta.name}
                maxLength={STORY_MAX}
                aria-describedby={`${meta.name}-count`}
                onChange={(e) => {
                  const n = e.target.value.length;
                  setLengths((all) => ({ ...all, [meta.name]: n }));
                }}
              />
              <span id={`${meta.name}-count`} className={`${styles.meta} ${styles.counter}`}>
                {(lengths[meta.name] ?? 0).toLocaleString("en-GB")} / {STORY_MAX.toLocaleString("en-GB")} characters
              </span>
            </div>
          );
        }
        if (meta.type === "file") {
          if (!attachments.enabled) {
            return (
              <div className={styles.field} key={label}>
                <span className={styles.fieldLabel}>{label}</span>
                <span className={styles.meta}>
                  File uploads are not switched on yet. Describe your photos or documents above and the curator will contact you about sending them.
                </span>
              </div>
            );
          }
          return (
            <div className={styles.field} key={label}>
              <label htmlFor={meta.name}>{label}</label>
              <input
                ref={fileInputRef}
                id={meta.name}
                type="file"
                multiple
                accept={ACCEPT}
                aria-describedby={`${meta.name}-help`}
                onChange={(e) => void onPick(e.target.files)}
                disabled={preparing || files.length >= attachments.maxFiles}
              />
              <span id={`${meta.name}-help`} className={styles.meta}>
                Up to {attachments.maxFiles} photos or PDFs, {formatBytes(attachments.maxTotalBytes)} in total. Large photos are reduced automatically before sending.
              </span>
              {preparing ? <span className={styles.meta} role="status">Preparing photos…</span> : null}
              {files.length ? (
                <ul className={styles.fileList}>
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`}>
                      <span>{f.name}</span>
                      <span className={styles.meta}>{formatBytes(f.size)}</span>
                      <button
                        type="button"
                        className={styles.fileRemove}
                        onClick={() => setFiles((all) => all.filter((_, j) => j !== i))}
                      >
                        Remove<span className="sr-only"> {f.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {fileError ? <span className={styles.fileError} role="alert">{fileError}</span> : null}
            </div>
          );
        }
        return (
          <div className={styles.field} key={label}>
            <label htmlFor={meta.name}>{label}</label>
            <input
              id={meta.name}
              name={meta.name}
              type={meta.type}
              maxLength={meta.type === "email" ? 200 : 300}
              autoComplete={meta.type === "email" ? "email" : meta.name === "contributor_name" ? "name" : undefined}
            />
          </div>
        );
      })}

      <button className={`btn-primary ${styles.submit}`} type="submit" disabled={pending || preparing}>
        {pending ? "Sending…" : "Share my story"}
      </button>

      {state.message ? (
        <p
          className={`${styles.notice} ${state.ok ? styles.noticeOk : styles.noticeError}`}
          role="status"
          aria-live="polite"
        >
          <strong>{state.ok ? "Received" : "Not submitted"}.</strong> {state.message}
        </p>
      ) : null}
    </form>
  );
}
