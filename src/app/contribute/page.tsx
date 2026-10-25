import type { Metadata } from "next";
import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import { ContributeForm } from "./ContributeForm";
import styles from "../pages.module.css";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Share photographs, documents, and family memories for History: Church of Pakistan. Intake is reviewed before publication.",
};

export default async function ContributePage() {
  const homepage = await loadHomepage();
  const intakeEnabled = Boolean(process.env.CONTRIBUTE_WEBHOOK_URL);

  return (
    <div className={styles.page}>
      <div className="shell">
        <p className="eyebrow">{homepage.page_context.contribute_eyebrow}</p>
        <h1>Contribute</h1>
        <p className={styles.intro}>{homepage.page_context.contribute_intro}</p>

        <div className={styles.notice}>
          {intakeEnabled ? (
            <><strong>Before you contribute.</strong> Please include the source of your material and confirm that you have permission to share it. Submissions are reviewed before publication.</>
          ) : (
            <><strong>Online contributions are not open yet.</strong> Please check back before sending photographs, documents, or personal information. You can still explore the archive and learn about the project below.</>
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
