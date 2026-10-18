import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import { loadSiteSettings } from "@/content/site";
import { loadFamilyArchiveHomePreview } from "@/content/family-archives";
import { MediaImage } from "@/components/ui/MediaImage";
import styles from "./Hero.module.css";

/**
 * Clean typographic hero (Oct 2026, owner steer): eyebrow, title, motto,
 * ONE short lead, two CTAs, then a quiet archival image band.
 * The curator portrait lives in My Connection only; hero.portrait stays
 * in the CMS for that section. The longer purpose paragraph renders as
 * the Purpose section intro (see Purpose.tsx) — nothing is deleted.
 */
export async function Hero() {
  const [{ hero, strapline }, site, band] = await Promise.all([
    loadHomepage(),
    loadSiteSettings(),
    loadFamilyArchiveHomePreview(3).catch(() => []),
  ]);
  const colonIdx = hero.title.indexOf(":");
  const strapParts = strapline
    .split(/\s*[·•]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className="shell">
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
          <div className={styles.actions}>
            <Link className="btn-primary btn-gilt" href={site.hero_ctas.primary_href}>
              {site.hero_ctas.primary_label} <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn-secondary btn-ghost-light" href={site.hero_ctas.secondary_href}>
              {site.hero_ctas.secondary_label}
            </Link>
          </div>
        </div>

        {band.length ? (
          <div className={styles.band} aria-hidden="true">
            {band.map((item) => (
              <div key={item.id} className={styles.bandItem}>
                <MediaImage
                  src={item.imageSrc}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, 400px"
                  className={styles.bandImg}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
