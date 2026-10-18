"use client";

import { FormEvent, useState } from "react";
import type { HomepageContent, PurposeCard, TimelineEntry } from "@/lib/cms/types";
import { ImageCropUpload } from "./ImageCropUpload";
import styles from "@/app/admin/admin.module.css";

type Props = {
  initialHomepage: HomepageContent;
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
};

export function HomepageEditor({
  initialHomepage,
  pending,
  setPending,
  setMessage,
  setError,
}: Props) {
  const [home, setHome] = useState<HomepageContent>(initialHomepage);

  function updateHero<K extends keyof HomepageContent["hero"]>(
    key: K,
    value: HomepageContent["hero"][K],
  ) {
    setHome((h) => ({ ...h, hero: { ...h.hero, [key]: value } }));
  }

  function updatePurposeCard(index: number, patch: Partial<PurposeCard>) {
    setHome((h) => ({
      ...h,
      purpose_cards: h.purpose_cards.map((c, i) =>
        i === index ? { ...c, ...patch } : c,
      ),
    }));
  }

  function addPurposeCard() {
    setHome((h) => ({
      ...h,
      purpose_cards: [...h.purpose_cards, { title: "New card", copy: "" }],
    }));
  }

  function removePurposeCard(index: number) {
    setHome((h) => ({
      ...h,
      purpose_cards: h.purpose_cards.filter((_, i) => i !== index),
    }));
  }

  function updateConnection(index: number, value: string) {
    setHome((h) => ({
      ...h,
      connection: h.connection.map((p, i) => (i === index ? value : p)),
    }));
  }

  function addConnection() {
    setHome((h) => ({ ...h, connection: [...h.connection, ""] }));
  }

  function removeConnection(index: number) {
    setHome((h) => ({
      ...h,
      connection: h.connection.filter((_, i) => i !== index),
    }));
  }

  function moveConnection(index: number, dir: -1 | 1) {
    setHome((h) => {
      const next = [...h.connection];
      const j = index + dir;
      if (j < 0 || j >= next.length) return h;
      const tmp = next[index]!;
      next[index] = next[j]!;
      next[j] = tmp;
      return { ...h, connection: next };
    });
  }

  function updateTimeline(index: number, patch: Partial<TimelineEntry>) {
    setHome((h) => ({
      ...h,
      timeline: h.timeline.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    }));
  }

  function addTimeline() {
    setHome((h) => ({
      ...h,
      timeline: [
        ...h.timeline,
        { year: "", title: "", copy: "", source: "https://" },
      ],
    }));
  }

  function removeTimeline(index: number) {
    setHome((h) => ({
      ...h,
      timeline: h.timeline.filter((_, i) => i !== index),
    }));
  }

  function updateFieldLabel(index: number, value: string) {
    setHome((h) => ({
      ...h,
      contribution_fields: h.contribution_fields.map((f, i) =>
        i === index ? value : f,
      ),
    }));
  }

  function addFieldLabel() {
    setHome((h) => ({
      ...h,
      contribution_fields: [...h.contribution_fields, "New field"],
    }));
  }

  function removeFieldLabel(index: number) {
    setHome((h) => ({
      ...h,
      contribution_fields: h.contribution_fields.filter((_, i) => i !== index),
    }));
  }

  async function saveHome(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(home),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        data?: HomepageContent;
      };
      if (!res.ok || !data.data) {
        setError(data.error || "Homepage save failed.");
        return;
      }
      setHome(data.data);
      setMessage("Homepage saved. Public pages use this copy on the next load.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="home-heading">
      <h2 id="home-heading">Homepage</h2>
      <p className={styles.hint}>
        Stored in <code>data/cms/homepage.json</code>. Edit only existing
        historical copy. Do not invent facts, dates, or biographies.
      </p>

      <form className={`${styles.form} ${styles.panel}`} onSubmit={saveHome}>
        <h3 style={{ margin: 0 }}>Site identity</h3>
        <div className={styles.grid2}>
          <label className={styles.label}>
            Site title
            <input
              className={styles.input}
              required
              value={home.site_title}
              onChange={(e) =>
                setHome((h) => ({ ...h, site_title: e.target.value }))
              }
            />
          </label>
          <label className={styles.label}>
            Guiding principle
            <input
              className={styles.input}
              required
              value={home.guiding_principle}
              onChange={(e) =>
                setHome((h) => ({ ...h, guiding_principle: e.target.value }))
              }
            />
          </label>
        </div>
        <label className={styles.label}>
          Strapline
          <input
            className={styles.input}
            required
            value={home.strapline}
            onChange={(e) =>
              setHome((h) => ({ ...h, strapline: e.target.value }))
            }
          />
        </label>

        <h3 style={{ margin: "0.5rem 0 0" }}>Hero</h3>
        <div className={styles.grid2}>
          <label className={styles.label}>
            Eyebrow
            <input
              className={styles.input}
              required
              value={home.hero.eyebrow}
              onChange={(e) => updateHero("eyebrow", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              required
              value={home.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
            />
          </label>
        </div>
        <label className={styles.label}>
          Intro
          <textarea
            className={styles.textarea}
            required
            value={home.hero.intro}
            onChange={(e) => updateHero("intro", e.target.value)}
          />
        </label>
        <label className={styles.label}>
          Purpose line
          <textarea
            className={styles.textarea}
            required
            value={home.hero.purpose}
            onChange={(e) => updateHero("purpose", e.target.value)}
          />
        </label>
        <label className={styles.label}>
          Portrait path
          <input
            className={styles.input}
            required
            value={home.hero.portrait}
            onChange={(e) => updateHero("portrait", e.target.value)}
            placeholder="/media/founder/…"
          />
        </label>
        <div className={styles.panel} style={{ padding: "0.85rem" }}>
          <p className={styles.hint} style={{ marginBottom: "0.5rem" }}>
            Optional: upload / crop a new portrait and set the path above.
          </p>
          <ImageCropUpload
            destination="uploads"
            onUploaded={(path) => {
              updateHero("portrait", path);
              setMessage(`Portrait path set to ${path}`);
            }}
          />
        </div>

        <h3 style={{ margin: "0.5rem 0 0" }}>Hero photo band (rotating)</h3>
        <p className={styles.hint}>
          One wide photograph under the hero buttons, crossfading every few seconds.
          Use landscape photos. “Focal position” keeps faces framed — e.g. <code>50% 18%</code>
          shows the upper part of the photo, <code>50% 50%</code> the centre.
        </p>
        {(home.hero.band_images ?? []).map((img, i) => (
          <article key={i} className={styles.panel} style={{ padding: "0.85rem" }}>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Image path
                <input className={styles.input} value={img.src} onChange={(e) => {
                  const list = [...(home.hero.band_images ?? [])]; list[i] = { ...list[i]!, src: e.target.value };
                  setHome((h) => ({ ...h, hero: { ...h.hero, band_images: list } }));
                }} />
              </label>
              <label className={styles.label}>
                Focal position
                <input className={styles.input} value={img.position} placeholder="50% 20%" onChange={(e) => {
                  const list = [...(home.hero.band_images ?? [])]; list[i] = { ...list[i]!, position: e.target.value };
                  setHome((h) => ({ ...h, hero: { ...h.hero, band_images: list } }));
                }} />
              </label>
            </div>
            <label className={styles.label} style={{ marginTop: "0.6rem" }}>
              Caption / alt text
              <input className={styles.input} value={img.alt} onChange={(e) => {
                const list = [...(home.hero.band_images ?? [])]; list[i] = { ...list[i]!, alt: e.target.value };
                setHome((h) => ({ ...h, hero: { ...h.hero, band_images: list } }));
              }} />
            </label>
            <div className={styles.rowActions} style={{ marginTop: "0.6rem" }}>
              <button type="button" className={styles.dangerBtn} onClick={() => {
                const list = (home.hero.band_images ?? []).filter((_, n) => n !== i);
                setHome((h) => ({ ...h, hero: { ...h.hero, band_images: list } }));
              }}>Remove</button>
            </div>
            <div style={{ marginTop: "0.6rem" }}>
              <ImageCropUpload destination="uploads" onUploaded={(path) => {
                const list = [...(home.hero.band_images ?? [])]; list[i] = { ...list[i]!, src: path };
                setHome((h) => ({ ...h, hero: { ...h.hero, band_images: list } }));
              }} />
            </div>
          </article>
        ))}
        <div className={styles.rowActions}>
          <button type="button" className={styles.secondaryBtn} onClick={() => {
            const list = [...(home.hero.band_images ?? []), { src: "", alt: "", position: "50% 25%" }];
            setHome((h) => ({ ...h, hero: { ...h.hero, band_images: list } }));
          }}>+ Add band photo</button>
        </div>

        <h3 style={{ margin: "0.5rem 0 0" }}>Purpose cards</h3>
        {home.purpose_cards.map((card, i) => (
          <article key={i} className={styles.panel} style={{ padding: "0.85rem" }}>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Title
                <input
                  className={styles.input}
                  required
                  value={card.title}
                  onChange={(e) =>
                    updatePurposeCard(i, { title: e.target.value })
                  }
                />
              </label>
              <div className={styles.rowActions} style={{ alignItems: "end" }}>
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() => removePurposeCard(i)}
                  disabled={home.purpose_cards.length <= 1}
                >
                  Remove
                </button>
              </div>
            </div>
            <label className={styles.label}>
              Copy
              <textarea
                className={styles.textarea}
                required
                value={card.copy}
                onChange={(e) => updatePurposeCard(i, { copy: e.target.value })}
              />
            </label>
          </article>
        ))}
        <button type="button" className={styles.secondaryBtn} onClick={addPurposeCard}>
          Add purpose card
        </button>

        <h3 style={{ margin: "0.5rem 0 0" }}>My Connection paragraphs</h3>
        {home.connection.map((para, i) => (
          <article key={i} className={styles.panel} style={{ padding: "0.85rem" }}>
            <label className={styles.label}>
              Paragraph {i + 1}
              {i === 3 ? " (pull quote on homepage)" : ""}
              <textarea
                className={styles.textarea}
                required
                value={para}
                onChange={(e) => updateConnection(i, e.target.value)}
              />
            </label>
            <div className={styles.rowActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => moveConnection(i, -1)}
                disabled={i === 0}
              >
                Up
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => moveConnection(i, 1)}
                disabled={i === home.connection.length - 1}
              >
                Down
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => removeConnection(i)}
                disabled={home.connection.length <= 1}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
        <button type="button" className={styles.secondaryBtn} onClick={addConnection}>
          Add paragraph
        </button>

        <h3 style={{ margin: "0.5rem 0 0" }}>Timeline</h3>
        {home.timeline.map((entry, i) => (
          <article key={i} className={styles.panel} style={{ padding: "0.85rem" }}>
            <div className={styles.grid2}>
              <label className={styles.label}>
                Year
                <input
                  className={styles.input}
                  required
                  value={entry.year}
                  onChange={(e) => updateTimeline(i, { year: e.target.value })}
                />
              </label>
              <label className={styles.label}>
                Title
                <input
                  className={styles.input}
                  required
                  value={entry.title}
                  onChange={(e) => updateTimeline(i, { title: e.target.value })}
                />
              </label>
            </div>
            <label className={styles.label}>
              Copy
              <textarea
                className={styles.textarea}
                required
                value={entry.copy}
                onChange={(e) => updateTimeline(i, { copy: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Source URL
              <input
                className={styles.input}
                required
                value={entry.source}
                onChange={(e) => updateTimeline(i, { source: e.target.value })}
              />
            </label>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={() => removeTimeline(i)}
              disabled={home.timeline.length <= 1}
            >
              Remove entry
            </button>
          </article>
        ))}
        <button type="button" className={styles.secondaryBtn} onClick={addTimeline}>
          Add timeline entry
        </button>

        <h3 style={{ margin: "0.5rem 0 0" }}>Contribution field labels</h3>
        {home.contribution_fields.map((label, i) => (
          <div key={i} className={styles.grid2}>
            <label className={styles.label}>
              Label {i + 1}
              <input
                className={styles.input}
                required
                value={label}
                onChange={(e) => updateFieldLabel(i, e.target.value)}
              />
            </label>
            <div className={styles.rowActions} style={{ alignItems: "end" }}>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => removeFieldLabel(i)}
                disabled={home.contribution_fields.length <= 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={styles.secondaryBtn} onClick={addFieldLabel}>
          Add field label
        </button>

        <h3 style={{ margin: "0.5rem 0 0" }}>Page context</h3>
        <p className={styles.hint}>
          Site title and strapline above are the public name in the header and
          footer. These fields are the sentences a curator can change without
          editing code.
        </p>
        {(
          [
            ["contribute_eyebrow", "Home contribute eyebrow"],
            ["contribute_heading", "Home contribute heading"],
            ["contribute_button", "Home contribute button"],
            ["contribute_copy", "Home contribute paragraph"],
            ["guiding_note", "Guiding principle note"],
            ["archive_intro", "Archive page intro"],
            ["interviews_intro", "Interviews page intro"],
            ["people_intro", "People page intro"],
            ["contribute_intro", "Contribute page intro"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className={styles.label}>
            {label}
            {key.endsWith("_copy") || key.endsWith("_note") || key.endsWith("_intro") ? (
              <textarea
                className={styles.textarea}
                required
                value={home.page_context[key]}
                onChange={(e) =>
                  setHome((h) => ({
                    ...h,
                    page_context: { ...h.page_context, [key]: e.target.value },
                  }))
                }
              />
            ) : (
              <input
                className={styles.input}
                required
                value={home.page_context[key]}
                onChange={(e) =>
                  setHome((h) => ({
                    ...h,
                    page_context: { ...h.page_context, [key]: e.target.value },
                  }))
                }
              />
            )}
          </label>
        ))}

        <div className={styles.rowActions}>
          <button className={styles.primaryBtn} type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save homepage"}
          </button>
        </div>
      </form>
    </section>
  );
}
