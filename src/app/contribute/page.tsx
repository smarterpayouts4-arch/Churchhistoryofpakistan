import type { Metadata } from "next";
import Link from "next/link";
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
  const homepage = await loadHomepage();

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow={homepage.page_context.contribute_eyebrow}
        title="Contribute"
        intro={homepage.page_context.contribute_intro}
      />
      <div className="shell pageBody">

        <div className={styles.notice}>
          <strong>Honest intake status.</strong> This form never pretends to
          succeed. While online intake is not yet connected, nothing you enter is
          stored or emailed, and you will see a clear “not submitted” message.
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
