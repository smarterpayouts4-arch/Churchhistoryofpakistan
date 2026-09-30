import type { Metadata } from "next";
import Link from "next/link";
import { loadCathedralItems } from "@/content/cathedrals";
import { PlaceCard } from "@/components/ui/PlaceCard";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/Churches.module.css";

export const metadata: Metadata = {
  title: "Churches",
  description:
    "Eight diocesan cathedrals of the Church of Pakistan · addresses, verification notes, and photo rights status.",
};

export default async function ChurchesPage() {
  const cathedrals = await loadCathedralItems();

  return (
    <div className={styles.page}>
      <div className="shell">
        <p className="eyebrow">Eight dioceses • one shared history</p>
        <h1>Churches &amp; Places</h1>
        <p className={styles.intro}>
          Cathedral seats of the Church of Pakistan dioceses, drawn from the
          verified content register. Photo badges reflect rights status · three
          remain placeholders pending permission.
        </p>

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
                    <ul className={styles.meta} style={{ paddingLeft: "1.1rem" }}>
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
          <strong>Photo integrity:</strong> Faisalabad, Hyderabad, and Raiwind use
          SVG placeholders until licensed or diocesan-approved images are supplied.
          See <Link href="/sources">Sources</Link> for the institutional register.
        </p>
      </div>
    </div>
  );
}
