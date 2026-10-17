import type { Metadata } from "next";
import Link from "next/link";
import { loadCathedralItems } from "@/content/cathedrals";
import { sources } from "@/content/sources";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        eyebrow="Transparency"
        title={<>Sources &amp; Photograph Credits</>}
        intro={
            <>
              Historical claims on this site remain connected to their sources.
          Sources in the register below were last accessed on {sources.accessed}.
            </>
          }
      />
      <div className="shell pageBody">

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
            Qadir Bakhsh. Full image rights details are kept in the project&apos;s
            image rights and credits register.
          </p>
        </div>

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/churches">Churches &amp; places</Link>
          <Link href="/contribute">Contribute</Link>
        </nav>
      </div>
    </div>
  );
}
