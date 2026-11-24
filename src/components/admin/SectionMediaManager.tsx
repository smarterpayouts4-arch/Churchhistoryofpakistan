"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { photoKey } from "@/lib/media/dedupe";
import { Icon } from "./Icon";
import { Thumb } from "./Thumb";
import { adminFetch } from "./adminFetch";
import { invalidateLibrary } from "./mediaStore";
import { checkFile, uploadMedia, UploadStoppedError, type StorageInfo } from "./upload";
import { toast } from "./toast";
import {
  SECTIONS,
  fullMessage,
  type SectionConfig,
  type SectionDraft,
  type SectionId,
  type SectionItem,
  type SectionState,
  type SectionsSnapshot,
} from "@/lib/sections/config";
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, formatBytes } from "@/lib/media/rules";
import x from "./sections.module.css";

type Storage = SectionsSnapshot["storage"];

type Progress = { key: string; name: string; fraction: number; error?: string; retry?: boolean };

const PUBLISHED_FLAG = "hcop-just-published";
/** The section being edited, kept across the reload that Publish does. */
const ACTIVE_SECTION_KEY = "hcop-active-section";

const itemsOf = (s: SectionState) => s.draft?.items ?? s.live;

function newId(name: string) {
  const stem =
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "item";
  return `${stem}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** "IMG_2041 church choir.jpg" → "Church choir" (a starting title the owner can change). */
function titleFromFilename(name: string) {
  const words = name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b(img|dsc|pxl|vid|mov)\s*\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return words ? words[0]!.toUpperCase() + words.slice(1) : "";
}

function ago(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/**
 * The owner's main admin page: every photo & video section, with upload,
 * replace, delete, reorder and descriptions. Changes are kept as a draft
 * (saved automatically) and go on the website only when Publish is pressed.
 */
export function SectionMediaManager({
  initial,
  storageInfo,
}: {
  initial: SectionsSnapshot;
  storageInfo: StorageInfo;
}) {
  const [sections, setSections] = useState<SectionState[]>(initial.sections);
  const [storage, setStorage] = useState<Storage>(initial.storage);
  const [active, setActive] = useState<SectionId>("hero");
  const [progress, setProgress] = useState<Progress[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [publishing, setPublishing] = useState(false);
  const [justPublished, setJustPublished] = useState(false);
  const [confirm, setConfirm] = useState<null | { title: string; body: string; action: string; run: () => void }>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Draft revision per section (what the server has) and a save queue.
  const revs = useRef<Record<string, number>>(
    Object.fromEntries(initial.sections.map((s) => [s.id, s.draft?.rev ?? 0])),
  );
  const queued = useRef<Partial<Record<SectionId, SectionItem[]>>>({});
  const running = useRef<Partial<Record<SectionId, boolean>>>({});
  const textTimers = useRef<Partial<Record<SectionId, number>>>({});
  // Uploads in flight (Cancel) and failed ones (Try again), by progress row.
  const uploadCtrls = useRef<Record<string, AbortController>>({});
  const retries = useRef<Record<string, () => void>>({});

  useEffect(() => {
    if (sessionStorage.getItem(PUBLISHED_FLAG)) {
      sessionStorage.removeItem(PUBLISHED_FLAG);
      setJustPublished(true);
    }
    // Come back to the section that was open (e.g. after Publish reloads the page).
    const saved = sessionStorage.getItem(ACTIVE_SECTION_KEY);
    if (saved && SECTIONS.some((c) => c.id === saved)) setActive(saved as SectionId);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(ACTIVE_SECTION_KEY, active);
  }, [active]);

  const dirty = sections.filter((s) => s.draft);
  const busyUploading = progress.some((p) => !p.error && p.fraction < 1);

  const flush = useCallback(async (id: SectionId) => {
    if (running.current[id]) return;
    running.current[id] = true;
    setSaveState("saving");
    try {
      while (queued.current[id]) {
        const items = queued.current[id]!;
        delete queued.current[id];
        const res = await adminFetch(`/api/admin/sections/${id}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ items, rev: revs.current[id] ?? 0 }),
        });
        const body = (await res.json().catch(() => ({}))) as { draft?: SectionDraft | null; error?: string; conflict?: boolean };
        if (!res.ok) {
          setSaveState("error");
          if (body.conflict) {
            toast.error(body.error ?? "Someone else changed this section.", {
              action: { label: "Reload", onClick: () => window.location.reload() },
            });
          } else {
            toast.error(body.error ?? "Could not save your change. Please try again.");
          }
          // Show the server's last good state again.
          const fresh = await adminFetch("/api/admin/sections");
          if (fresh.ok) {
            const snap = (await fresh.json()) as SectionsSnapshot;
            snap.sections.forEach((s) => (revs.current[s.id] = s.draft?.rev ?? 0));
            setSections(snap.sections);
            setStorage(snap.storage);
          }
          delete queued.current[id];
          return;
        }
        revs.current[id] = body.draft?.rev ?? 0;
        if (!queued.current[id]) {
          setSections((all) => all.map((s) => (s.id === id ? { ...s, draft: body.draft ?? null } : s)));
        }
      }
      setSaveState("saved");
    } finally {
      running.current[id] = false;
    }
  }, []);

  /** Change a section's list (shown at once; saved as a draft in the background). */
  const update = useCallback(
    (id: SectionId, next: SectionItem[], opts: { debounce?: boolean } = {}) => {
      setSections((all) =>
        all.map((s) =>
          s.id === id
            ? {
                ...s,
                draft: {
                  items: next,
                  baseIds: s.draft?.baseIds ?? s.live.map((i) => i.id),
                  rev: s.draft?.rev ?? 0,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "you",
                },
              }
            : s,
        ),
      );
      setJustPublished(false);
      queued.current[id] = next;
      window.clearTimeout(textTimers.current[id]);
      if (opts.debounce) {
        setSaveState("saving");
        textTimers.current[id] = window.setTimeout(() => void flush(id), 700);
      } else {
        void flush(id);
      }
    },
    [flush],
  );

  async function refreshStorage() {
    const res = await adminFetch("/api/admin/sections");
    if (res.ok) setStorage(((await res.json()) as SectionsSnapshot).storage);
  }

  const section = sections.find((s) => s.id === active)!;
  const cfg = SECTIONS.find((c) => c.id === active)!;
  const items = itemsOf(section);
  // Latest list, for uploads that finish one after another.
  const latest = useRef(items);
  latest.current = items;

  async function addFiles(list: FileList | File[]) {
    setNotice(null);
    const files = Array.from(list);
    const wrongKind = files.filter((f) => !f.type.startsWith(cfg.kind === "video" ? "video/" : "image/") && !/\.hei[cf]$/i.test(f.name));
    if (wrongKind.length) {
      toast.error(cfg.kind === "video" ? "This section only takes videos (MP4, WebM or MOV)." : "This section only takes photos.");
    }
    const usable = files.filter((f) => !wrongKind.includes(f));
    const inFlight = progress.filter((p) => !p.error && p.fraction < 1).length;
    const room = Math.max(0, cfg.max - items.length - inFlight);
    if (usable.length > room) {
      setNotice(
        room === 0
          ? fullMessage(cfg, items.length)
          : `Only ${room} more ${cfg.kind === "video" ? (room === 1 ? "video fits" : "videos fit") : room === 1 ? "photo fits" : "photos fit"} in ${cfg.label} (limit ${cfg.max}). The first ${room} will be added.`,
      );
    }
    for (const file of usable.slice(0, room)) {
      const problem = checkFile(file);
      const key = `${file.name}-${Math.random()}`;
      if (problem) {
        setProgress((p) => [...p, { key, name: file.name, fraction: 1, error: problem }]);
        continue;
      }
      setProgress((p) => [...p, { key, name: file.name, fraction: 0 }]);
      const ctrl = new AbortController();
      uploadCtrls.current[key] = ctrl;
      try {
        const media = await uploadMedia(file, storageInfo, {
          target: { section: cfg.id },
          signal: ctrl.signal,
          onProgress: (f) => setProgress((p) => p.map((r) => (r.key === key ? { ...r, fraction: f } : r))),
        });
        const item: SectionItem = {
          id: newId(file.name),
          src: media.url,
          alt: "",
          ...(cfg.titled ? { title: titleFromFilename(file.name) } : {}),
          ...(cfg.kind === "video"
            ? {
                posterSrc: media.posterUrl,
                width: media.width,
                height: media.height,
                durationSeconds: media.duration ? Math.round(media.duration) : undefined,
              }
            : {}),
        };
        // Newest first: a new upload goes to the front of the section.
        const next = [item, ...latest.current];
        latest.current = next;
        update(cfg.id, next);
        setProgress((p) => p.filter((r) => r.key !== key));
      } catch (err) {
        if (err instanceof UploadStoppedError && err.reason === "cancelled") {
          setProgress((p) => p.filter((r) => r.key !== key));
        } else {
          retries.current[key] = () => void addFiles([file]);
          setProgress((p) => p.map((r) => (r.key === key ? { ...r, fraction: 1, error: (err as Error).message, retry: true } : r)));
        }
      } finally {
        delete uploadCtrls.current[key];
      }
    }
    invalidateLibrary();
    void refreshStorage();
  }

  async function replaceFile(index: number, file: File) {
    const problem = checkFile(file);
    if (problem) return void toast.error(problem);
    if (!file.type.startsWith(cfg.kind === "video" ? "video/" : "image/")) {
      return void toast.error(cfg.kind === "video" ? "Please choose a video." : "Please choose a photo.");
    }
    const key = `replace-${Math.random()}`;
    const itemId = latest.current[index]?.id;
    setProgress((p) => [...p, { key, name: `Replacing with ${file.name}`, fraction: 0 }]);
    const ctrl = new AbortController();
    uploadCtrls.current[key] = ctrl;
    try {
      const media = await uploadMedia(file, storageInfo, {
        target: { section: cfg.id, replace: true },
        signal: ctrl.signal,
        onProgress: (f) => setProgress((p) => p.map((r) => (r.key === key ? { ...r, fraction: f } : r))),
      });
      const next = latest.current.map((it) => {
        if (it.id !== itemId) return it;
        // Same place, title and description; new file (and framing back to centre).
        const { position: _drop, ...rest } = it;
        void _drop;
        return {
          ...rest,
          src: media.url,
          ...(cfg.kind === "video"
            ? {
                posterSrc: media.posterUrl,
                width: media.width,
                height: media.height,
                durationSeconds: media.duration ? Math.round(media.duration) : undefined,
              }
            : {}),
        };
      });
      update(cfg.id, next);
      setProgress((p) => p.filter((r) => r.key !== key));
      toast.success("Replaced. Press Publish to put it on the website.");
    } catch (err) {
      if (err instanceof UploadStoppedError && err.reason === "cancelled") {
        setProgress((p) => p.filter((r) => r.key !== key));
      } else {
        retries.current[key] = () => {
          const at = latest.current.findIndex((it) => it.id === itemId);
          if (at < 0) return void toast.error("That photo is no longer in this section.");
          void replaceFile(at, file);
        };
        setProgress((p) => p.map((r) => (r.key === key ? { ...r, fraction: 1, error: (err as Error).message, retry: true } : r)));
      }
    } finally {
      delete uploadCtrls.current[key];
    }
    invalidateLibrary();
    void refreshStorage();
  }

  function removeAt(index: number) {
    const it = items[index]!;
    const noun = cfg.kind === "video" ? "video" : "photo";
    setConfirm({
      title: `Delete this ${noun}?`,
      body: `${it.title || it.alt ? `“${it.title || it.alt}”` : `${noun === "video" ? "Video" : "Photo"} ${index + 1}`} will be taken off ${cfg.label} when you press Publish. Until then you can bring it back with Discard.`,
      action: `Delete ${noun}`,
      run: () => {
        update(cfg.id, items.filter((_, i) => i !== index));
        setNotice(null);
      },
    });
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it!);
    update(cfg.id, next);
  }

  function edit(index: number, patch: Partial<SectionItem>) {
    update(
      cfg.id,
      items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
      { debounce: true },
    );
  }

  async function publish() {
    if (busyUploading) return void toast.info("Please wait for the uploads to finish.");
    setPublishing(true);
    // Make sure the last typed change is saved first.
    for (const s of SECTIONS) {
      window.clearTimeout(textTimers.current[s.id]);
      if (queued.current[s.id]) await flush(s.id);
    }
    const res = await adminFetch("/api/admin/sections/publish", { method: "POST" });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setPublishing(false);
      return void toast.error(body.error ?? "Could not publish. Nothing on the website was changed.");
    }
    // Reload so every admin page shows the new live content.
    sessionStorage.setItem(PUBLISHED_FLAG, "1");
    window.location.hash = "photos";
    window.location.reload();
  }

  function discardAll() {
    setConfirm({
      title: "Discard all unpublished changes?",
      body: "Every section goes back to what is on the website now. New uploads that were never published are deleted.",
      action: "Discard changes",
      run: async () => {
        const res = await adminFetch("/api/admin/sections", { method: "DELETE" });
        if (!res.ok) return void toast.error("Could not discard the changes.");
        const snap = (await res.json()) as SectionsSnapshot;
        snap.sections.forEach((s) => (revs.current[s.id] = s.draft?.rev ?? 0));
        setSections(snap.sections);
        setStorage(snap.storage);
        setNotice(null);
        setJustPublished(false);
        toast.success("Changes discarded. The website was not changed.");
      },
    });
  }

  const noun = cfg.kind === "video" ? "videos" : "photos";
  const full = items.length >= cfg.max;
  const over = items.length > cfg.max;
  // Tiles showing the same picture as an earlier tile (the website shows it once).
  const sameAs: (number | undefined)[] = [];
  {
    const firstAt = new Map<string, number>();
    items.forEach((it, i) => {
      const k = photoKey(it.src);
      if (k && firstAt.has(k)) sameAs[i] = firstAt.get(k)! + 1;
      else if (k) firstAt.set(k, i);
    });
  }
  const liveIds = new Set(section.live.map((i) => i.id));
  const liveSrc = new Map(section.live.map((i) => [i.id, i.src]));
  const usedPct = Math.min(100, Math.round((storage.usedBytes / storage.budgetBytes) * 100));

  return (
    <section aria-labelledby="photos-heading" className={x.wrap}>
      <div className={x.head}>
        <h2 id="photos-heading" className={x.title}>
          Photos &amp; videos
        </h2>
        <p className={x.lede}>
          Pick a section, then add, replace, delete or reorder. Your changes are saved as you go, and the website
          only changes when you press <strong>Publish</strong>.
        </p>
      </div>

      {/* Publish bar: always visible, so it's clear whether the website is up to date. */}
      <div className={dirty.length ? x.publishBarDirty : x.publishBar} role="status" aria-live="polite">
        <div className={x.publishText}>
          {dirty.length ? (
            <>
              <strong>
                <span className={x.dotDirty} aria-hidden="true" /> You have unpublished changes
              </strong>
              <span>
                In {dirty.map((s) => SECTIONS.find((c) => c.id === s.id)!.label).join(", ")}.{" "}
                {saveState === "saving" ? "Saving draft…" : saveState === "error" ? "Last change not saved." : "Draft saved."}{" "}
                Visitors still see the old version.
              </span>
            </>
          ) : justPublished ? (
            <>
              <strong>
                <span className={x.dotLive} aria-hidden="true" /> Published. Your changes are live on the website.
              </strong>
              <span>
                <a href="/" target="_blank" rel="noopener">
                  View the website ↗
                </a>
              </span>
            </>
          ) : (
            <>
              <strong>
                <span className={x.dotLive} aria-hidden="true" /> Everything is published
              </strong>
              <span>The website shows exactly what you see here.</span>
            </>
          )}
        </div>
        <div className={x.publishActions}>
          {dirty.length ? (
            <button type="button" className={x.ghostBtn} onClick={discardAll} disabled={publishing}>
              Discard<span className={x.wide}>&nbsp;changes</span>
            </button>
          ) : null}
          <button
            type="button"
            className={x.publishBtn}
            onClick={publish}
            disabled={!dirty.length || publishing || busyUploading}
          >
            <Icon name="globe" size={18} /> {publishing ? "Publishing…" : "Publish to website"}
          </button>
        </div>
      </div>

      <nav className={x.sectionTabs} aria-label="Sections">
        {SECTIONS.map((c) => {
          const s = sections.find((t) => t.id === c.id)!;
          const n = itemsOf(s).length;
          return (
            <button
              key={c.id}
              type="button"
              className={c.id === active ? x.tabActive : x.tab}
              aria-pressed={c.id === active}
              onClick={() => {
                setActive(c.id);
                setNotice(null);
              }}
            >
              <span className={x.tabIcon} aria-hidden="true">
                <Icon name={c.kind === "video" ? "video" : c.id === "hero" ? "home" : c.id === "people" ? "people" : "archive"} />
              </span>
              <span className={x.tabText}>
                <strong>{c.label}</strong>
                <small>
                  {n > c.max
                    ? `${n} ${c.kind === "video" ? "videos" : "photos"} · limit ${c.max}`
                    : `${n} of ${c.max} ${c.kind === "video" ? "videos" : "photos"}`}
                </small>
              </span>
              {s.draft ? <span className={x.tabDirty}>Unpublished</span> : null}
            </button>
          );
        })}
      </nav>

      <div className={x.panel}>
        <div className={x.panelHead}>
          <div>
            <h3 className={x.panelTitle}>{cfg.label}</h3>
            <p className={x.where}>
              {cfg.where}{" "}
              <a href={cfg.href} target="_blank" rel="noopener">
                See it on the website ↗
              </a>
            </p>
          </div>
          <div className={x.count} aria-label={over ? `${items.length} ${noun}, limit ${cfg.max}` : `${items.length} of ${cfg.max} ${noun}`}>
            <strong>
              {over ? items.length : `${items.length} of ${cfg.max}`}
            </strong>{" "}
            {noun}
            <span>{over ? `Over the limit of ${cfg.max}` : full ? "Full" : `${cfg.max - items.length} ${cfg.max - items.length === 1 ? "space" : "spaces"} left`}</span>
          </div>
        </div>

        <div className={x.meterRow}>
          <div
            className={x.meter}
            role="meter"
            aria-label="Storage used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={usedPct}
          >
            <span style={{ width: `${Math.max(usedPct, 1)}%` }} className={usedPct > 85 ? x.meterHigh : undefined} />
          </div>
          <small>
            Storage: {formatBytes(storage.usedBytes)} of {formatBytes(storage.budgetBytes)} used · photos up to{" "}
            {formatBytes(MAX_IMAGE_BYTES)}, videos up to {formatBytes(MAX_VIDEO_BYTES)} each
          </small>
        </div>

        {full ? (
          <div className={x.fullNote} role="status">
            <Icon name="info" size={20} />
            <span>
              {over ? (
                <>
                  {cfg.label} has {items.length} {noun}, more than the limit of {cfg.max}. Everything stays on the website,
                  but delete {items.length - cfg.max + 1} to add a new one.
                </>
              ) : (
                fullMessage(cfg)
              )}
            </span>
          </div>
        ) : (
          <DropZone cfg={cfg} onFiles={addFiles} />
        )}
        {notice && !full ? (
          <div className={x.fullNote} role="status">
            <Icon name="info" size={20} />
            <span>{notice}</span>
          </div>
        ) : null}

        {progress.length ? (
          <ul className={x.progressList} aria-label="Uploads">
            {progress.map((p) => (
              <li key={p.key} className={p.error ? x.progressError : x.progressRow}>
                <span className={x.progressName}>{p.name}</span>
                {p.error ? (
                  <>
                    <span className={x.progressMsg} role="alert">{p.error}</span>
                    {p.retry ? (
                      <button
                        type="button"
                        className={x.retryBtn}
                        onClick={() => {
                          const again = retries.current[p.key];
                          delete retries.current[p.key];
                          setProgress((all) => all.filter((r) => r.key !== p.key));
                          again?.();
                        }}
                      >
                        Try again
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={x.linkBtn}
                      onClick={() => {
                        delete retries.current[p.key];
                        setProgress((all) => all.filter((r) => r.key !== p.key));
                      }}
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <>
                    <span className={x.progressBar} aria-label={`${Math.round(p.fraction * 100)}% uploaded`}>
                      <span style={{ width: `${Math.round(p.fraction * 100)}%` }} />
                    </span>
                    <button type="button" className={x.linkBtn} onClick={() => uploadCtrls.current[p.key]?.abort()}>
                      Cancel
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        {items.length ? (
          <p className={x.hint}>
            {cfg.kind === "image"
              ? "Drag a photo (or use the arrows) to change the order. Tap a photo on the most important spot, such as a face, to keep it in view."
              : "Drag a video (or use the arrows) to change the order. The first video shows first on the website."}
          </p>
        ) : (
          <p className={x.empty}>No {noun} in this section yet.</p>
        )}

        <ol className={x.grid}>
          {items.map((it, i) => (
            <Tile
              key={it.id}
              cfg={cfg}
              item={it}
              index={i}
              count={items.length}
              status={!liveIds.has(it.id) ? "new" : liveSrc.get(it.id) !== it.src ? "replaced" : null}
              sameAs={sameAs[i]}
              onMove={move}
              onEdit={(patch) => edit(i, patch)}
              onReplace={(f) => replaceFile(i, f)}
              onDelete={() => removeAt(i)}
            />
          ))}
        </ol>

        {section.draft ? (
          <p className={x.draftMeta}>
            Draft saved {ago(section.draft.updatedAt)}.{" "}
            <button
              type="button"
              className={x.linkBtn}
              onClick={() =>
                setConfirm({
                  title: `Undo the changes to ${cfg.label}?`,
                  body: "This section goes back to what is on the website now.",
                  action: "Undo changes",
                  run: async () => {
                    const res = await adminFetch(`/api/admin/sections/${cfg.id}`, { method: "DELETE" });
                    if (!res.ok) return void toast.error("Could not undo the changes.");
                    const snap = (await res.json()) as SectionsSnapshot;
                    snap.sections.forEach((s) => (revs.current[s.id] = s.draft?.rev ?? 0));
                    setSections(snap.sections);
                    setStorage(snap.storage);
                    setNotice(null);
                  },
                })
              }
            >
              Undo changes to this section
            </button>
          </p>
        ) : null}
      </div>

      {confirm ? (
        <ConfirmDialog
          {...confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            const run = confirm.run;
            setConfirm(null);
            run();
          }}
        />
      ) : null}
    </section>
  );
}

function DropZone({ cfg, onFiles }: { cfg: SectionConfig; onFiles: (f: FileList) => void }) {
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const noun = cfg.kind === "video" ? "videos" : "photos";
  return (
    <div
      className={over ? x.dropActive : x.drop}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!e.dataTransfer.files.length) return;
        e.preventDefault();
        setOver(false);
        onFiles(e.dataTransfer.files);
      }}
    >
      <span className={x.dropIcon} aria-hidden="true">
        <Icon name="upload" size={28} />
      </span>
      <span className={x.dropText}>
        <strong>Drag {noun} here</strong>
        <span>or</span>
      </span>
      <button type="button" className={x.addBtn} onClick={() => input.current?.click()}>
        + Add {noun}
      </button>
      <input
        ref={input}
        type="file"
        hidden
        multiple
        accept={cfg.kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif,image/avif"}
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Tile({
  cfg,
  item,
  index,
  count,
  status,
  sameAs,
  onMove,
  onEdit,
  onReplace,
  onDelete,
}: {
  cfg: SectionConfig;
  item: SectionItem;
  index: number;
  count: number;
  /** 1-based number of an earlier tile with the same picture (shown once on the website). */
  sameAs?: number;
  status: "new" | "replaced" | null;
  onMove: (from: number, to: number) => void;
  onEdit: (patch: Partial<SectionItem>) => void;
  onReplace: (f: File) => void;
  onDelete: () => void;
}) {
  const replaceInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const video = cfg.kind === "video";
  const name = item.title || item.alt || `${video ? "Video" : "Photo"} ${index + 1}`;
  const mins = item.durationSeconds ? `${Math.floor(item.durationSeconds / 60)}:${String(Math.round(item.durationSeconds % 60)).padStart(2, "0")}` : null;

  return (
    <li
      className={dragOver ? x.tileOver : x.tile}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/x-section-index", String(index));
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("text/x-section-index")) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        const from = Number(e.dataTransfer.getData("text/x-section-index"));
        setDragOver(false);
        if (Number.isFinite(from)) {
          e.preventDefault();
          onMove(from, index);
        }
      }}
    >
      <div className={video ? x.thumbVideo : x.thumb}>
        {video ? (
          item.posterSrc ? (
            <Thumb src={item.posterSrc} alt="" sizes="(max-width: 700px) 92vw, 320px" />
          ) : (
            <Thumb src={item.src} kind="video" alt={name} />
          )
        ) : (
          // Tap/click the photo on its most important spot (a mouse/touch extra; the
          // tile works without it).
          <span
            className={x.focusBtn}
            title="Tap the most important spot to keep it in view"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const px = Math.round(((e.clientX - r.left) / r.width) * 100);
              const py = Math.round(((e.clientY - r.top) / r.height) * 100);
              onEdit({ position: `${Math.min(100, Math.max(0, px))}% ${Math.min(100, Math.max(0, py))}%` });
            }}
          >
            <Thumb src={item.src} alt={name} sizes="(max-width: 700px) 92vw, 320px" position={item.position} />
            {item.position ? (
              <span
                className={x.focusDot}
                aria-hidden="true"
                style={{ left: item.position.split(" ")[0], top: item.position.split(" ")[1] }}
              />
            ) : null}
          </span>
        )}
        <span className={x.number} aria-hidden="true">
          {index + 1}
        </span>
        {status ? <span className={x.status}>{status === "new" ? "New" : "Replaced"}</span> : null}
        {video && mins ? <span className={x.duration}>{mins}</span> : null}
        <span className={x.grip} aria-hidden="true" title="Drag to reorder">
          <Icon name="grip" size={18} />
        </span>
      </div>

      {sameAs ? (
        <p className={x.sameNote}>
          Same picture as photo {sameAs}, so the website shows it only once. You can delete one of them.
        </p>
      ) : null}

      <div className={x.fields}>
        {cfg.titled ? (
          <label className={x.label}>
            <span>
              Title <small>(shown on the website)</small>
            </span>
            <input
              className={x.input}
              value={item.title ?? ""}
              maxLength={300}
              onChange={(e) => onEdit({ title: e.target.value })}
            />
          </label>
        ) : null}
        <label className={x.label}>
          <span>
            {cfg.titled ? "Description" : "Caption"} <small>(what or who is shown)</small>
          </span>
          <textarea
            className={x.textarea}
            rows={2}
            value={item.alt}
            maxLength={1000}
            placeholder={video ? "e.g. Youth programme at St John's, 2024" : "e.g. Bishop Young outside the cathedral, 1975"}
            onChange={(e) => onEdit({ alt: e.target.value })}
          />
        </label>
      </div>

      <div className={x.actions}>
        <button type="button" className={x.moveBtn} onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label={`Move ${name} earlier`}>
          <span aria-hidden="true" className={x.arrowSide}>←</span>
          <span aria-hidden="true" className={x.arrowUp}>↑</span>
          <span aria-hidden="true">Earlier</span>
        </button>
        <button type="button" className={x.moveBtn} onClick={() => onMove(index, index + 1)} disabled={index === count - 1} aria-label={`Move ${name} later`}>
          <span aria-hidden="true">Later</span>
          <span aria-hidden="true" className={x.arrowSide}>→</span>
          <span aria-hidden="true" className={x.arrowUp}>↓</span>
        </button>
        <span className={x.spacer} />
        <button type="button" className={x.actionBtn} onClick={() => replaceInput.current?.click()}>
          Replace
        </button>
        <button type="button" className={x.deleteBtn} onClick={onDelete}>
          Delete
        </button>
        <input
          ref={replaceInput}
          type="file"
          hidden
          accept={video ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif,image/avif"}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onReplace(f);
            e.target.value = "";
          }}
        />
      </div>
    </li>
  );
}

function ConfirmDialog({
  title,
  body,
  action,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  action: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog ref={ref} className={x.dialog} onCancel={onCancel} aria-labelledby="confirm-title">
      <h3 id="confirm-title">{title}</h3>
      <p>{body}</p>
      <div className={x.dialogActions}>
        <button type="button" className={x.ghostBtn} onClick={onCancel} autoFocus>
          Cancel
        </button>
        <button type="button" className={x.deleteBtnSolid} onClick={onConfirm}>
          {action}
        </button>
      </div>
    </dialog>
  );
}
