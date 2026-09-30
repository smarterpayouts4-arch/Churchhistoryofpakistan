import { loadHomepage } from "@/content/homepage";
import styles from "./Purpose.module.css";

const PURPOSE_ICONS = [
  "/media/icons/pictorial-history.svg",
  "/media/icons/untold-stories.svg",
  "/media/icons/family-memories.svg",
  "/media/icons/honouring-served.svg",
] as const;

export async function Purpose() {
  const homepage = await loadHomepage();

  return (
    <section id="purpose" className="section sectionPaper" aria-labelledby="purpose-heading">
      <div className="shell">
        <div className="sectionHeading sectionHeadingCentered">
          <div className="doubleRule" aria-hidden="true" />
          <p className="eyebrow">Why this archive exists</p>
          <h2 id="purpose-heading">Our Purpose</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ruleOrnament"
            src="/media/textures/rule-ornament.svg"
            alt=""
            width={280}
            height={24}
          />
        </div>
        <div className={styles.purposeGrid}>
          {homepage.purpose_cards.map((card, i) => (
            <article key={card.title} className={styles.purposeCard}>
              <div className={styles.purposeIconPad} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PURPOSE_ICONS[i] ?? PURPOSE_ICONS[0]} alt="" width={40} height={40} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
