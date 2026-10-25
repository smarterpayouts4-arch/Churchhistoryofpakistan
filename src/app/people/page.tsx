import type { Metadata } from "next";
import Link from "next/link";
import { Forthcoming } from "@/components/ui/Forthcoming";
import { MediaImage } from "@/components/ui/MediaImage";
import { loadHomepage } from "@/content/homepage";
import { loadPeopleFrames } from "@/content/people-frames";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/Interviews.module.css";

export const metadata: Metadata = {
  title: "People",
  description:
    "People records for History: Church of Pakistan. Biographies forthcoming.",
};

export default async function PeoplePage() {
  const [frames, homepage, site] = await Promise.all([
    loadPeopleFrames(),
    loadHomepage(),
    loadSiteSettings(),
  ]);
  const copy = site.pages.people;

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow={copy.eyebrow}
        title="People"
        intro={homepage.page_context.people_intro}
      />
      <div className="shell pageBody">

        <Forthcoming title={copy.forthcoming_title}>{copy.forthcoming_body}</Forthcoming>

        <div className={homeStyles.interviewGrid} style={{ marginTop: "2rem" }}>
          {frames.map((frame) => (
            <article key={frame.id} className={homeStyles.interviewCard}>
              <div className={homeStyles.peopleMedia}>
                <MediaImage
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                  className={homeStyles.peoplePhoto}
                  sizes="(max-width: 640px) 50vw, (max-width: 1100px) 50vw, 400px"
                />
              </div>
              <p className="eyebrow">{copy.card_eyebrow}</p>
              <h2 style={{ fontSize: "1.15rem", color: "var(--color-ink)" }}>
                {frame.title}
              </h2>
              <p>{copy.card_note}</p>
              <span className={homeStyles.interviewStatus}>{copy.status_label}</span>
            </article>
          ))}
        </div>

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/interviews">Interviews</Link>
          <Link href="/contribute">Contribute a memory</Link>
          <Link href="/sources">Sources</Link>
        </nav>
      </div>
    </div>
  );
}
