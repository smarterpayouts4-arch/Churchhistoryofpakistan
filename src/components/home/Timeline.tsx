import { loadHomepage } from "@/content/homepage";
import { loadSiteSettings } from "@/content/site";
import styles from "./Timeline.module.css";

export async function Timeline() {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);

  return (
    <section
      id="timeline"
      className={`section ${styles.timelineSection}`}
      aria-labelledby="timeline-heading"
    >
      <div className="shell">
        <div className="sectionHeading sectionHeadingSplit">
          <div><p className="eyebrow eyebrowLight">{site.home_sections.timeline.eyebrow}</p>
          <h2 id="timeline-heading">{site.home_sections.timeline.heading}</h2></div>
          <span className={styles.range}>{homepage.timeline[0]?.year} — {homepage.timeline.at(-1)?.year}</span>
        </div>
        <ol className={styles.timeline}>
          {homepage.timeline.map((entry) => (
            <li key={`${entry.year}-${entry.title}`}>
              <span className={styles.year}>{entry.year}</span>
              <h3>{entry.title}</h3>
              <p>{entry.copy}</p>
              <p className={styles.sourceRow}>
                <a href={entry.source} rel="noopener noreferrer" target="_blank">
                  Source <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
