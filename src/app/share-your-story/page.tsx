import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";
import Link from "next/link";
import { loadSiteSettings } from "@/content/site";
import { loadHomepage } from "@/content/homepage";
import { ShareStoryForm } from "./ShareStoryForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { CONTRIB_MAX_FILES, CONTRIB_MAX_TOTAL_BYTES, intakeStatus } from "@/lib/contributions/intake";
import styles from "../pages.module.css";

const description =
  "Add your stories, memories and photographs to the History: Church of Pakistan archive. Every story is reviewed before it is published.";

export const metadata: Metadata = {
  title: "Share Your Story",
  description,
  ...socialMetadata({ title: "Share Your Story", description, path: "/share-your-story", image: "share-your-story" }),
  alternates: { canonical: "/share-your-story" },
};

export default async function ShareYourStoryPage() {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);
  const intake = intakeStatus();
  const intakeEnabled = intake.enabled;

  return (
    <div className={styles.page}>
      <PageHeader eyebrow={homepage.page_context.contribute_eyebrow} title="Share Your Story" intro={homepage.page_context.contribute_intro} />
      <div className="shell pageBody">

        <div className={styles.notice}>
          {intakeEnabled ? (
            <><strong>Before you share.</strong> Tell us where a photograph or document comes from, and confirm you are happy for it to be shared. Every story is read and checked before anything is published.</>
          ) : (
            <><strong>{site.pages.contribute_notice.strong}</strong> {site.pages.contribute_notice.body}</>
          )}
        </div>

        {intakeEnabled && (
          <ShareStoryForm
            contributionFields={homepage.contribution_fields}
            attachments={{
              enabled: intake.attachments,
              maxFiles: CONTRIB_MAX_FILES,
              maxTotalBytes: CONTRIB_MAX_TOTAL_BYTES,
            }}
          />
        )}

        <p style={{ marginTop: "2rem" }}>
          <Link href="/archive">Explore the archive</Link>
          {" · "}
          <Link href="/sources">Sources &amp; rights policy</Link>
          {" · "}
          <Link href="/about">About the project</Link>
        </p>
      </div>
    </div>
  );
}
