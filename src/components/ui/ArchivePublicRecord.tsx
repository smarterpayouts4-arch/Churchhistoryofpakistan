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
    <aside className={styles.archivePublicRecord} aria-label="Public record and press">
      <p className={styles.archivePublicRecordLabel}>Public record / press</p>
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
    </aside>
  );
}
