import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { getMediaInspectItems, type MediaInspectItem } from "@/lib/media-inspect";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "Inspect media | Curator admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function RiskBadge({ risk }: { risk: MediaInspectItem["cropRisk"] }) {
  const riskClass =
    risk === "high"
      ? styles.riskHigh
      : risk === "medium"
        ? styles.riskMedium
        : styles.riskLow;
  return <span className={`${styles.riskBadge} ${riskClass}`}>{risk}</span>;
}

function Thumbnail({ item }: { item: MediaInspectItem }) {
  if (item.mediaKind === "video") {
    return (
      <video
        className={styles.inspectThumb}
        src={item.publicPath}
        poster={item.posterPath}
        muted
        playsInline
        preload="metadata"
        aria-label={item.title}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.inspectThumb} src={item.publicPath} alt="" />;
}

export default async function MediaInspectPage() {
  const session = await requireAdminPage();
  const items = await getMediaInspectItems();
  const highRisk = items.filter((item) => item.cropRisk === "high").length;
  const missing = items.filter((item) => !item.exists).length;

  return (
    <div className={styles.wrap}>
      <div className="shell">
        <div className={styles.adminNav}>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>
              Curator admin
            </p>
            <h1 style={{ margin: "0.2rem 0 0" }}>Inspect media</h1>
            <p className={styles.hint} style={{ marginTop: "0.35rem" }}>
              Signed in as {session.sub} · read-only visual fit review
            </p>
          </div>
          <span className={styles.spacer} />
          <Link className={styles.secondaryLink} href="/admin">
            Back to dashboard
          </Link>
          <LogoutButton />
        </div>

        <section className={styles.inspectSummary} aria-label="Media inspection summary">
          <div>
            <strong>{items.length}</strong>
            <span>published media paths</span>
          </div>
          <div>
            <strong>{highRisk}</strong>
            <span>high crop risk</span>
          </div>
          <div>
            <strong>{missing}</strong>
            <span>missing local files</span>
          </div>
        </section>

        <p className={styles.inspectNote}>
          Recommendation rule: use <strong>contain</strong> when the native and card
          aspect ratios differ by more than 0.25, or when portrait/landscape
          orientation mismatches. This board is read-only; use the existing
          Churches, Family Archives, Featured Interviews, or Media tabs to edit.
        </p>

        <div className={styles.inspectTableWrap}>
          <table className={`${styles.table} ${styles.inspectTable}`}>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Record</th>
                <th>Source</th>
                <th>Native vs card</th>
                <th>Fit</th>
                <th>Crop risk</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.sourceClass}-${item.id}-${item.publicPath}`}>
                  <td>
                    <div className={styles.inspectThumbFrame}>
                      {item.exists ? <Thumbnail item={item} /> : <span>Missing</span>}
                    </div>
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                    <div className={styles.hint}>{item.id}</div>
                    <code className={styles.mediaPath}>{item.publicPath}</code>
                  </td>
                  <td>
                    <span className={styles.sourceChip}>{item.sourceClass}</span>
                    <div className={styles.hint}>{item.mediaKind}</div>
                  </td>
                  <td>
                    <strong>
                      {item.nativeWidth && item.nativeHeight
                        ? `${item.nativeWidth}×${item.nativeHeight}`
                        : "Unreadable"}
                    </strong>
                    <div className={styles.hint}>
                      {item.nativeAspect ? item.nativeAspect.toFixed(3) : "n/a"} vs {" "}
                      {item.cardAspect.toFixed(3)} ({item.cardAspectLabel})
                    </div>
                    <div className={styles.hint}>Native: {item.nativeOrientation}</div>
                    {item.storedOrientation ? (
                      <div className={styles.hint}>
                        CMS orientation: {item.storedOrientation}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <strong className={styles.fitLabel}>{item.fitRecommendation}</strong>
                  </td>
                  <td>
                    <RiskBadge risk={item.cropRisk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
