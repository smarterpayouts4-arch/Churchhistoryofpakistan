import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import Link from "next/link";
import { Forthcoming } from "@/components/ui/Forthcoming";
import { InterviewGrid } from "@/components/home/InterviewGrid";
import { loadFeaturedInterviews } from "@/content/featured-interviews";
import { loadHomepage } from "@/content/homepage";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";
import { loadMediaMeta } from "@/lib/media/meta";
import styles from "../pages.module.css";

const description =
  "Youth motivational programmes (Rab Ki Khidmat / Youth Empowerment) from History: Church of Pakistan. Additional oral-history interviews forthcoming.";

export const metadata: Metadata = {
  title: "Interviews",
  description,
  ...socialMetadata({ title: "Interviews", description, path: "/interviews", image: "interviews" }),
  alternates: { canonical: "/interviews" },
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

        <InterviewGrid
          items={featuredInterviews}
          meta={meta}
          headingLevel="h2"
          style={{ marginTop: "2.5rem" }}
        />

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/share-your-story">Suggest an interview subject</Link>
          <Link href="/people">People records</Link>
        </nav>
      </div>
    </div>
  );
}
