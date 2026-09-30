import type { Metadata } from "next";
import Link from "next/link";
import { Forthcoming } from "@/components/ui/Forthcoming";
import { MediaImage } from "@/components/ui/MediaImage";
import { loadHomepage } from "@/content/homepage";
import { loadPeopleFrames } from "@/content/people-frames";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/Interviews.module.css";

export const metadata: Metadata = {
  title: "People",
  description:
    "People records for History: Church of Pakistan. Biographies forthcoming · no invented sample entries.",
};

export default async function PeoplePage() {
  const [frames, homepage] = await Promise.all([
    loadPeopleFrames(),
    loadHomepage(),
  ]);

  return (
    <div className={styles.page}>
      <div className="shell">
        <p className="eyebrow">Clergy &amp; lay witness</p>
        <h1>People</h1>
        <p className={styles.intro}>{homepage.page_context.people_intro}</p>

        <Forthcoming title="People records forthcoming">
          Named biographies are still forthcoming. The frames below are thematic
          stills · not named biography cards.
        </Forthcoming>

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
                  sizes="(max-width: 768px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
              </div>
              <p className="eyebrow">People archive</p>
              <h2 style={{ fontSize: "1.15rem", color: "var(--color-ink)" }}>
                {frame.title}
              </h2>
              <p>Verified biography slots open when citation-backed records arrive.</p>
              <span className={homeStyles.interviewStatus}>Forthcoming</span>
            </article>
          ))}
        </div>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/interviews">Interviews</Link>
          {" · "}
          <Link href="/contribute">Contribute a memory</Link>
          {" · "}
          <Link href="/sources">Sources</Link>
        </p>
      </div>
    </div>
  );
}
