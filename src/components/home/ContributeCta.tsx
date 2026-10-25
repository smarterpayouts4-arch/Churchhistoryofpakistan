import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import styles from "./ContributeCta.module.css";

export async function ContributeCta() {
  const { page_context: copy } = await loadHomepage();

  return (
    <section id="contribute" className={styles.contribute} aria-labelledby="contribute-heading">
      <div className={`shell ${styles.contributeInner}`}>
        <div className={styles.contributeCopy}>
          <p className="eyebrow eyebrowLight">{copy.contribute_eyebrow}</p>
          <h2 id="contribute-heading">{copy.contribute_heading}</h2>
          <p>{copy.contribute_copy}</p>
        </div>
        <div className={styles.contributeAside}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.contributeMark}
            src="/media/brand/archive-cross-mark.svg"
            alt=""
            width={72}
            height={72}
          />
          <Link className={`btn-primary btn-gilt ${styles.btnCream}`} href="/contribute">
            {copy.contribute_button} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
