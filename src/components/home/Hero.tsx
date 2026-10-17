import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import { CURATOR_DISPLAY_NAME, CURATOR_ROLE_LINE } from "@/content/nav";
import { MediaImage } from "@/components/ui/MediaImage";
import styles from "./Hero.module.css";

export async function Hero() {
  const { hero, strapline, guiding_principle } = await loadHomepage();
  const colonIdx = hero.title.indexOf(":");
  const strapParts = strapline
    .split(/\s*[·•]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`shell ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow eyebrowLight">{hero.eyebrow}</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            {colonIdx > 0 ? (
              <>
                <span className={styles.titleLead}>{hero.title.slice(0, colonIdx + 1)}</span>
                <span className={styles.titleMain}>{hero.title.slice(colonIdx + 1).trim()}</span>
              </>
            ) : (
              hero.title
            )}
          </h1>
          <p className={styles.strapline}>
            {strapParts.map((part, i) => (
              <span key={part}>
                {i > 0 ? (
                  <span className={styles.strapDot} aria-hidden="true">
                    ✦
                  </span>
                ) : null}
                {i > 0 ? " " : null}
                {part}
              </span>
            ))}
          </p>
          <p className={styles.lede}>{hero.intro}</p>
          <p className={styles.purpose}>{hero.purpose}</p>
          <div className={styles.actions}>
            <Link className="btn-primary btn-gilt" href="/archive">
              Explore the Archive <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn-secondary btn-ghost-light" href="/interviews">
              Watch Interviews
            </Link>
          </div>
        </div>
        <div className={styles.portraitWrap}>
          <div className={styles.arch}>
            <div className={styles.heroPortraitFrame}>
              <MediaImage
                className={styles.heroPortrait}
                src={hero.portrait}
                alt={`Portrait of ${CURATOR_DISPLAY_NAME}`}
                width={1122}
                height={1402}
                priority
                sizes="(max-width: 760px) 90vw, 440px"
              />
            </div>
          </div>
          <div className={styles.portraitLabel}>
            <strong>{CURATOR_DISPLAY_NAME}</strong>
            <span>{CURATOR_ROLE_LINE}</span>
          </div>
        </div>
      </div>
      <div className="shell">
        <blockquote className={styles.quote}>
          “{guiding_principle.replace(/\.$/, "")}.”
        </blockquote>
      </div>
    </section>
  );
}
