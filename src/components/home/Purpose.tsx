import { loadHomepage } from "@/content/homepage";
import { loadSiteSettings } from "@/content/site";
import styles from "./Purpose.module.css";

const PURPOSE_ICONS = [
  "/media/icons/pictorial-history.svg",
  "/media/icons/untold-stories.svg",
  "/media/icons/family-memories.svg",
  "/media/icons/honouring-served.svg",
] as const;

export async function Purpose() {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);

  return (
    <section id="purpose" className="section" aria-labelledby="purpose-heading">
      <div className="shell">
        <div className={`sectionHeading ${styles.purposeHeading}`}>
          <p className="eyebrow">{site.home_sections.purpose.eyebrow}</p>
          <h2 id="purpose-heading">{site.home_sections.purpose.heading}</h2>
        </div>
        <p className={styles.purposeIntro}>{homepage.hero.purpose}</p>
        <ol className={styles.purposeGrid}>
          {homepage.purpose_cards.map((card, i) => (
            <li key={card.title} className={styles.purposeCard}>
              <div className={styles.purposeTop}>
                <span className={styles.purposeNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.purposeIconPad} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={PURPOSE_ICONS[i] ?? PURPOSE_ICONS[0]} alt="" width={28} height={28} />
                </span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
