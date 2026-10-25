import Link from "next/link";
import {
  loadFamilyArchiveHomePreview,
  loadFamilyArchiveNote,
} from "@/content/family-archives";
import { ArchiveCard } from "@/components/ui/ArchiveCard";
import { loadSiteSettings } from "@/content/site";
import styles from "./FamilyArchives.module.css";

export async function FamilyArchives() {
  const [familyArchiveHomePreview, FAMILY_ARCHIVE_NOTE, site] = await Promise.all([
    loadFamilyArchiveHomePreview(4),
    loadFamilyArchiveNote(),
    loadSiteSettings(),
  ]);
  const copy = site.home_sections.archives;

  return (
    <section id="archive" className="section" aria-labelledby="archive-heading">
      <div className="shell">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="archive-heading">{copy.heading}</h2>
          </div>
          <Link className="sectionLink" href="/archive">
            {copy.view_label} →
          </Link>
        </div>
        <div className={styles.archiveGrid}>
          {familyArchiveHomePreview.map((item) => (
            <ArchiveCard key={item.id} item={item}>
              <span className={styles.provenance}>{item.provenance}</span>
              {item.dateLabel ? (
                <span className={styles.archiveDate}>{item.dateLabel}</span>
              ) : null}
              <Link className={styles.recordLink} href={`/archive#${item.id}`}>View record <span aria-hidden="true">↗</span></Link>
            </ArchiveCard>
          ))}
        </div>
        <p className="forthcoming" style={{ marginTop: "1.5rem" }}>
          <strong>{copy.note_strong}</strong> {FAMILY_ARCHIVE_NOTE}{" "}
          <Link className="tapLink" href="/archive">{copy.note_link_label}</Link>.
        </p>
      </div>
    </section>
  );
}
