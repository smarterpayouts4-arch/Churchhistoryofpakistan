import type { Metadata } from "next";
import Link from "next/link";
import { loadHomepage } from "@/content/homepage";
import { loadCuratorProfile } from "@/content/curator-profile";
import { CURATOR_ROLE_LINE } from "@/content/nav";
import {
  ConnectionBulletList,
  ConnectionLayout,
} from "@/components/ui/ConnectionLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import styles from "../pages.module.css";
import homeStyles from "@/components/home/MyConnection.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "About History: Church of Pakistan and founder-curator Javed Qadir Bakhsh · public service, Church leadership, and preserving history for coming generations.",
};

export default async function AboutPage() {
  const [homepage, curator] = await Promise.all([
    loadHomepage(),
    loadCuratorProfile(),
  ]);
  const bullets = homepage.connection.slice(0, 3);
  const pull = homepage.connection[3];
  const { profile: p, source: CURATOR_PROFILE_SOURCE } = curator;

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="About the project"
        title="About"
        intro={
            <>
              {homepage.hero.intro} {homepage.hero.purpose}
            </>
          }
      />
      <div className="shell pageBody">

        <section
          id="profile"
          aria-labelledby="profile-heading"
          style={{ marginBottom: "3rem" }}
        >
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 id="profile-heading">{p.name}</h2>
          <p className={styles.intro} style={{ marginTop: "0.35rem" }}>
            {p.headline}
          </p>

          <ConnectionLayout
            portraitSrc={homepage.hero.portrait}
            style={{ marginTop: "1.5rem" }}
          >
            {p.introduction.map((para) => (
              <p key={para.slice(0, 48)} style={{ marginBottom: "0.85rem" }}>
                {para}
              </p>
            ))}
            <blockquote className={homeStyles.connectionPull}>
              “{p.guidingPrinciple}”
            </blockquote>
            <p className={homeStyles.connectionMeta} style={{ marginTop: "0.75rem" }}>
              {CURATOR_ROLE_LINE}
            </p>
          </ConnectionLayout>

          <div className={styles.grid} style={{ marginTop: "2rem" }}>
            {p.themes.map((theme) => (
              <article key={theme.title} className={styles.card}>
                <h3 style={{ marginTop: 0 }}>{theme.title}</h3>
                <p>{theme.copy}</p>
              </article>
            ))}
          </div>

          <article className={styles.card} style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>{p.education.title}</h3>
            {p.education.body.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </article>

          <article className={styles.card} style={{ marginTop: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>{p.publicService.title}</h3>
            {p.publicService.body.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </article>

          <article className={styles.card} style={{ marginTop: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>{p.churchService.title}</h3>
            <p>{p.churchService.intro}</p>
            <ul>
              {p.churchService.roles.map((role) => (
                <li key={role.slice(0, 48)} style={{ marginBottom: "0.45rem" }}>
                  {role}
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.card} style={{ marginTop: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>{p.historyMission.title}</h3>
            {p.historyMission.body.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </article>

          <article className={styles.card} style={{ marginTop: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>{p.digitalWork.title}</h3>
            {p.digitalWork.body.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </article>

          <article className={styles.card} style={{ marginTop: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>{p.legacy.title}</h3>
            <p>{p.legacy.body}</p>
            <blockquote className={homeStyles.connectionPull} style={{ marginTop: "1rem" }}>
              “{p.conviction}”
            </blockquote>
            <p style={{ marginTop: "0.75rem", fontWeight: 700, color: "var(--color-burgundy)" }}>
              {p.closingLine}
            </p>
            <p className={homeStyles.connectionMeta} style={{ marginTop: "1rem" }}>
              Source: {CURATOR_PROFILE_SOURCE}
            </p>
          </article>
        </section>

        <div className={styles.grid} style={{ marginBottom: "3rem" }}>
          <div className={styles.card}>
            <h2>Our Purpose</h2>
            <ul>
              {homepage.purpose_cards.map((card) => (
                <li key={card.title} style={{ marginBottom: "1rem" }}>
                  <strong>{card.title}</strong>
                  <br />
                  {card.copy}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2>My Connection to the Church</h2>
        <ConnectionLayout
          portraitSrc={homepage.hero.portrait}
          style={{ marginTop: "1.5rem" }}
        >
          <ConnectionBulletList bullets={bullets} pullQuote={pull} />
          <p style={{ marginTop: "1.25rem" }}>
            <Link href="/contribute">Contribute a memory</Link>
            {" · "}
            <Link href="/sources">View sources</Link>
            {" · "}
            <Link href="/about#profile">Curator profile</Link>
          </p>
        </ConnectionLayout>
      </div>
    </div>
  );
}
