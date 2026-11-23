import type { FeaturedInterview } from "@/lib/cms/types";
import type { MediaMeta } from "@/lib/media/meta";
import { InterviewCard } from "./InterviewCard";
import styles from "./Interviews.module.css";

/**
 * The interview video grid shared by the home section and /interviews.
 * One video gets the wide "featured" layout; the grid adapts by count.
 */
export function InterviewGrid({
  items,
  meta,
  headingLevel,
  style,
}: {
  items: FeaturedInterview[];
  meta: Map<string, MediaMeta>;
  headingLevel?: "h2" | "h3";
  style?: React.CSSProperties;
}) {
  if (!items.length) return null;
  return (
    <div className={styles.videoGrid} data-count={items.length} style={style}>
      {items.map((item) => {
        const poster = item.coverSrc || item.posterSrc;
        return (
          <InterviewCard
            key={item.id}
            headingLevel={headingLevel}
            featured={items.length === 1}
            eyebrow="Rab Ki Khidmat"
            title={item.title}
            description={item.copy}
            speaker={item.speaker}
            durationSeconds={item.durationSeconds}
            videoSrc={item.videoSrc}
            posterSrc={poster}
            posterBlur={meta.get(poster)?.blur}
            coverPosition={item.coverPosition}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sourceUrl={item.sourceUrl}
            provenance={item.provenance}
            captionsSrc={item.captionsSrc}
            transcript={item.transcript}
          />
        );
      })}
    </div>
  );
}
