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

  return (
    <div className={styles.page}>
      <div className="shell">
        <p className="eyebrow">{homepage.page_context.contribute_eyebrow}</p>
        <h1>Contribute</h1>
        <p className={styles.intro}>{homepage.page_context.contribute_intro}</p>

        <div className={styles.notice}>
          <strong>Honest intake status.</strong> This form does not pretend to
          succeed when no backend is configured. If{" "}
          <code>CONTRIBUTE_WEBHOOK_URL</code> is unset, nothing is stored or
          emailed. You will see a clear “not submitted” message.
        </div>

        <ContributeForm contributionFields={homepage.contribution_fields} />

        <p style={{ marginTop: "2rem" }}>
          <Link href="/sources">Sources &amp; rights policy</Link>
          {" · "}
          <Link href="/about">About the project</Link>
        </p>
      </div>
    </div>
  );
}
