"use client";

import { FormEvent, useState } from "react";
import type { SiteNavItem, SiteSettings } from "@/lib/cms/types";
import styles from "@/app/admin/admin.module.css";

type Props = {
  initialSite: SiteSettings;
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
};

type Field = { path: string; label: string; type?: "text" | "textarea"; rows?: number; hint?: string };
type Group = { title: string; hint?: string; fields: Field[] };

const GROUPS: Group[] = [
  {
    title: "Search & sharing (SEO)",
    hint: "The description shown by search engines and social shares. The title suffix follows every page name.",
    fields: [
      { path: "seo.description", label: "Site description", type: "textarea", rows: 3 },
      { path: "seo.title_suffix", label: "Page-title suffix" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { path: "footer.explore_title", label: "Explore column title" },
      { path: "footer.about_title", label: "About column title" },
      { path: "footer.about_copy", label: "About this archive text", type: "textarea", rows: 3 },
      { path: "footer.curator_link_label", label: "Curator login link label" },
    ],
  },
  {
    title: "Hero buttons",
    hint: "Labels and destinations for the two hero buttons on the home page.",
    fields: [
      { path: "hero_ctas.primary_label", label: "Primary button label" },
      { path: "hero_ctas.primary_href", label: "Primary button link (e.g. /archive)" },
      { path: "hero_ctas.secondary_label", label: "Secondary button label" },
      { path: "hero_ctas.secondary_href", label: "Secondary button link (e.g. /interviews)" },
    ],
  },
  {
    title: "Home section headings",
    hint: "Eyebrows (small labels), headings and short notes for each home-page section. Section body copy lives in the Home, Churches, Family Archives and Featured Interviews tabs.",
    fields: [
      { path: "home_sections.purpose.eyebrow", label: "Purpose — eyebrow" },
      { path: "home_sections.purpose.heading", label: "Purpose — heading" },
      { path: "home_sections.interviews.eyebrow", label: "Interviews — eyebrow" },
      { path: "home_sections.interviews.heading", label: "Interviews — heading" },
      { path: "home_sections.interviews.view_all_label", label: "Interviews — “view all” label" },
      { path: "home_sections.interviews.note_heading", label: "Interviews note — bold lead" },
      { path: "home_sections.interviews.note_body", label: "Interviews note — text", type: "textarea", rows: 3 },
      { path: "home_sections.churches.eyebrow", label: "Churches — eyebrow" },
      { path: "home_sections.churches.heading", label: "Churches — heading" },
      { path: "home_sections.churches.note", label: "Churches — intro line", type: "textarea", rows: 2 },
      { path: "home_sections.churches.view_label", label: "Churches — “view gallery” label" },
      { path: "home_sections.churches.rights_note_strong", label: "Churches rights note — bold lead" },
      { path: "home_sections.churches.rights_note", label: "Churches rights note — text", type: "textarea", rows: 3 },
      { path: "home_sections.timeline.eyebrow", label: "Timeline — eyebrow" },
      { path: "home_sections.timeline.heading", label: "Timeline — heading" },
      { path: "home_sections.archives.eyebrow", label: "Family Archives — eyebrow" },
      { path: "home_sections.archives.heading", label: "Family Archives — heading" },
      { path: "home_sections.archives.view_label", label: "Family Archives — “view more” label" },
      { path: "home_sections.archives.note_strong", label: "Family Archives note — bold lead" },
      { path: "home_sections.archives.note_link_label", label: "Family Archives note — link label" },
      { path: "home_sections.connection.eyebrow", label: "My Connection — eyebrow" },
      { path: "home_sections.connection.heading", label: "My Connection — heading" },
      { path: "home_sections.guiding.eyebrow", label: "Guiding Principle — eyebrow" },
    ],
  },
  {
    title: "Inner pages",
    hint: "Page-header wording and notices. Factual registers (sources, captions, verification) stay citation-backed — edit them in their own tabs.",
    fields: [
      { path: "pages.about.eyebrow", label: "About — eyebrow" },
      { path: "pages.about.title", label: "About — title" },
      { path: "pages.archive.eyebrow", label: "Archive — eyebrow" },
      { path: "pages.archive.provenance_strong", label: "Archive — provenance bold lead" },
      { path: "pages.churches.eyebrow", label: "Churches page — eyebrow" },
      { path: "pages.churches.title", label: "Churches page — title" },
      { path: "pages.churches.intro", label: "Churches page — intro", type: "textarea", rows: 3 },
      { path: "pages.churches.rights_note_strong", label: "Churches page rights note — bold lead" },
      { path: "pages.churches.rights_note", label: "Churches page rights note — text", type: "textarea", rows: 2 },
      { path: "pages.churches.rights_note_link_label", label: "Churches page rights note — link label" },
      { path: "pages.churches.rights_note_tail", label: "Churches page rights note — text after link" },
      { path: "pages.sources.eyebrow", label: "Sources — eyebrow" },
      { path: "pages.sources.title", label: "Sources — title" },
      { path: "pages.sources.intro_strong", label: "Sources — intro bold lead" },
      { path: "pages.sources.intro_tail", label: "Sources — intro text before the access date" },
      { path: "pages.sources.institutional_heading", label: "Sources — register heading" },
      { path: "pages.people.eyebrow", label: "People page — eyebrow" },
      { path: "pages.people.forthcoming_title", label: "People — forthcoming panel title" },
      { path: "pages.people.forthcoming_body", label: "People — forthcoming panel text", type: "textarea", rows: 2 },
      { path: "pages.people.card_eyebrow", label: "People cards — eyebrow" },
      { path: "pages.people.card_note", label: "People cards — note", type: "textarea", rows: 2 },
      { path: "pages.people.status_label", label: "People cards — status chip" },
      { path: "pages.interviews_page.forthcoming_title", label: "Interviews page — forthcoming panel title" },
      { path: "pages.interviews_page.forthcoming_body", label: "Interviews page — forthcoming panel text", type: "textarea", rows: 3 },
      { path: "pages.contribute_notice.strong", label: "Contribute — intake notice bold lead" },
      { path: "pages.contribute_notice.body", label: "Contribute — intake notice text", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "404 page",
    fields: [
      { path: "pages.not_found.eyebrow", label: "404 — eyebrow" },
      { path: "pages.not_found.title", label: "404 — title" },
      { path: "pages.not_found.intro", label: "404 — intro", type: "textarea", rows: 2 },
      { path: "pages.not_found.home_label", label: "404 — home link label" },
      { path: "pages.not_found.archive_label", label: "404 — archive link label" },
      { path: "pages.not_found.sources_label", label: "404 — sources link label" },
    ],
  },
];

function getPath(obj: SiteSettings, path: string): string {
  return path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], obj) as string;
}

function setPath(obj: SiteSettings, path: string, value: string): SiteSettings {
  const clone = JSON.parse(JSON.stringify(obj)) as SiteSettings;
  const keys = path.split(".");
  let cur = clone as unknown as Record<string, unknown>;
  for (const key of keys.slice(0, -1)) cur = cur[key] as Record<string, unknown>;
  cur[keys[keys.length - 1]!] = value;
  return clone;
}

export function SiteEditor({ initialSite, pending, setPending, setMessage, setError }: Props) {
  const [site, setSite] = useState<SiteSettings>(initialSite);

  function updateNav(which: "primary" | "footer", index: number, patch: Partial<SiteNavItem>) {
    setSite((s) => ({
      ...s,
      nav: { ...s.nav, [which]: s.nav[which].map((item, i) => (i === index ? { ...item, ...patch } : item)) },
    }));
  }

  function addNav(which: "primary" | "footer") {
    setSite((s) => ({ ...s, nav: { ...s.nav, [which]: [...s.nav[which], { href: "/", label: "New link" }] } }));
  }

  function removeNav(which: "primary" | "footer", index: number) {
    setSite((s) => ({ ...s, nav: { ...s.nav, [which]: s.nav[which].filter((_, i) => i !== index) } }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setMessage("Site & pages saved. The public site now uses the new wording.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="site-heading">
      <h2 id="site-heading">Site &amp; pages</h2>
      <p className={styles.hint}>
        Global wording: navigation, footer, hero buttons, section headings and inner-page
        text. Everything here is marketing/UI copy — historical content stays in its own
        tabs so citations are never loosened by accident.
      </p>
      <form onSubmit={onSubmit}>
        {(["primary", "footer"] as const).map((which) => (
          <div key={which} className={styles.panel} style={{ marginBottom: "1rem" }}>
            <h3 style={{ marginTop: 0 }}>{which === "primary" ? "Header navigation" : "Footer navigation"}</h3>
            {site.nav[which].map((item, i) => (
              <div key={i} className={styles.grid2} style={{ marginBottom: "0.5rem" }}>
                <label className={styles.label}>
                  Label
                  <input className={styles.input} value={item.label} onChange={(e) => updateNav(which, i, { label: e.target.value })} required />
                </label>
                <label className={styles.label}>
                  Link (href)
                  <span style={{ display: "flex", gap: "0.5rem" }}>
                    <input className={styles.input} value={item.href} onChange={(e) => updateNav(which, i, { href: e.target.value })} required />
                    <button type="button" className={styles.dangerBtn} onClick={() => removeNav(which, i)} aria-label={`Remove ${item.label}`}>
                      Remove
                    </button>
                  </span>
                </label>
              </div>
            ))}
            <button type="button" className={styles.secondaryBtn} onClick={() => addNav(which)}>
              Add link
            </button>
          </div>
        ))}

        {GROUPS.map((group) => (
          <div key={group.title} className={styles.panel} style={{ marginBottom: "1rem" }}>
            <h3 style={{ marginTop: 0 }}>{group.title}</h3>
            {group.hint ? <p className={styles.hint}>{group.hint}</p> : null}
            {group.fields.map((field) => (
              <label key={field.path} className={styles.label} style={{ display: "block", marginBottom: "0.75rem" }}>
                {field.label}
                {field.type === "textarea" ? (
                  <textarea
                    className={styles.textarea}
                    rows={field.rows ?? 3}
                    value={getPath(site, field.path) ?? ""}
                    onChange={(e) => setSite((s) => setPath(s, field.path, e.target.value))}
                    required
                  />
                ) : (
                  <input
                    className={styles.input}
                    value={getPath(site, field.path) ?? ""}
                    onChange={(e) => setSite((s) => setPath(s, field.path, e.target.value))}
                    required
                  />
                )}
              </label>
            ))}
          </div>
        ))}

        <button type="submit" className={styles.primaryBtn} disabled={pending}>
          {pending ? "Saving…" : "Save site & pages"}
        </button>
      </form>
    </section>
  );
}
