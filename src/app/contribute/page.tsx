import type { Metadata } from "next";
import Link from "next/link";
import { loadSiteSettings } from "@/content/site";
import { loadHomepage } from "@/content/homepage";
import { ContributeForm } from "./ContributeForm";
import { PageHeader } from "@/components/ui/PageHeader";
import styles from "../pages.module.css";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Share photographs, documents, and family memories for History: Church of Pakistan. Intake is reviewed before publication.",
};

export default async function ContributePage() {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);
  const intakeEnabled = Boolean(process.env.CONTRIBUTE_WEBHOOK_URL);

  return (
    <div className={styles.page}>
      <PageHeader eyebrow={homepage.page_context.contribute_eyebrow} title="Contribute" intro={homepage.page_context.contribute_intro} />
      <div className="shell pageBody">

        <div className={styles.notice}>
          {intakeEnabled ? (
            <><strong>Before you contribute.</strong> Please include the source of your material and confirm that you have permission to share it. Submissions are reviewed before publication.</>
          ) : (
            <><strong>{site.pages.contribute_notice.strong}</strong> {site.pages.contribute_notice.body}</>
          )}
        </div>

        {intakeEnabled && <ContributeForm contributionFields={homepage.contribution_fields} />}

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
