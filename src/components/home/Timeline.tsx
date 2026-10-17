import { loadHomepage } from "@/content/homepage";
import styles from "./Timeline.module.css";

export async function Timeline() {
  const homepage = await loadHomepage();

  return (
    <section
      id="timeline"
      className={`section ${styles.timelineSection}`}
      aria-labelledby="timeline-heading"
    >
      <div className="shell">
        <div className="sectionHeading sectionHeadingCentered">
          <p className="eyebrow eyebrowLight">Selected documented milestones</p>
          <h2 id="timeline-heading">A Journey Through Time</h2>
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
