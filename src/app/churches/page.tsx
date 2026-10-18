import type { Metadata } from "next";
import Link from "next/link";
import { loadCathedralItems } from "@/content/cathedrals";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/Churches.module.css";

export const metadata: Metadata = {
  title: "Churches",
  description:
    "Eight diocesan cathedrals of the Church of Pakistan · addresses, verification notes, and photo rights status.",
};

export default async function ChurchesPage() {
  const [cathedrals, site] = await Promise.all([loadCathedralItems(), loadSiteSettings()]);
  const copy = site.pages.churches;

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
      />
      <div className="shell pageBody">

        <div className={styles.places}>
          {cathedrals.map((c) => (
              <PlaceCard key={c.id} cathedral={c} titleTag="h2">
                  <p className={styles.meta}>{c.verification}</p>
                  {c.photo_author ? (
                    <p className={styles.meta}>
                      Photo: {c.photo_author}
                      {c.photo_license ? ` / ${c.photo_license}` : ""}
                      {c.photo_source_page ? (
                        <>
                          {" · "}
                          <a
                            href={c.photo_source_page}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Source
                          </a>
                        </>
                      ) : null}
                    </p>
                  ) : (
                    <p className={styles.meta}>{c.notes}</p>
                  )}
                  <p>
                    <a
                      className={homeStyles.placeLink}
                      href={c.maps_search_url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Open in Maps <span aria-hidden="true">→</span>
                    </a>
                  </p>
                  {c.verification_urls.length > 0 ? (
                    <ul className={`${styles.meta} ${styles.urlList}`} style={{ paddingLeft: "1.1rem" }}>
                      {c.verification_urls.map((url) => (
                        <li key={url}>
                          <a href={url} rel="noopener noreferrer" target="_blank">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
              </PlaceCard>
          ))}
        </div>

        <p className={homeStyles.rightsNote}>
          <strong>{copy.rights_note_strong}</strong> {copy.rights_note}{" "}
          <Link href="/sources">{copy.rights_note_link_label}</Link> {copy.rights_note_tail}
        </p>
      </div>
    </div>
  );
}
