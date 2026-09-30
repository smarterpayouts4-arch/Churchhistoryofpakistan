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
          <div className="doubleRule" aria-hidden="true" />
          <p className="eyebrow">Selected documented milestones</p>
          <h2 id="timeline-heading">A Journey Through Time</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ruleOrnament"
            src="/media/textures/rule-ornament.svg"
            alt=""
            width={280}
            height={24}
          />
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
