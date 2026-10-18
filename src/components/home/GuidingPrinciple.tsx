import { loadHomepage } from "@/content/homepage";
import { loadSiteSettings } from "@/content/site";
import styles from "./GuidingPrinciple.module.css";

export async function GuidingPrinciple() {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);

  return (
    <section className={styles.guiding} aria-labelledby="guiding-heading">
      <div className={`shell ${styles.guidingInner}`}>
        <span className={styles.guidingMark} aria-hidden="true">
          ❝
        </span>
        <p className="eyebrow" id="guiding-heading">
          {site.home_sections.guiding.eyebrow}
        </p>
        <blockquote className={styles.guidingQuote}>
          “{homepage.guiding_principle.replace(/\.$/, "")}.”
        </blockquote>
        <p className={styles.guidingNote}>{homepage.page_context.guiding_note}</p>
      </div>
    </section>
  );
}
