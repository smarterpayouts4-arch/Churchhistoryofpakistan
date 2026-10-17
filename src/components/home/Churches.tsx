import Link from "next/link";
import { loadCathedralItems } from "@/content/cathedrals";
import { PlaceCard } from "@/components/ui/PlaceCard";
import styles from "./Churches.module.css";

/** Homepage shows four real diocesan cathedrals (prefer open-license photos). */
const HOME_IDS = ["karachi", "lahore", "multan", "peshawar"] as const;

export async function ChurchesPreview() {
  const cathedrals = await loadCathedralItems();
  const featured = HOME_IDS.map((id) => cathedrals.find((c) => c.id === id)!).filter(
    Boolean,
  );

  return (
    <section id="churches" className="section sectionWash" aria-labelledby="churches-heading">
      <div className="shell">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="eyebrow">Eight dioceses • one shared history</p>
            <h2 id="churches-heading">Churches &amp; Places</h2>
            <p className="headingNote">
              Cathedral seats of the Church of Pakistan, identified from verified
              diocesan sources.
            </p>
          </div>
          <Link className="sectionLink" href="/churches">
            View gallery →
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
          <strong>Photo integrity:</strong> homepage highlights four verified
          open-license cathedral photographs. The full gallery covers all eight
          dioceses; Faisalabad, Hyderabad, and Raiwind remain permission-pending
          SVG placeholders until diocesan-approved images arrive.
        </p>
      </div>
    </section>
  );
}
