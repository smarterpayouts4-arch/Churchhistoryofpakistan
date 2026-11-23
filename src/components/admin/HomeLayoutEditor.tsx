"use client";

import { useState } from "react";
import styles from "@/app/admin/admin.module.css";
import s from "./studio.module.css";
import { adminFetch } from "./adminFetch";
import { toast } from "./toast";
import type { HomeLayoutFile, HomeLayoutSection } from "@/lib/cms/types";

const LABELS: Record<string, [string, string]> = {
  hero: ["Welcome banner", "Title, introduction, rotating photos and curator"],
  archives: ["From the Family Archive", "The first four archive records"],
  purpose: ["Our purpose", "The four purpose cards"],
  churches: ["Cathedrals & churches", "Preview of the eight cathedrals"],
  timeline: ["Timeline", "Dated, sourced milestones"],
  interviews: ["Interviews", "Featured interview videos"],
  connection: ["My connection", "The curator's personal statement"],
  contribute: ["Contribute invitation", "Invites visitors to share material"],
  guiding: ["Guiding principle", "Closing quotation"],
};

/** Reorder homepage sections (drag or arrows) and show/hide each one. */
export function HomeLayoutEditor({ initial }: { initial: HomeLayoutFile }) {
  const [sections, setSections] = useState<HomeLayoutSection[]>(initial.sections);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(next: HomeLayoutSection[]) {
    setSections(next);
    setDirty(true);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= sections.length || from === to) return;
    const next = [...sections];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    update(next);
  }

  async function save() {
    setSaving(true);
    const res = await adminFetch("/api/admin/home-layout", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sections }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      toast.success("Homepage layout saved. Visitors see the new order now.", {
        action: { label: "View homepage", href: "/" },
      });
    } else if (res.status !== 409) toast.error(body.error || "Could not save the layout.");
  }

  return (
    <div className={styles.panel}>
      <p className={styles.hint} style={{ marginBottom: "1rem" }}>
        Drag sections (or use the arrows) to change their order on the homepage. Switch a section off to hide
        it without losing its content.
      </p>
      <ol className={s.list}>
        {sections.map((sec, i) => {
          const [title, sub] = LABELS[sec.id] ?? [sec.id, ""];
          return (
            <li
              key={sec.id}
              className={sec.visible ? s.listRow : s.listRowHidden}
              draggable
              data-dragging={dragIndex === i}
              data-over={overIndex === i && dragIndex !== i}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(i);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) move(dragIndex, i);
                setDragIndex(null);
                setOverIndex(null);
              }}
            >
              <span className={s.grip} aria-hidden="true">
                ⋮⋮
              </span>
              <div className={s.listMain}>
                <strong>
                  {i + 1}. {title}
                </strong>
                <small>{sub}</small>
              </div>
              <label className={s.switch}>
                <input
                  type="checkbox"
                  role="switch"
                  checked={sec.visible}
                  onChange={(e) => update(sections.map((x, n) => (n === i ? { ...x, visible: e.target.checked } : x)))}
                />
                {sec.visible ? "Shown" : "Hidden"}
              </label>
              <button type="button" className={s.smallBtn} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${title} up`}>
                ↑
              </button>
              <button type="button" className={s.smallBtn} onClick={() => move(i, i + 1)} disabled={i === sections.length - 1} aria-label={`Move ${title} down`}>
                ↓
              </button>
            </li>
          );
        })}
      </ol>
      <div className={styles.rowActions} style={{ marginTop: "1rem" }}>
        <button type="button" className={styles.primaryBtn} onClick={save} disabled={!dirty || saving}>
          {saving ? "Saving…" : dirty ? "Save layout" : "Saved"}
        </button>
        <a className={styles.secondaryLink} href="/" target="_blank" rel="noreferrer">
          Preview homepage
        </a>
      </div>
    </div>
  );
}
