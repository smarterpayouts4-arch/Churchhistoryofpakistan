import type { Metadata } from "next";
import Link from "next/link";
import { loadCathedralItems } from "@/content/cathedrals";
import { sources } from "@/content/sources";
import styles from "../pages.module.css";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Source register, photograph credits, and research notes for History: Church of Pakistan.",
};

export default async function SourcesPage() {
  const cathedrals = await loadCathedralItems();
  const credited = cathedrals.filter((c) => c.photo_status === "open_license");

  return (
    <div className={styles.page}>
      <div className="shell">
        <p className="eyebrow">Transparency</p>
        <h1>Sources &amp; Photograph Credits</h1>
        <p className={styles.intro}>
          Historical claims on this site remain connected to their sources.
          Accessed date for the register below: {sources.accessed}.
        </p>

        <h2>Institutional sources</h2>
        <ul className={styles.list}>
          {sources.institutional.map((s) => (
            <li key={s.url}>
              <strong>
                <a href={s.url} rel="noopener noreferrer" target="_blank">
                  {s.title}
                </a>
              </strong>
              <p className={styles.meta}>{s.use}</p>
            </li>
          ))}
        </ul>

        <h2 style={{ marginTop: "2.5rem" }}>Raiwind-specific sources</h2>
        <ul className={styles.list}>
          {sources.raiwind.map((s) => (
            <li key={s.url}>
              <strong>
                <a href={s.url} rel="noopener noreferrer" target="_blank">
                  {s.title}
                </a>
              </strong>
              <p className={styles.meta}>{s.use}</p>
            </li>
          ))}
        </ul>

        <div className={styles.credits}>
          <h2>Photo credits · verified reusable cathedral images</h2>
          <ul>
            {credited.map((c) => (
              <li key={c.id}>
                <strong>
                  {c.city}: {c.cathedral}
                </strong>{" "}
                · Photo: {c.photo_author} / {c.photo_license}.{" "}
                {c.photo_source_page ? (
                  <a
                    href={c.photo_source_page}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Source
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
          <p className={styles.meta} style={{ marginTop: "1rem" }}>
            Faisalabad, Hyderabad, and Raiwind remain permission-needed
            placeholders. Founder/curator portraits are user-supplied and publicly credited to Javed
            Qadir Bakhsh. Image rights detail also lives in{" "}
            <code>docs/IMAGE_RIGHTS_AND_CREDITS.md</code> and the remote asset
            manifest path noted in content (
            <code>{sources.image_sources_file}</code>).
          </p>
        </div>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/churches">Churches &amp; places</Link>
          {" · "}
          <Link href="/contribute">Contribute</Link>
        </p>
      </div>
    </div>
  );
}
