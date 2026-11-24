import type { FamilyArchiveItem } from "@/lib/cms/types";
import styles from "@/components/home/FamilyArchives.module.css";

type Props = {
  item: Pick<FamilyArchiveItem, "contextNote" | "references">;
};

/**
 * Sourced public-record / press context under a Family Archive caption.
 * Renders only when contextNote or references are present; never invents copy.
 */
export function ArchivePublicRecord({ item }: Props) {
  const note = item.contextNote?.trim();
  const refs = item.references?.filter((r) => r.label?.trim() && r.url?.trim()) ?? [];
  if (!note && refs.length === 0) return null;

  return (
    // Collapsed by default so the gallery stays scannable (and short on phones);
    // one tap opens the sourced note and links.
    <details className={styles.archivePublicRecord}>
      <summary className={styles.archivePublicRecordLabel}>
        Public record / press{refs.length > 0 ? ` · ${refs.length} ${refs.length === 1 ? "link" : "links"}` : ""}
      </summary>
      {note ? <p className={styles.archivePublicRecordNote}>{note}</p> : null}
      {refs.length > 0 ? (
        <ul className={styles.archivePublicRecordRefs}>
          {refs.map((ref) => (
            <li key={ref.url}>
              <a className="tapLink" href={ref.url} rel="noopener noreferrer">
                {ref.label}
              </a>
              {ref.note ? (
                <span className={styles.archivePublicRecordRefNote}> · {ref.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </details>
  );
}
