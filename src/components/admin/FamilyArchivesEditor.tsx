"use client";

import { FormEvent, useMemo, useState } from "react";
import type { FamilyArchiveItem } from "@/lib/cms/types";
import styles from "@/app/admin/admin.module.css";

type ArchiveFormState = {
  id: string;
  title: string;
  caption: string;
  imageSrc: string;
  alt: string;
  sourceLabel: string;
  sourceUrl: string;
  dateLabel: string;
  verificationStatus: "facebook-caption" | "needs-verification";
  contextNote: string;
  referencesJson: string;
};

const emptyArchiveForm: ArchiveFormState = {
  id: "",
  title: "",
  caption: "",
  imageSrc: "",
  alt: "",
  sourceLabel: "Facebook page History: Church of Pakistan",
  sourceUrl: "",
  dateLabel: "",
  verificationStatus: "needs-verification",
  contextNote: "",
  referencesJson: "",
};

type Props = {
  initialArchives: FamilyArchiveItem[];
  archiveNote: string;
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
  incomingImage?: { path: string; nonce: number } | null;
};

export function FamilyArchivesEditor({
  initialArchives,
  archiveNote,
  pending,
  setPending,
  setMessage,
  setError,
  incomingImage,
}: Props) {
  const [archives, setArchives] = useState(initialArchives);
  const [note, setNote] = useState(archiveNote);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyArchiveForm });
  const [seenImageNonce, setSeenImageNonce] = useState(0);

  if (incomingImage && incomingImage.nonce !== seenImageNonce) {
    setSeenImageNonce(incomingImage.nonce);
    setForm((current) => ({ ...current, imageSrc: incomingImage.path }));
  }

  const editingLabel = useMemo(
    () => (editingId ? `Editing ${editingId}` : "Add new Family Archive item"),
    [editingId],
  );

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyArchiveForm });
  }

  function startEdit(item: FamilyArchiveItem) {
    setEditingId(item.id);
    setForm({
      id: item.id,
      title: item.title,
      caption: item.caption,
      imageSrc: item.imageSrc,
      alt: item.alt,
      sourceLabel: item.sourceLabel,
      sourceUrl: item.sourceUrl || "",
      dateLabel: item.dateLabel || "",
      verificationStatus: item.verificationStatus,
      contextNote: item.contextNote || "",
      referencesJson: item.references?.length
        ? JSON.stringify(item.references, null, 2)
        : "",
    });
    setMessage(null);
    setError(null);
  }

  async function saveArchive(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      let references: FamilyArchiveItem["references"] | undefined;
      let includeReferences = true;
      const refsRaw = form.referencesJson.trim();
      if (!refsRaw && editingId) {
        includeReferences = false;
      } else if (refsRaw) {
        try {
          const parsed = JSON.parse(refsRaw) as unknown;
          if (!Array.isArray(parsed)) {
            setError("References must be a JSON array of { label, url, note? }.");
            return;
          }
          references = parsed as FamilyArchiveItem["references"];
        } catch {
          setError("References JSON is invalid.");
          return;
        }
      }
      const payload = {
        id: form.id || undefined,
        title: form.title,
        caption: form.caption,
        imageSrc: form.imageSrc,
        alt: form.alt,
        provenance: "Family Archive" as const,
        sourceLabel: form.sourceLabel,
        sourceUrl: form.sourceUrl,
        dateLabel: form.dateLabel,
        verificationStatus: form.verificationStatus,
        contextNote: form.contextNote.trim() || undefined,
        ...(includeReferences ? { references: references ?? [] } : {}),
      };
      const url = editingId
        ? `/api/admin/family-archives/${encodeURIComponent(editingId)}`
        : "/api/admin/family-archives";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        item?: FamilyArchiveItem;
      };
      if (!res.ok || !data.item) {
        setError(data.error || "Save failed.");
        return;
      }
      setArchives((prev) => {
        if (editingId) {
          return prev.map((i) => (i.id === editingId ? data.item! : i));
        }
        return [data.item!, ...prev];
      });
      setMessage(editingId ? "Item updated." : "Item created.");
      resetForm();
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  async function saveNote() {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/family-archives", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        note?: string;
      };
      if (!res.ok || !data.note) {
        setError(data.error || "Note save failed.");
        return;
      }
      setNote(data.note);
      setMessage("Family Archive note saved.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  async function deleteArchive(id: string) {
    if (!confirm(`Delete Family Archive item “${id}”?`)) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/family-archives/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Delete failed.");
        return;
      }
      setArchives((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) resetForm();
      setMessage("Item deleted.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="fa-heading">
      <h2 id="fa-heading">Family Archives</h2>
      <label className={styles.label}>
        Collection note
        <textarea
          className={styles.textarea}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <button
        type="button"
        className={styles.secondaryBtn}
        disabled={pending}
        onClick={saveNote}
      >
        Save collection note
      </button>

      <form className={`${styles.form} ${styles.panel}`} onSubmit={saveArchive}>
        <h3 style={{ margin: 0 }}>{editingLabel}</h3>
        <div className={styles.grid2}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>
          <label className={styles.label}>
            Date label (optional)
            <input
              className={styles.input}
              value={form.dateLabel}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateLabel: e.target.value }))
              }
            />
          </label>
        </div>
        <label className={styles.label}>
          Caption
          <span className={styles.hint}>
            The published caption stays in this box. Saving keeps this wording
            unless you change it.
          </span>
          <textarea
            className={styles.textarea}
            required
            value={form.caption}
            onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
          />
        </label>
        <label className={styles.label}>
          Context note (optional public-record / press)
          <textarea
            className={styles.textarea}
            value={form.contextNote}
            onChange={(e) =>
              setForm((f) => ({ ...f, contextNote: e.target.value }))
            }
          />
        </label>
        <label className={styles.label}>
          References JSON (leave blank while editing to keep the current list)
          <textarea
            className={styles.textarea}
            value={form.referencesJson}
            onChange={(e) =>
              setForm((f) => ({ ...f, referencesJson: e.target.value }))
            }
            placeholder='[{"label":"…","url":"https://…","note":"…"}]'
          />
        </label>
        <div className={styles.grid2}>
          <label className={styles.label}>
            Image path
            <input
              className={styles.input}
              required
              placeholder="/media/uploads/…"
              value={form.imageSrc}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageSrc: e.target.value }))
              }
            />
          </label>
          <label className={styles.label}>
            Verification
            <select
              className={styles.select}
              value={form.verificationStatus}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  verificationStatus: e.target.value as
                    | "facebook-caption"
                    | "needs-verification",
                }))
              }
            >
              <option value="facebook-caption">facebook-caption</option>
              <option value="needs-verification">needs-verification</option>
            </select>
          </label>
        </div>
        <label className={styles.label}>
          Alt text
          <textarea
            className={styles.textarea}
            required
            value={form.alt}
            onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
          />
        </label>
        <div className={styles.grid2}>
          <label className={styles.label}>
            Source label
            <input
              className={styles.input}
              required
              value={form.sourceLabel}
              onChange={(e) =>
                setForm((f) => ({ ...f, sourceLabel: e.target.value }))
              }
            />
          </label>
          <label className={styles.label}>
            Source URL (optional)
            <input
              className={styles.input}
              value={form.sourceUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, sourceUrl: e.target.value }))
              }
            />
          </label>
        </div>
        <div className={styles.rowActions}>
          <button className={styles.primaryBtn} type="submit" disabled={pending}>
            {pending ? "Saving…" : editingId ? "Update item" : "Add item"}
          </button>
          {editingId ? (
            <button type="button" className={styles.secondaryBtn} onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {archives.map((item) => (
              <tr key={item.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.thumb} src={item.imageSrc} alt="" />
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <div className={styles.hint}>{item.id}</div>
                </td>
                <td>{item.verificationStatus}</td>
                <td>
                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => deleteArchive(item.id)}
                      disabled={pending}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
