import Link from "next/link";
import { loadHomeFeaturedInterviews } from "@/content/featured-interviews";
import { loadSiteSettings } from "@/content/site";
import { loadMediaMeta } from "@/lib/media/meta";
import { InterviewCard } from "./InterviewCard";
import styles from "./Interviews.module.css";

/**
 * Featured Interviews = youth motivational videos (Rab Ki Khidmat / Youth Empowerment).
 * Video cards (see InterviewCard): 16:9 poster, play button, running time,
 * title and description; the video opens in an accessible modal player.
 */
export async function Interviews() {
  const [homeFeaturedInterviews, site, meta] = await Promise.all([
    loadHomeFeaturedInterviews(),
    loadSiteSettings(),
    loadMediaMeta(),
  ]);
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
        {homeFeaturedInterviews.length ? (
          <div className={styles.videoGrid} data-count={homeFeaturedInterviews.length}>
            {homeFeaturedInterviews.map((item) => (
              <InterviewCard
                key={item.id}
                featured={homeFeaturedInterviews.length === 1}
                eyebrow="Rab Ki Khidmat"
                title={item.title}
                description={item.copy}
                speaker={item.speaker}
                durationSeconds={item.durationSeconds}
                videoSrc={item.videoSrc}
                posterSrc={item.coverSrc || item.posterSrc}
                posterBlur={meta.get(item.coverSrc || item.posterSrc)?.blur}
                coverPosition={item.coverPosition}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sourceUrl={item.sourceUrl}
                provenance={item.provenance}
                captionsSrc={item.captionsSrc}
                transcript={item.transcript}
              />
            ))}
          </div>
        ) : null}
        <p className="forthcoming" style={{ marginTop: "1.5rem" }}>
          <strong>{copy.note_heading}</strong> {copy.note_body}
        </p>
      </div>
    </section>
  );
}
