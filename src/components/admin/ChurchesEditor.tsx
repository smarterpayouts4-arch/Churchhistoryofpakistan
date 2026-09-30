"use client";

import { FormEvent, useMemo, useState } from "react";
import type { CathedralRecord, CathedralsFile } from "@/lib/cms/types";
import { ImageCropUpload } from "./ImageCropUpload";
import styles from "@/app/admin/admin.module.css";

type Props = {
  initialCathedrals: CathedralsFile;
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
};

function urlsToLines(urls: string[]): string {
  return urls.join("\n");
}

function linesToUrls(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ChurchesEditor({
  initialCathedrals,
  pending,
  setPending,
  setMessage,
  setError,
}: Props) {
  const [note, setNote] = useState(initialCathedrals.note);
  const [items, setItems] = useState<CathedralRecord[]>(
    () => initialCathedrals.items.map((i) => ({ ...i })),
  );
  const [selectedId, setSelectedId] = useState<string>(
    () => initialCathedrals.items[0]?.id ?? "",
  );

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  function patchSelected(patch: Partial<CathedralRecord>) {
    if (!selectedId) return;
    setItems((prev) =>
      prev.map((i) => (i.id === selectedId ? { ...i, ...patch } : i)),
    );
  }

  async function saveAll(e?: FormEvent) {
    e?.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const payload: CathedralsFile = { note, items };
      const res = await fetch("/api/admin/cathedrals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        data?: CathedralsFile;
      };
      if (!res.ok || !data.data) {
        setError(data.error || "Save failed.");
        return;
      }
      setNote(data.data.note);
      setItems(data.data.items.map((i) => ({ ...i })));
      setMessage("Churches / dioceses saved. Public / and /churches will refresh.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="churches-cms-heading">
      <h2 id="churches-cms-heading">Churches &amp; dioceses</h2>
      <p
        className={styles.hint}
        role="status"
        style={{
          borderLeft: "3px solid #af8b58",
          paddingLeft: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <strong>Do not invent historical facts or licenses.</strong> Keep
        captions/rights accurate. Edit only verified diocesan identities and
        rights-cleared photo fields.
      </p>
      <p className={styles.hint}>{note}</p>

      <label className={styles.label}>
        Curator note
        <textarea
          className={styles.textarea}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </label>

      <div className={styles.grid2} style={{ marginTop: "1rem", alignItems: "start" }}>
        <div className={styles.panel}>
          <h3 style={{ marginTop: 0 }}>Dioceses ({items.length})</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((item) => {
              const open = item.photo_status === "open_license";
              const active = item.id === selectedId;
              return (
                <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                  <button
                    type="button"
                    className={active ? styles.primaryBtn : styles.secondaryBtn}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.15rem",
                      alignItems: "flex-start",
                    }}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <span>
                      <code>{item.id}</code> · {item.diocese}
                    </span>
                    <span className={styles.hint} style={{ margin: 0 }}>
                      {item.cathedral}
                    </span>
                    <span
                      className={styles.hint}
                      style={{
                        margin: 0,
                        color: open ? "#2d6a4f" : "#9a3412",
                        fontWeight: 600,
                      }}
                    >
                      {item.photo_status}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {selected ? (
          <form className={`${styles.form} ${styles.panel}`} onSubmit={saveAll}>
            <h3 style={{ marginTop: 0 }}>
              Edit <code>{selected.id}</code>
            </h3>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Diocese
                <input
                  className={styles.input}
                  required
                  value={selected.diocese}
                  onChange={(e) => patchSelected({ diocese: e.target.value })}
                />
              </label>
              <label className={styles.label}>
                Cathedral
                <input
                  className={styles.input}
                  required
                  value={selected.cathedral}
                  onChange={(e) => patchSelected({ cathedral: e.target.value })}
                />
              </label>
            </div>
            <div className={styles.grid2}>
              <label className={styles.label}>
                City
                <input
                  className={styles.input}
                  required
                  value={selected.city}
                  onChange={(e) => patchSelected({ city: e.target.value })}
                />
              </label>
              <label className={styles.label}>
                Photo status
                <select
                  className={styles.select}
                  value={
                    selected.photo_status === "open_license" ||
                    selected.photo_status === "permission_needed"
                      ? selected.photo_status
                      : "permission_needed"
                  }
                  onChange={(e) =>
                    patchSelected({
                      photo_status: e.target.value as
                        | "open_license"
                        | "permission_needed",
                    })
                  }
                >
                  <option value="open_license">open_license</option>
                  <option value="permission_needed">permission_needed</option>
                </select>
              </label>
            </div>
            <label className={styles.label}>
              Address
              <input
                className={styles.input}
                required
                value={selected.address}
                onChange={(e) => patchSelected({ address: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Verification
              <textarea
                className={styles.textarea}
                required
                value={selected.verification}
                onChange={(e) => patchSelected({ verification: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Verification URLs (one per line)
              <textarea
                className={styles.textarea}
                value={urlsToLines(selected.verification_urls)}
                onChange={(e) =>
                  patchSelected({ verification_urls: linesToUrls(e.target.value) })
                }
                rows={4}
              />
            </label>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Photo source page
                <input
                  className={styles.input}
                  value={selected.photo_source_page}
                  onChange={(e) =>
                    patchSelected({ photo_source_page: e.target.value })
                  }
                />
              </label>
              <label className={styles.label}>
                Photo remote URL
                <input
                  className={styles.input}
                  value={selected.photo_remote_url}
                  onChange={(e) =>
                    patchSelected({ photo_remote_url: e.target.value })
                  }
                />
              </label>
            </div>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Photo author
                <input
                  className={styles.input}
                  value={selected.photo_author}
                  onChange={(e) =>
                    patchSelected({ photo_author: e.target.value })
                  }
                />
              </label>
              <label className={styles.label}>
                Photo license
                <input
                  className={styles.input}
                  value={selected.photo_license}
                  onChange={(e) =>
                    patchSelected({ photo_license: e.target.value })
                  }
                />
              </label>
            </div>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Local file path
                <input
                  className={styles.input}
                  required
                  value={selected.local_file}
                  onChange={(e) => patchSelected({ local_file: e.target.value })}
                />
              </label>
              <label className={styles.label}>
                Fallback file (optional)
                <input
                  className={styles.input}
                  value={selected.fallback_file ?? ""}
                  onChange={(e) =>
                    patchSelected({
                      fallback_file: e.target.value.trim() || undefined,
                    })
                  }
                />
              </label>
            </div>
            <div className={styles.panel} style={{ margin: "0.5rem 0" }}>
              <p className={styles.hint} style={{ marginTop: 0 }}>
                Upload a rights-cleared photo into{" "}
                <code>public/media/cathedrals/</code> (sets local_file):
              </p>
              <ImageCropUpload
                destination="cathedrals"
                onUploaded={(path) => {
                  patchSelected({ local_file: path });
                  setMessage(`Cathedral image ready: ${path}`);
                }}
              />
            </div>
            <label className={styles.label}>
              Notes
              <textarea
                className={styles.textarea}
                value={selected.notes}
                onChange={(e) => patchSelected({ notes: e.target.value })}
              />
            </label>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Map query
                <input
                  className={styles.input}
                  required
                  value={selected.map_query}
                  onChange={(e) => patchSelected({ map_query: e.target.value })}
                />
              </label>
              <label className={styles.label}>
                Maps search URL
                <input
                  className={styles.input}
                  required
                  value={selected.maps_search_url}
                  onChange={(e) =>
                    patchSelected({ maps_search_url: e.target.value })
                  }
                />
              </label>
            </div>
            <div className={styles.rowActions}>
              <button
                className={styles.primaryBtn}
                type="submit"
                disabled={pending}
              >
                {pending ? "Saving…" : "Save all churches"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
