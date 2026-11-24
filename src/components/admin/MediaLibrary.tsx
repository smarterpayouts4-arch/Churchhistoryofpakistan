"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import styles from "@/app/admin/admin.module.css";
import s from "./studio.module.css";
import { adminFetch } from "./adminFetch";
import { invalidateLibrary, loadLibrary, type LibraryEntry, type LibraryState } from "./mediaStore";
import { checkFile, uploadMedia, withType } from "./upload";
import { HEVC_WARNING, isHevcVideo } from "./videoCodec";
import { toast } from "./toast";
import { Thumb } from "./Thumb";
import { CropTool } from "./CropTool";
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, PHOTO_ACCEPT, VIDEO_ACCEPT, formatBytes } from "@/lib/media/rules";

type Filter = "all" | "uploaded" | "site" | "unused";

type Props = {
  mode?: "manage" | "pick";
  kind?: "image" | "video";
  selectedUrl?: string;
  onPick?: (entry: LibraryEntry) => void;
};

type Progress = { name: string; fraction: number; error?: string };

/**
 * The photo & video library. Drag files in (or click to choose), watch them
 * upload, then pick, describe, crop or delete them. Used both as its own
 * admin page and inside the picker for every image/video field.
 */
export function MediaLibrary({ mode = "manage", kind, selectedUrl, onPick }: Props) {
  const [state, setState] = useState<LibraryState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [kindFilter, setKindFilter] = useState<"all" | "image" | "video">(kind ?? "all");
  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [selected, setSelected] = useState<string | undefined>(selectedUrl);
  const [detail, setDetail] = useState<LibraryEntry | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async (force = false) => {
    try {
      setState(await loadLibrary(force));
      setLoadError(null);
    } catch (e) {
      setLoadError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    // Initial load; the state update happens after the request resolves.
    void refresh();
    const onChange = () => void refresh(true);
    window.addEventListener("media-changed", onChange);
    return () => window.removeEventListener("media-changed", onChange);
  }, [refresh]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const entries = state?.entries ?? [];
    // In the picker, show the photo currently in use first so it is easy to find.
    const ordered =
      mode === "pick" && selectedUrl
        ? [...entries.filter((e) => e.url === selectedUrl), ...entries.filter((e) => e.url !== selectedUrl)]
        : entries;
    return ordered.filter((e) => {
      if (kindFilter !== "all" && e.kind !== kindFilter) return false;
      if (filter === "uploaded" && e.group !== "uploaded") return false;
      if (filter === "site" && e.group !== "site") return false;
      if (filter === "unused" && e.usedIn.length > 0) return false;
      if (q && !`${e.filename} ${e.alt} ${e.url}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [state, filter, kindFilter, query, mode, selectedUrl]);

  async function handleFiles(list: FileList | File[]) {
    const files = Array.from(list).map(withType);
    if (!files.length || !state) return;
    const accepted: File[] = [];
    for (const f of files) {
      const problem = checkFile(f);
      if (problem) toast.error(problem);
      else if (kind && !f.type.startsWith(kind)) toast.error(`${f.name}: please choose a ${kind === "image" ? "photo" : "video"} here.`);
      else accepted.push(f);
    }
    if (!accepted.length) return;
    for (const f of accepted) {
      // Allowed, but some browsers can't play HEVC: say so and carry on.
      if (f.type.startsWith("video/") && (await isHevcVideo(f))) {
        toast.info(HEVC_WARNING);
        break;
      }
    }
    setProgress((p) => [...p, ...accepted.map((f) => ({ name: f.name, fraction: 0 }))]);
    let lastUrl: string | undefined;
    let ok = 0;
    // Upload two at a time: quick, but kind to slow connections.
    const queue = [...accepted];
    async function worker() {
      while (queue.length) {
        const f = queue.shift()!;
        try {
          const item = await uploadMedia(f, state!.storage, {
            onProgress: (fraction) =>
              setProgress((p) => p.map((x) => (x.name === f.name ? { ...x, fraction } : x))),
          });
          ok += 1;
          lastUrl = item.url;
          setProgress((p) => p.filter((x) => x.name !== f.name));
        } catch (e) {
          setProgress((p) => p.map((x) => (x.name === f.name ? { ...x, error: (e as Error).message } : x)));
          toast.error((e as Error).message);
        }
      }
    }
    await Promise.all([worker(), worker()]);
    if (ok) {
      toast.success(ok === 1 ? "Uploaded 1 file to the library." : `Uploaded ${ok} files to the library.`);
      invalidateLibrary();
      await refresh(true);
      setFilter("all");
      if (mode === "pick" && lastUrl) setSelected(lastUrl);
    }
  }

  const selectedEntry = state?.entries.find((e) => e.url === selected);
  const accept =
    kind === "video" ? VIDEO_ACCEPT : kind === "image" ? PHOTO_ACCEPT : `${PHOTO_ACCEPT},${VIDEO_ACCEPT}`;

  const uploadsOff = state && !state.storage.blob && state.storage.hosted;

  return (
    <div>
      {uploadsOff ? (
        <div className={s.banner} role="note">
          <strong>Uploading is switched off on the live site</strong>
          Photo storage (Vercel Blob) is not connected yet. You can still choose photos that are already on the site.
        </div>
      ) : (
        <div
          className={dragOver ? s.dropzoneActive : s.dropzone}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${kind === "video" ? "videos" : kind === "image" ? "photos" : "photos or videos"}: drop files here or press Enter to choose`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
        >
          <span className={s.dropIcon} aria-hidden="true">
            <Icon name="upload" size={30} />
          </span>
          <strong>Drop {kind === "video" ? "videos" : kind === "image" ? "photos" : "photos or videos"} here</strong>
          <span className={styles.hint}>
            or click to choose from your computer or phone · photos up to {formatBytes(MAX_IMAGE_BYTES)}, videos up to{" "}
            {formatBytes(MAX_VIDEO_BYTES)}
          </span>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            hidden
            onChange={(e) => {
              if (e.target.files) void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {progress.length ? (
        <div className={s.progressList} aria-live="polite">
          {progress.map((p) => (
            <div key={p.name} className={s.progressRow}>
              <span>{p.name}</span>
              <span className={s.progressBar} role="progressbar" aria-label={`Uploading ${p.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p.fraction * 100)}>
                <i style={{ width: `${Math.round(p.fraction * 100)}%` }} />
              </span>
              <span>{p.error ? "Failed" : `${Math.round(p.fraction * 100)}%`}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className={s.toolbar}>
        <input
          type="search"
          className={styles.input}
          placeholder="Search by file name or description"
          aria-label="Search the library"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {!kind
          ? (["all", "image", "video"] as const).map((k) => (
              <button key={k} type="button" className={kindFilter === k ? s.chipActive : s.chip} aria-pressed={kindFilter === k} onClick={() => setKindFilter(k)}>
                {k === "all" ? "Everything" : k === "image" ? "Photos" : "Videos"}
              </button>
            ))
          : null}
        {(
          [
            ["all", "All"],
            ["uploaded", "Uploaded"],
            ["site", "Already on site"],
            ["unused", "Not used yet"],
          ] as const
        ).map(([f, label]) => (
          <button key={f} type="button" className={filter === f ? s.chipActive : s.chip} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {label}
          </button>
        ))}
      </div>

      {loadError ? (
        <p className={styles.error} role="alert">
          {loadError}
        </p>
      ) : !state ? (
        <p className={styles.hint}>Loading the library…</p>
      ) : visible.length === 0 ? (
        <p className={styles.hint}>Nothing matches. Try another search, or upload something new above.</p>
      ) : (
        <div className={s.mediaGrid} role="list">
          {visible.map((e) => (
            <div role="listitem" key={e.url}>
              <button
                type="button"
                className={selected === e.url ? s.mediaTileSelected : s.mediaTile}
                aria-pressed={mode === "pick" ? selected === e.url : undefined}
                onClick={() => (mode === "pick" ? setSelected(e.url) : setDetail(e))}
                onDoubleClick={() => mode === "pick" && onPick?.(e)}
                style={{ width: "100%" }}
              >
                <span className={s.mediaThumb}>
                  <Thumb src={e.url} kind={e.kind} alt="" />
                  {e.kind === "video" ? <span className={s.kindTag}>Video</span> : null}
                  {e.usedIn.length ? <span className={s.usedTag}>In use</span> : null}
                </span>
                <span className={s.mediaLabel}>
                  <strong title={e.filename}>{e.alt || e.filename}</strong>
                  <span>
                    {e.item ? `${formatBytes(e.item.bytes)}${e.item.width ? ` · ${e.item.width}×${e.item.height}` : ""}` : "On the site"}
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {mode === "pick" ? (
        <div className={s.dialogFoot} style={{ position: "sticky", bottom: 0, background: "var(--color-paper)", marginTop: "1rem" }}>
          <span className={styles.hint} style={{ marginRight: "auto" }}>
            {selectedEntry ? `Selected: ${selectedEntry.alt || selectedEntry.filename}` : "Click a photo to select it."}
          </span>
          <button type="button" className={styles.primaryBtn} disabled={!selectedEntry} onClick={() => selectedEntry && onPick?.(selectedEntry)}>
            Use this {kind === "video" ? "video" : "photo"}
          </button>
        </div>
      ) : null}

      {detail ? (
        <MediaDetail
          entry={detail}
          storage={state?.storage}
          onClose={() => setDetail(null)}
          onChanged={async () => {
            invalidateLibrary();
            await refresh(true);
          }}
        />
      ) : null}
    </div>
  );
}

function MediaDetail({
  entry,
  storage,
  onClose,
  onChanged,
}: {
  entry: LibraryEntry;
  storage?: LibraryState["storage"];
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [alt, setAlt] = useState(entry.alt);
  const [busy, setBusy] = useState(false);
  const [cropping, setCropping] = useState(false);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  async function saveAlt() {
    if (!entry.item) return;
    setBusy(true);
    const res = await adminFetch(`/api/admin/media/${entry.item.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ alt }),
    });
    setBusy(false);
    if (res.ok) {
      toast.success("Description saved.");
      await onChanged();
    } else toast.error("Could not save the description.");
  }

  async function remove() {
    if (!entry.item) return;
    if (!window.confirm(`Delete “${entry.filename}” permanently? This can't be undone.`)) return;
    setBusy(true);
    const res = await adminFetch(`/api/admin/media/${entry.item.id}`, { method: "DELETE" });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (res.ok) {
      toast.success("File deleted.");
      await onChanged();
      onClose();
    } else toast.error(body.error || "Could not delete the file.");
  }

  return (
    <dialog ref={ref} className={s.dialog} aria-labelledby="media-detail-title" onClose={onClose}>
      <div className={s.dialogHead}>
        <h3 id="media-detail-title">{entry.alt || entry.filename}</h3>
        <button type="button" className={s.iconBtn} onClick={() => ref.current?.close()} aria-label="Close">
          ×
        </button>
      </div>
      <div className={s.dialogBody}>
        {cropping && storage ? (
          <CropTool
            src={entry.url}
            filename={entry.filename}
            onCancel={() => setCropping(false)}
            onCropped={async (file) => {
              try {
                await uploadMedia(file, storage, { alt: entry.alt });
                toast.success("Cropped copy saved to the library.");
                setCropping(false);
                await onChanged();
              } catch (e) {
                toast.error((e as Error).message);
              }
            }}
          />
        ) : (
          <div className={s.detail}>
            <div className={s.detailPreview}>
              {entry.kind === "video" ? (
                <video src={entry.url} controls preload="metadata" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.url} alt={entry.alt} />
              )}
            </div>
            <div>
              <dl className={s.detailFacts}>
                <dt>File</dt>
                <dd>{entry.filename}</dd>
                {entry.item ? (
                  <>
                    <dt>Size</dt>
                    <dd>
                      {formatBytes(entry.item.bytes)}
                      {entry.item.width ? ` · ${entry.item.width} × ${entry.item.height} pixels` : ""}
                    </dd>
                    <dt>Uploaded</dt>
                    <dd>
                      {new Date(entry.item.uploadedAt).toLocaleString()} by {entry.item.uploadedBy}
                    </dd>
                  </>
                ) : null}
                <dt>Used on</dt>
                <dd>{entry.usedIn.length ? entry.usedIn.join(", ") : "Not used on any page yet"}</dd>
              </dl>
              {entry.item ? (
                <label className={styles.label} style={{ marginTop: "0.75rem" }}>
                  Description (who or what is shown)
                  <textarea className={styles.textarea} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Bishop J. S. Qadir Bakhsh at the Central Cathedral, 1975" />
                </label>
              ) : (
                <p className={styles.hint} style={{ marginTop: "0.75rem" }}>
                  This file ships with the website. Descriptions for it are written where it is used.
                </p>
              )}
              <div className={styles.rowActions} style={{ marginTop: "0.75rem" }}>
                {entry.item ? (
                  <button type="button" className={styles.primaryBtn} onClick={saveAlt} disabled={busy}>
                    Save description
                  </button>
                ) : null}
                {entry.kind === "image" && !entry.url.endsWith(".svg") && storage && !(storage.hosted && !storage.blob) ? (
                  <button type="button" className={styles.secondaryBtn} onClick={() => setCropping(true)}>
                    Crop a copy
                  </button>
                ) : null}
                <a className={styles.secondaryLink} href={entry.url} target="_blank" rel="noreferrer">
                  Open full size
                </a>
                {entry.item ? (
                  <button type="button" className={styles.dangerBtn} onClick={remove} disabled={busy || entry.usedIn.length > 0} title={entry.usedIn.length ? "Remove it from the pages that use it first" : undefined}>
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
