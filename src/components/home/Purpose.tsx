import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import styles from "./Purpose.module.css";

export async function Purpose() {
  const homepage = await loadHomepage();
  return (
    <section id="purpose" className={`section ${styles.purpose}`} aria-labelledby="purpose-heading">
      <div className={`shell ${styles.layout}`}>
        <div className={styles.introduction}>
          <p className="eyebrow">Why we preserve</p>
          <h2 id="purpose-heading">Our past.<br /><em>Their future.</em></h2>
          <p>{homepage.hero.intro}</p>
          <Link className="sectionLink" href="/about">The story behind the archive ↗</Link>
        </div>
        <div className={styles.purposeGrid}>
          {homepage.purpose_cards.map((card, i) => (
            <article key={card.title} className={styles.purposeCard}>
              <span className={styles.number}>0{i + 1}</span>
              <div><h3>{card.title}</h3><p>{card.copy}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
