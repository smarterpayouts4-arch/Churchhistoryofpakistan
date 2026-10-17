import { loadHomepage } from "@/content/homepage";
import styles from "./GuidingPrinciple.module.css";

export async function GuidingPrinciple() {
  const homepage = await loadHomepage();

  return (
    <section className={styles.guiding} aria-labelledby="guiding-heading">
      <div className={`shell ${styles.guidingInner}`}>
        <span className={styles.guidingMark} aria-hidden="true">
          ❝
        </span>
        <p className="eyebrow" id="guiding-heading">
          Our Guiding Principle
        </p>
        <blockquote className={styles.guidingQuote}>
          “{homepage.guiding_principle.replace(/\.$/, "")}.”
        </blockquote>
        <p className={styles.guidingNote}>{homepage.page_context.guiding_note}</p>
      </div>
    </section>
  );
}
