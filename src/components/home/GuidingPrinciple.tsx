import { loadHomepage } from "@/content/homepage";
import styles from "./GuidingPrinciple.module.css";

export async function GuidingPrinciple() {
  const homepage = await loadHomepage();

  return (
    <section className={styles.guiding} aria-labelledby="guiding-heading">
      <div className={`shell ${styles.guidingInner}`}>
        <div className="doubleRule" aria-hidden="true" />
        <p className="eyebrow" id="guiding-heading">
          Our Guiding Principle
        </p>
        <blockquote className={styles.guidingQuote}>
          “{homepage.guiding_principle.replace(/\.$/, "")}.”
        </blockquote>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ruleOrnament"
          src="/media/textures/rule-ornament.svg"
          alt=""
          width={280}
          height={24}
        />
        <p className={styles.guidingNote}>{homepage.page_context.guiding_note}</p>
      </div>
    </section>
  );
}
