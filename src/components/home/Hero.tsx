import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import { loadFamilyArchiveHomePreview } from "@/content/family-archives";
import { CURATOR_DISPLAY_NAME } from "@/content/nav";
import { MediaImage } from "@/components/ui/MediaImage";
import styles from "./Hero.module.css";

export async function Hero() {
  const [{ hero, strapline }, records] = await Promise.all([loadHomepage(), loadFamilyArchiveHomePreview(1)]);
  const featured = records[0];
  const colon = hero.title.indexOf(":");
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`shell ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow"><span className={styles.statusDot} />{hero.eyebrow}</p>
          <h1 id="hero-title" className={styles.heroTitle} aria-label={hero.title}>
            {colon > 0 ? <><span>{hero.title.slice(0, colon)}</span>{hero.title.slice(colon + 1).trim()}</> : hero.title}
          </h1>
          <p className={styles.lede}>{hero.purpose}</p>
          <div className={styles.actions}>
            <Link className="btn-primary" href="/archive">Explore the archive <span aria-hidden="true">↗</span></Link>
            <Link className={styles.textLink} href="/about">Our story <span aria-hidden="true">→</span></Link>
          </div>
          <Link className={styles.curator} href="/about#profile">
            <MediaImage src={hero.portrait} alt="" width={64} height={64} sizes="48px" />
            <span><small>A personal commitment to preservation</small><strong>Curated by {CURATOR_DISPLAY_NAME}</strong></span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {featured && <figure className={styles.featured}>
          <div className={styles.imageTopline}><span>From the collection</span><span>01 / Family archive</span></div>
          <Link href={`/archive#${featured.id}`} className={styles.photoLink} aria-label={`View ${featured.title}`}>
            <MediaImage src={featured.imageSrc} alt={featured.alt} fill priority sizes="(max-width: 760px) 95vw, 50vw" />
            {featured.dateLabel && <span className={styles.date}>{featured.dateLabel}</span>}
          </Link>
          <figcaption className={styles.caption}><div><strong>{featured.title}</strong><span>{featured.provenance} · Caption from source page</span></div><Link href={`/archive#${featured.id}`} aria-label={`Explore ${featured.title}`}>↗</Link></figcaption>
        </figure>}
      </div>
      <div className={`shell ${styles.heroBottom}`}><p>{strapline}</p><Link href="#archive">Discover the collection <span aria-hidden="true">↓</span></Link></div>
    </section>
  );
}
