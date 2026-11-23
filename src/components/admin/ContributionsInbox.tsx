"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import s from "./studio.module.css";
import { adminFetch } from "./adminFetch";
import { toast } from "./toast";
import { uploadMedia } from "./upload";
import { invalidateLibrary, loadLibrary } from "./mediaStore";
import type { Contribution } from "@/lib/cms/types";
import { formatBytes } from "@/lib/media/rules";

const FIELD_LABELS: Record<string, string> = {
  contributor_name: "Contributor",
  contact_email: "Private email",
  subject: "About",
  approx_date: "Approximate date",
  story: "Story",
  source_context: "Source / context",
  public_credit: "Public credit",
  rights_confirmation: "Rights confirmed",
  publication_consent: "Publication consent",
};

/** Submissions from the public Contribute form, with their private attachments. */
export function ContributionsInbox({ isAdmin, enabled }: { isAdmin: boolean; enabled: boolean }) {
  const [items, setItems] = useState<Contribution[] | null>(null);
  const [filter, setFilter] = useState<"new" | "reviewed" | "archived" | "all">("new");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/contributions");
    const body = (await res.json().catch(() => ({}))) as { items?: Contribution[] };
    setItems(body.items ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function setStatus(c: Contribution, status: Contribution["status"]) {
    const res = await adminFetch(`/api/admin/contributions/${c.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(status === "reviewed" ? "Marked as reviewed." : status === "archived" ? "Archived." : "Moved back to New.");
      await load();
    } else toast.error("Could not update the submission.");
  }

  async function remove(c: Contribution) {
    if (!window.confirm("Delete this submission and its files permanently?")) return;
    const res = await adminFetch(`/api/admin/contributions/${c.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Submission deleted.");
      await load();
    } else toast.error("Could not delete the submission.");
  }

  async function addToLibrary(c: Contribution, fileId: string, filename: string, type: string) {
    try {
      const res = await fetch(`/api/admin/contributions/${c.id}/files/${fileId}`);
      if (!res.ok) throw new Error("Could not read the file.");
      const blob = await res.blob();
      const { storage } = await loadLibrary();
      await uploadMedia(new File([blob], filename, { type }), storage, {
        alt: c.fields.subject ?? "",
      });
      invalidateLibrary();
      toast.success("Copied into the media library. You can now use it on any page.");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const shown = (items ?? []).filter((i) => filter === "all" || i.status === filter);

  return (
    <div>
      {!enabled ? (
        <div className={s.banner} role="note">
          <strong>The public Contribute form is switched off</strong>
          On the live site, submissions need Vercel KV (and a private Blob store for attachments). See docs/DEPLOYMENT.md.
        </div>
      ) : null}
      <div className={s.toolbar}>
        {(["new", "reviewed", "archived", "all"] as const).map((f) => (
          <button key={f} type="button" className={filter === f ? s.chipActive : s.chip} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "new" ? "New" : f === "reviewed" ? "Reviewed" : f === "archived" ? "Archived" : "All"}
            {f === "new" && items ? ` (${items.filter((i) => i.status === "new").length})` : ""}
          </button>
        ))}
      </div>
      {items === null ? (
        <p className={styles.hint}>Loading…</p>
      ) : shown.length === 0 ? (
        <p className={styles.hint}>Nothing here yet.</p>
      ) : (
        <ul className={s.list}>
          {shown.map((c) => (
            <li key={c.id} className={s.listRow} style={{ display: "block" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                <span className={c.status === "new" ? s.statusNew : s.statusPill}>{c.status}</span>
                <div className={s.listMain}>
                  <strong>{c.fields.subject || "(no subject)"}</strong>
                  <small>
                    {c.fields.contributor_name || "Anonymous"} · {new Date(c.receivedAt).toLocaleString()} ·{" "}
                    {c.attachments.length} file{c.attachments.length === 1 ? "" : "s"}
                  </small>
                </div>
                <button type="button" className={s.smallBtn} aria-expanded={openId === c.id} onClick={() => setOpenId(openId === c.id ? null : c.id)}>
                  {openId === c.id ? "Close" : "Open"}
                </button>
              </div>
              {openId === c.id ? (
                <div style={{ marginTop: "0.8rem" }}>
                  <dl className={s.detailFacts}>
                    {Object.entries(c.fields).map(([k, v]) => (
                      <div key={k}>
                        <dt>{FIELD_LABELS[k] ?? k}</dt>
                        <dd style={{ whiteSpace: "pre-wrap" }}>{v === "on" ? "Yes" : v}</dd>
                      </div>
                    ))}
                  </dl>
                  {c.attachments.length ? (
                    <div className={s.attachGrid}>
                      {c.attachments.map((a) => (
                        <div key={a.id} style={{ display: "grid", gap: "0.3rem" }}>
                          <a href={`/api/admin/contributions/${c.id}/files/${a.id}`}>
                            {a.contentType.startsWith("image/") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={`/api/admin/contributions/${c.id}/files/${a.id}?inline=1`} alt={`Attachment ${a.filename}`} />
                            ) : (
                              <span>📄</span>
                            )}
                            <span>
                              {a.filename} · {formatBytes(a.bytes)}
                            </span>
                          </a>
                          {a.contentType.startsWith("image/") ? (
                            <button type="button" className={s.smallBtn} onClick={() => addToLibrary(c, a.id, a.filename, a.contentType)}>
                              Add to library
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className={styles.rowActions} style={{ marginTop: "0.8rem" }}>
                    {c.status !== "reviewed" ? (
                      <button type="button" className={styles.secondaryBtn} onClick={() => setStatus(c, "reviewed")}>
                        Mark reviewed
                      </button>
                    ) : null}
                    {c.status !== "archived" ? (
                      <button type="button" className={styles.secondaryBtn} onClick={() => setStatus(c, "archived")}>
                        Archive
                      </button>
                    ) : (
                      <button type="button" className={styles.secondaryBtn} onClick={() => setStatus(c, "new")}>
                        Move to New
                      </button>
                    )}
                    {isAdmin ? (
                      <button type="button" className={styles.dangerBtn} onClick={() => remove(c)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
