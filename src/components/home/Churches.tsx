import Link from "next/link";
import { loadCathedralItems } from "@/content/cathedrals";
import { loadSiteSettings } from "@/content/site";
import { PlaceCard } from "@/components/ui/PlaceCard";
import styles from "./Churches.module.css";

/** Homepage shows four real diocesan cathedrals (prefer open-license photos). */
const HOME_IDS = ["karachi", "lahore", "multan", "peshawar"] as const;

export async function ChurchesPreview() {
  const [cathedrals, site] = await Promise.all([loadCathedralItems(), loadSiteSettings()]);
  const copy = site.home_sections.churches;
  const featured = HOME_IDS.map((id) => cathedrals.find((c) => c.id === id)!).filter(
    Boolean,
  );

  return (
    <section id="churches" className="section sectionWash" aria-labelledby="churches-heading">
      <div className="shell">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="churches-heading">{copy.heading}</h2>
            <p className="headingNote">{copy.note}</p>
          </div>
          <Link className="sectionLink" href="/churches">
            {copy.view_label} →
          </Link>
        </div>
        <div className={styles.placesGrid}>
          {featured.map((c) => (
            <PlaceCard key={c.id} cathedral={c}>
              <Link className={styles.placeLink} href={`/churches#${c.id}`}>
                View history &amp; sources <span aria-hidden="true">→</span>
              </Link>
            </PlaceCard>
          ))}
        </div>
        <p className={styles.rightsNote}>
          <strong>{copy.rights_note_strong}</strong> {copy.rights_note}
        </p>
      </div>
    </section>
  );
}
