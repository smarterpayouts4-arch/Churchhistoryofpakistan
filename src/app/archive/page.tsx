import type { Metadata } from "next";
import Link from "next/link";
import {
  loadFamilyArchiveItems,
  loadFamilyArchiveNote,
} from "@/content/family-archives";
import { loadHomepage } from "@/content/homepage";
import { ArchiveCard } from "@/components/ui/ArchiveCard";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/FamilyArchives.module.css";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Family Archive holdings for History: Church of Pakistan, including caption-backed Facebook harvest items with Family Archive provenance.",
};

export default async function ArchivePage() {
  const [familyArchiveItems, FAMILY_ARCHIVE_NOTE, homepage] = await Promise.all([
    loadFamilyArchiveItems(),
    loadFamilyArchiveNote(),
    loadHomepage(),
  ]);

  return (
    <div className={styles.page}>
      <div className="shell">
        <p className="eyebrow">Documents • photographs • memories</p>
        <h1>Archive</h1>
        <p className={styles.intro}>{homepage.page_context.archive_intro}</p>

        <p className="forthcoming" style={{ marginBottom: "1.75rem" }}>
          <strong>Provenance note.</strong> {FAMILY_ARCHIVE_NOTE}
        </p>

        <div className={homeStyles.archiveGridFull}>
          {familyArchiveItems.map((item) => (
            <ArchiveCard key={item.id} item={item} titleTag="h2">
              <div className={homeStyles.archiveMetaRow}>
                <span className={homeStyles.provenance}>{item.provenance}</span>
                <span className={homeStyles.archiveStatus}>
                  {item.verificationStatus === "facebook-caption"
                    ? "Facebook caption"
                    : "Needs verification"}
                </span>
              </div>
              <p className={homeStyles.archiveSource}>
                Source: {item.sourceLabel}
                {item.sourceUrl ? (
                  <>
                    {" · "}
                    <a href={item.sourceUrl} rel="noopener noreferrer">
                      Open source
                    </a>
                  </>
                ) : null}
              </p>
            </ArchiveCard>
          ))}
        </div>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/contribute">Help add a verified record</Link>
          {" · "}
          <Link href="/sources">Sources &amp; rights</Link>
        </p>
      </div>
    </div>
  );
}
