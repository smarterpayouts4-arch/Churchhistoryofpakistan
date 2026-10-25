import Link from "next/link";
import {
  loadFamilyArchiveHomePreview,
  loadFamilyArchiveNote,
} from "@/content/family-archives";
import { ArchiveCard } from "@/components/ui/ArchiveCard";
import styles from "./FamilyArchives.module.css";

export async function FamilyArchives() {
  const [familyArchiveHomePreview, FAMILY_ARCHIVE_NOTE] = await Promise.all([
    loadFamilyArchiveHomePreview(4),
    loadFamilyArchiveNote(),
  ]);

  return (
    <section id="archive" className="section" aria-labelledby="archive-heading">
      <div className="shell">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="eyebrow">Documents • photographs • memories</p>
            <h2 id="archive-heading">From the Family Archives</h2>
          </div>
          <Link className="sectionLink" href="/archive">
            Explore the collection ↗
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
          <strong>Family Archive provenance.</strong> {FAMILY_ARCHIVE_NOTE}{" "}
          <Link href="/archive">See all published holdings</Link>.
        </p>
      </div>
    </section>
  );
}
