import Link from "next/link";
import {
  loadFamilyArchiveHomePreview,
  loadFamilyArchiveNote,
} from "@/content/family-archives";
import { ArchiveCard } from "@/components/ui/ArchiveCard";
import { Lightbox } from "@/components/ui/Lightbox";
import { loadMediaMeta } from "@/lib/media/meta";
import { loadSiteSettings } from "@/content/site";
import { loadHomepage } from "@/content/homepage";
import styles from "./FamilyArchives.module.css";

export async function FamilyArchives() {
  const { hero } = await loadHomepage();
  const [familyArchiveHomePreview, FAMILY_ARCHIVE_NOTE, site, meta] = await Promise.all([
    // Skip photos already in the homepage slideshow above.
    loadFamilyArchiveHomePreview(4, (hero.band_images ?? []).map((img) => img.src)),
    loadFamilyArchiveNote(),
    loadSiteSettings(),
    loadMediaMeta(),
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
          {familyArchiveHomePreview.map((item, i) => (
            <ArchiveCard key={item.id} item={item} lightbox={`home-archive:${i}`} sizes="(max-width: 600px) calc(100vw - 2.5rem), (max-width: 1100px) 46vw, 310px">
              <span className={styles.provenance}>{item.provenance}</span>
              {item.dateLabel ? (
                <span className={styles.archiveDate}>{item.dateLabel}</span>
              ) : null}
              <Link className={styles.recordLink} href={`/archive#${item.id}`}>View record <span aria-hidden="true">↗</span></Link>
            </ArchiveCard>
          ))}
        </div>
        <Lightbox
          group="home-archive"
          photos={familyArchiveHomePreview.map((item) => ({
            src: item.imageSrc,
            alt: item.alt,
            title: item.title,
            caption: item.caption,
            meta: [item.dateLabel, item.provenance].filter(Boolean).join(" · "),
            blur: meta.get(item.imageSrc)?.blur,
          }))}
        />
        <p className="forthcoming" style={{ marginTop: "1.5rem" }}>
          <strong>{copy.note_strong}</strong> {FAMILY_ARCHIVE_NOTE}{" "}
          <Link className="tapLink" href="/archive">{copy.note_link_label}</Link>.
        </p>
      </div>
    </section>
  );
}
