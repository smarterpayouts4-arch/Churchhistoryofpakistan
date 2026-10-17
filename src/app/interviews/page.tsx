import type { Metadata } from "next";
import Link from "next/link";
import { Forthcoming } from "@/components/ui/Forthcoming";
import { InterviewPlayCard } from "@/components/home/InterviewPlayCard";
import { loadFeaturedInterviews } from "@/content/featured-interviews";
import { loadHomepage } from "@/content/homepage";
import { PageHeader } from "@/components/ui/PageHeader";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/Interviews.module.css";

export const metadata: Metadata = {
  title: "Interviews",
  description:
    "Youth motivational programmes (Rab Ki Khidmat / Youth Empowerment) from History: Church of Pakistan. Additional oral-history interviews forthcoming.",
};

export default async function InterviewsPage() {
  const [featuredInterviews, homepage] = await Promise.all([
    loadFeaturedInterviews(),
    loadHomepage(),
  ]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Youth empowerment"
        title="Interviews"
        intro={homepage.page_context.interviews_intro}
      />
      <div className="shell pageBody">

        <Forthcoming title="Oral-history interviews still forthcoming">
          Additional oral-history interviews (verified interviewees, roles,
          transcripts, and citations) remain forthcoming. The videos below are
          youth motivational programmes published on the Facebook page; they are
          not Family Archive stills or interview records.
        </Forthcoming>

        <div className={homeStyles.interviewGrid} style={{ marginTop: "2rem" }}>
          {featuredInterviews.map((item) => (
            <article key={item.id} className={homeStyles.interviewCard}>
              <InterviewPlayCard
                title={item.title}
                videoSrc={item.videoSrc}
                coverSrc={item.coverSrc}
                posterSrc={item.posterSrc}
                alt={item.alt}
                width={item.width}
                height={item.height}
              />
              <p className="eyebrow">Rab Ki Khidmat</p>
              <h2 style={{ fontSize: "1.2rem", color: "var(--color-ink)" }}>
                {item.title}
              </h2>
              <p>{item.copy}</p>
              <p
                style={{
                  margin: "0.65rem 0.55rem 0",
                  fontSize: "0.75rem",
                  color: "var(--color-muted-brown)",
                }}
              >
                {item.provenance}
                {" · "}
                <a href={item.sourceUrl} rel="noopener noreferrer" target="_blank">
                  Source reel
                </a>
                {" · "}
                {item.width}×{item.height}
              </p>
            </article>
          ))}
        </div>

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/contribute">Suggest an interview subject</Link>
          <Link href="/people">People records</Link>
        </nav>
      </div>
    </div>
  );
}
