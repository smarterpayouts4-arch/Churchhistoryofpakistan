import type { CSSProperties } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import type { CuratorBlock, CuratorPhoto, CuratorSection } from "@/lib/cms/types";
import styles from "./about.module.css";

/** "Parish Committee — Served as …" → bold name, then the rest. */
function ListItem({ text }: { text: string }) {
  const m = /^(.{2,90}?) [—–] (.+)$/s.exec(text);
  if (!m) return <li>{text}</li>;
  return (
    <li>
      <strong>{m[1]}</strong> — {m[2]}
    </li>
  );
}

function StoryPhoto({
  photo,
  fallbackAlt,
  first,
  priority,
}: {
  photo: CuratorPhoto;
  fallbackAlt: string;
  first: boolean;
  priority?: boolean;
}) {
  const w = photo.width ?? 800;
  const h = photo.height ?? 600;
  // Wide panoramas run across the card; other photos sit beside the text.
  const wide = Boolean(photo.width && photo.height && w / h > 1.8);
  const cls = wide ? styles.photoWide : first ? styles.photoLeft : styles.photo;
  // Never stretch a small photo past its own size.
  const style = photo.width && !wide ? ({ "--natural": `${photo.width}px` } as CSSProperties) : undefined;
  return (
    <figure className={cls} style={style}>
      <MediaImage
        src={photo.src}
        alt={photo.alt || fallbackAlt}
        width={w}
        height={h}
        priority={priority}
        sizes={wide ? "(max-width: 760px) 92vw, 1100px" : "(max-width: 760px) 92vw, 420px"}
      />
    </figure>
  );
}

function Block({
  block,
  photos,
  section,
  name,
  first,
}: {
  block: CuratorBlock;
  photos: Map<string, CuratorPhoto>;
  section: CuratorSection;
  name: string;
  first: boolean;
}) {
  if ("p" in block) return <p>{block.p}</p>;
  if ("subheading" in block) return <h4 className={styles.sub}>{block.subheading}</h4>;
  if ("emphasis" in block) return <p className={styles.emphasis}>{block.emphasis}</p>;
  if ("quote" in block) return <blockquote className={styles.quote}>“{block.quote}”</blockquote>;
  if ("list" in block)
    return (
      <ul className={styles.list}>
        {block.list.map((t) => (
          <ListItem key={t.slice(0, 60)} text={t} />
        ))}
      </ul>
    );
  const photo = photos.get(block.photo);
  if (!photo) return null;
  return (
    <StoryPhoto
      photo={photo}
      fallbackAlt={`Photograph: ${name} · ${section.title}`}
      first={first}
      priority={first}
    />
  );
}

/** One part of the life story, with its photo. */
export function StorySection({
  section,
  photos,
  name,
  first = false,
  className,
}: {
  section: CuratorSection;
  photos: Map<string, CuratorPhoto>;
  name: string;
  first?: boolean;
  className?: string;
}) {
  return (
    <article
      id={section.id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-labelledby={`${section.id}-heading`}
    >
      <h3 id={`${section.id}-heading`}>{section.title}</h3>
      {section.blocks.map((b, i) => (
        <Block key={i} block={b} photos={photos} section={section} name={name} first={first} />
      ))}
    </article>
  );
}

export { styles as storyStyles };
