import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import Link from "next/link";
import { Forthcoming } from "@/components/ui/Forthcoming";
import { GalleryImage } from "@/components/ui/GalleryImage";
import { loadMediaMeta } from "@/lib/media/meta";
import { loadHomepage } from "@/content/homepage";
import { loadPeopleFrames } from "@/content/people-frames";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/Interviews.module.css";
import archiveStyles from "@/components/home/FamilyArchives.module.css";
import { Lightbox } from "@/components/ui/Lightbox";

const description =
  "People records for History: Church of Pakistan. Biographies forthcoming.";

export const metadata: Metadata = {
  title: "People",
  description,
  ...socialMetadata({ title: "People", description, path: "/people", image: "people" }),
  alternates: { canonical: "/people" },
};

export default async function PeoplePage() {
  const [frames, homepage, site, meta] = await Promise.all([
    loadPeopleFrames(),
    loadHomepage(),
    loadSiteSettings(),
    loadMediaMeta(),
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
          {frames.map((frame, i) => (
            <article key={frame.id} className={homeStyles.interviewCard}>
              <div className={homeStyles.peopleMedia}>
                <GalleryImage
                  src={frame.src}
                  alt={frame.alt}
                  ratio={4 / 3}
                  position={frame.position}
                  fit={frame.fit}
                  sizes="(max-width: 600px) calc(100vw - 2.5rem), (max-width: 980px) 46vw, 420px"
                />
                <button type="button" className={archiveStyles.enlarge} data-lightbox-open={`people:${i}`}>
                  <span className="sr-only">View larger photo: {frame.title}</span>
                  <span className={archiveStyles.enlargeHint} aria-hidden="true">View larger</span>
                </button>
              </div>
              <p className="eyebrow">{copy.card_eyebrow}</p>
              <h2 style={{ fontSize: "1.3rem", color: "var(--color-ink)" }}>
                {frame.title}
              </h2>
              <p>{copy.card_note}</p>
              <span className={homeStyles.interviewStatus}>{copy.status_label}</span>
            </article>
          ))}
        </div>

        <Lightbox
          group="people"
          photos={frames.map((frame) => ({ src: frame.src, alt: frame.alt, title: frame.title, blur: meta.get(frame.src)?.blur }))}
        />

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/interviews">Interviews</Link>
          <Link href="/share-your-story">Share a memory</Link>
          <Link href="/sources">Sources</Link>
        </nav>
      </div>
    </div>
  );
}
