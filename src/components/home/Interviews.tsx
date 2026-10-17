import Link from "next/link";
import { loadHomeFeaturedInterviews } from "@/content/featured-interviews";
import { InterviewPlayCard } from "./InterviewPlayCard";
import styles from "./Interviews.module.css";

/**
 * Featured Interviews = youth motivational videos (Rab Ki Khidmat / Youth Empowerment).
 * Cover stage is uniform Facebook 4:5 with click-to-play; playing video uses contain
 * (never object-fit:cover on the video itself).
 */
export async function Interviews() {
  const homeFeaturedInterviews = await loadHomeFeaturedInterviews();

  return (
    <section id="interviews" className="section" aria-labelledby="interviews-heading">
      <div className="shell">
        <div className="sectionHeading sectionHeadingSplit">
          <div>
            <p className="eyebrow">Youth empowerment</p>
            <h2 id="interviews-heading">Featured Interviews</h2>
          </div>
          <Link className="sectionLink" href="/interviews">
            View all →
          </Link>
        </div>
        <div className={styles.interviewGrid}>
          {homeFeaturedInterviews.map((item) => (
            <article key={item.id} className={styles.interviewCard}>
              <InterviewPlayCard
                title={item.title}
                videoSrc={item.videoSrc}
                coverSrc={item.coverSrc}
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
          <strong>Youth motivational programmes</strong> from the History: Church of
          Pakistan Facebook page (Rab Ki Khidmat / Youth Empowerment). Additional
          oral-history interviews remain forthcoming.
        </p>
      </div>
    </section>
  );
}
