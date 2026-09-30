import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import { CURATOR_DISPLAY_NAME, CURATOR_ROLE_LINE } from "@/content/nav";
import { MediaImage } from "@/components/ui/MediaImage";
import styles from "./Hero.module.css";

export async function Hero() {
  const { hero, strapline, guiding_principle } = await loadHomepage();
  const colonIdx = hero.title.indexOf(":");

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`shell ${styles.heroGrid}`}>
        <div className={styles.portraitWrap}>
          <div className={styles.heroPortraitFrame}>
            <MediaImage
              className={styles.heroPortrait}
              src={hero.portrait}
              alt={`Portrait of ${CURATOR_DISPLAY_NAME}`}
              width={1122}
              height={1402}
              priority
              sizes="(max-width: 760px) 90vw, 40vw"
            />
          </div>
          <div className={styles.portraitLabel}>
            <strong>{CURATOR_DISPLAY_NAME}</strong>
            <span>{CURATOR_ROLE_LINE}</span>
          </div>
        </div>
        <div className={styles.heroCopy}>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            {colonIdx > 0 ? (
              <>
                {hero.title.slice(0, colonIdx + 1)}
                <br />
                {hero.title.slice(colonIdx + 1).trim()}
              </>
            ) : (
              hero.title
            )}
          </h1>
          <p className={styles.strapline}>{strapline}</p>
          <p className={styles.lede}>{hero.intro}</p>
          <p>{hero.purpose}</p>
          <div className={styles.actions}>
            <Link className="btn-primary" href="/archive">
              Explore the Archive
            </Link>
            <Link className="btn-secondary" href="/interviews">
              Watch Interviews
            </Link>
          </div>
          <blockquote className={styles.quote}>
            “{guiding_principle.replace(/\.$/, "")}.”
          </blockquote>
        </div>
      </div>
    </section>
  );
}
