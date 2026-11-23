import type { Metadata } from "next";
import Link from "next/link";
import { Forthcoming } from "@/components/ui/Forthcoming";
import { InterviewCard } from "@/components/home/InterviewCard";
import { loadFeaturedInterviews } from "@/content/featured-interviews";
import { loadHomepage } from "@/content/homepage";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";
import { loadMediaMeta } from "@/lib/media/meta";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/Interviews.module.css";

export const metadata: Metadata = {
  title: "Interviews",
  description:
    "Youth motivational programmes (Rab Ki Khidmat / Youth Empowerment) from History: Church of Pakistan. Additional oral-history interviews forthcoming.",
};

export default async function InterviewsPage() {
  const [featuredInterviews, homepage, site, meta] = await Promise.all([
    loadFeaturedInterviews(),
    loadHomepage(),
    loadSiteSettings(),
    loadMediaMeta(),
  ]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Youth empowerment"
        title="Interviews"
        intro={homepage.page_context.interviews_intro}
      />
      <div className="shell pageBody">

        <Forthcoming title={site.pages.interviews_page.forthcoming_title}>
          {site.pages.interviews_page.forthcoming_body}
        </Forthcoming>

        {featuredInterviews.length ? (
          <div
            className={homeStyles.videoGrid}
            data-count={featuredInterviews.length}
            style={{ marginTop: "2.5rem" }}
          >
            {featuredInterviews.map((item) => (
              <InterviewCard
                key={item.id}
                headingLevel="h2"
                featured={featuredInterviews.length === 1}
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

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/share-your-story">Suggest an interview subject</Link>
          <Link href="/people">People records</Link>
        </nav>
      </div>
    </div>
  );
}
