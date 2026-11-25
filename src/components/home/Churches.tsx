import Link from "next/link";
import { loadCathedralItems } from "@/content/cathedrals";
import { loadSiteSettings } from "@/content/site";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { loadHomepage } from "@/content/homepage";
import { photoKey } from "@/lib/media/dedupe";
import styles from "./Churches.module.css";

/** Homepage shows four real diocesan cathedrals (prefer open-license photos), in this order. */
const HOME_IDS = ["karachi", "lahore", "multan", "peshawar", "sialkot"] as const;
const HOME_COUNT = 4;

export async function ChurchesPreview() {
  const [cathedrals, site, { hero }] = await Promise.all([loadCathedralItems(), loadSiteSettings(), loadHomepage()]);
  const copy = site.home_sections.churches;
  // A cathedral photo already in the homepage slideshow is swapped for the next one.
  const inSlideshow = new Set((hero.band_images ?? []).map((img) => photoKey(img.src)));
  const candidates = HOME_IDS.map((id) => cathedrals.find((c) => c.id === id)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  const distinct = candidates.filter((c) => !inSlideshow.has(photoKey(c.local_file)));
  const featured = (distinct.length >= HOME_COUNT ? distinct : candidates).slice(0, HOME_COUNT);

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
            <PlaceCard key={c.id} cathedral={c} href={`/churches#${c.id}`}>
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
