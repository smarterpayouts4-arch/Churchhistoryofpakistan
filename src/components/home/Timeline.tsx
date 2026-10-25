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
        <div className="sectionHeading sectionHeadingSplit">
          <div><p className="eyebrow eyebrowLight">Selected documented milestones</p>
          <h2 id="timeline-heading">A journey through time.</h2></div>
          <span className={styles.range}>{homepage.timeline[0]?.year} — {homepage.timeline.at(-1)?.year}</span>
        </div>
        <ol className={styles.timeline}>
          {homepage.timeline.map((entry) => (
            <li key={`${entry.year}-${entry.title}`}>
              <span className={styles.year}>{entry.year}</span>
              <h3>{entry.title}</h3>
              <p>{entry.copy}</p>
              <p>
                <a href={entry.source} rel="noopener noreferrer" target="_blank">
                  Source
                </a>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
