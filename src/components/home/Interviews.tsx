import Link from "next/link";
import { loadHomeFeaturedInterviews } from "@/content/featured-interviews";
import { loadSiteSettings } from "@/content/site";
import { InterviewPlayCard } from "./InterviewPlayCard";
import styles from "./Interviews.module.css";

/**
 * Featured Interviews = youth motivational videos (Rab Ki Khidmat / Youth Empowerment).
 * Source proportions and contain sizing preserve the full preview and video.
 */
export async function Interviews() {
  const [homeFeaturedInterviews, site] = await Promise.all([loadHomeFeaturedInterviews(), loadSiteSettings()]);
  const copy = site.home_sections.interviews;

  return (
    <section id="interviews" className="section" aria-labelledby="interviews-heading">
      <div className="shell">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="interviews-heading">{copy.heading}</h2>
          </div>
          <Link className="sectionLink" href="/interviews">
            {copy.view_all_label} →
          </Link>
        </div>
        <div className={styles.interviewGrid}>
          {homeFeaturedInterviews.map((item) => (
            <article key={item.id} className={styles.interviewCard}>
              <InterviewPlayCard
                title={item.title}
                videoSrc={item.videoSrc}
                coverSrc={item.coverSrc}
                coverPosition={item.coverPosition}
                posterSrc={item.posterSrc}
                alt={item.alt}
                width={item.width}
                height={item.height}
              />
              <p className={styles.interviewMeta}>Rab Ki Khidmat</p>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
        <p className="forthcoming" style={{ marginTop: "1.5rem" }}>
          <strong>{copy.note_heading}</strong> {copy.note_body}
        </p>
      </div>
    </section>
  );
}
