import Link from "next/link";
import { loadHomeFeaturedInterviews } from "@/content/featured-interviews";
import { loadSiteSettings } from "@/content/site";
import { loadMediaMeta } from "@/lib/media/meta";
import { InterviewGrid } from "./InterviewGrid";

/**
 * Videos section (was "Featured Interviews") = youth motivational videos (Rab Ki Khidmat / Youth Empowerment).
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
          <Link className="sectionLink" href="/videos">
            {copy.view_all_label} →
          </Link>
        </div>
        <InterviewGrid items={homeFeaturedInterviews} meta={meta} />
        <p className="forthcoming" style={{ marginTop: "1.5rem" }}>
          <strong>{copy.note_heading}</strong> {copy.note_body}
        </p>
      </div>
    </section>
  );
}
