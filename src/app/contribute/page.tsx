import type { Metadata } from "next";
import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import { ContributeForm } from "./ContributeForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";
import styles from "../pages.module.css";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Share photographs, documents, and family memories for History: Church of Pakistan. Intake is reviewed before publication.",
};

export default async function ContributePage() {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow={homepage.page_context.contribute_eyebrow}
        title="Contribute"
        intro={homepage.page_context.contribute_intro}
      />
      <div className="shell pageBody">

        <div className={styles.notice}>
          <strong>{site.pages.contribute_notice.strong}</strong> {site.pages.contribute_notice.body}
        </div>

        <ContributeForm contributionFields={homepage.contribution_fields} />

        <nav className="linkRow" aria-label="Related pages">
          <Link href="/sources">Sources &amp; rights policy</Link>
          <Link href="/about">About the project</Link>
        </nav>
      </div>
    </div>
  );
}
