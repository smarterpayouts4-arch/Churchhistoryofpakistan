import type { Metadata } from "next";
import Link from "next/link";
import {
  loadFamilyArchiveItems,
  loadFamilyArchiveNote,
} from "@/content/family-archives";
import { loadHomepage } from "@/content/homepage";
import { ArchiveCard } from "@/components/ui/ArchiveCard";
import { Lightbox } from "@/components/ui/Lightbox";
import { loadMediaMeta } from "@/lib/media/meta";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/FamilyArchives.module.css";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Family Archive holdings for History: Church of Pakistan, including caption-backed Facebook harvest items with Family Archive provenance.",
};

export default async function ArchivePage() {
  const [familyArchiveItems, FAMILY_ARCHIVE_NOTE, homepage, site, meta] = await Promise.all([
    loadFamilyArchiveItems(),
    loadFamilyArchiveNote(),
    loadHomepage(),
    loadSiteSettings(),
    loadMediaMeta(),
  ]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow={site.pages.archive.eyebrow}
        title="Archive"
        intro={homepage.page_context.archive_intro}
      />
      <div className="shell pageBody">

        <p className="forthcoming" style={{ marginBottom: "1.75rem" }}>
          <strong>{site.pages.archive.provenance_strong}</strong> {FAMILY_ARCHIVE_NOTE}
        </p>

        <div className={homeStyles.archiveGridFull}>
          {familyArchiveItems.map((item, i) => (
            <ArchiveCard key={item.id} item={item} titleTag="h2" lightbox={`archive:${i}`}>
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
                    <a className="tapLink" href={item.sourceUrl} rel="noopener noreferrer">
                      Open source
                    </a>
                  </>
                ) : null}
              </p>
            </ArchiveCard>
          ))}
        </div>

        <Lightbox
          group="archive"
          photos={familyArchiveItems.map((item) => ({
            src: item.imageSrc,
            alt: item.alt,
            title: item.title,
            caption: item.caption,
            meta: [item.dateLabel, item.provenance].filter(Boolean).join(" · "),
            blur: meta.get(item.imageSrc)?.blur,
          }))}
        />

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/share-your-story">Share a story or photograph</Link>
          <Link href="/sources">Sources &amp; rights</Link>
        </nav>
      </div>
    </div>
  );
}
