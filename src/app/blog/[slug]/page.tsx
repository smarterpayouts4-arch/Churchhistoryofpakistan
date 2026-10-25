import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/ui/MediaImage";
import { loadBlogPostBySlug, loadRelatedBlogPosts } from "@/content/blog";
import { renderMarkdown } from "@/lib/blog/markdown";
import styles from "../../pages.module.css";
import blog from "../blog.module.css";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadBlogPostBySlug(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      ...(post.coverSrc ? { images: [{ url: post.coverSrc, alt: post.coverAlt || post.title }] } : {}),
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await loadBlogPostBySlug(slug);
  if (!post) notFound();
  const related = await loadRelatedBlogPosts(post);
  const html = renderMarkdown(post.body);

  return (
    <div className={styles.page}>
      <div className="shell pageBody">
        <article className={blog.article}>
          <p className="eyebrow">Blog</p>
          <h1 style={{ fontFamily: "var(--font-display)", lineHeight: 1.1 }}>{post.title}</h1>
          <p className={blog.articleMeta}>By {post.author} · {formatDate(post.date)}</p>
          {post.coverSrc ? (
            <div className={blog.heroMedia}>
              <MediaImage src={post.coverSrc} alt={post.coverAlt || post.title} fill priority sizes="(max-width: 800px) 100vw, 736px" style={{ objectFit: "cover" }} />
            </div>
          ) : null}
          {post.tags.length ? (
            <ul className={blog.tags}>{post.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          ) : null}
          <div className={blog.body} dangerouslySetInnerHTML={{ __html: html }} />
          {related.length ? (
            <section className={blog.related} aria-labelledby="related-heading">
              <h2 id="related-heading" style={{ fontFamily: "var(--font-display)" }}>Related stories</h2>
              <div className={blog.grid}>
                {related.map((r) => (
                  <Link key={r.id} href={`/blog/${r.slug}`} className={blog.card}>
                    {r.coverSrc ? <div className={blog.media}><MediaImage src={r.coverSrc} alt={r.coverAlt || r.title} fill sizes="(max-width: 640px) 50vw, 400px" style={{ objectFit: "cover" }} /></div> : null}
                    <div className={blog.cardBody}>
                      <p className={blog.meta}>{formatDate(r.date)}</p>
                      <h3 className={blog.cardTitle}>{r.title}</h3>
                      <p className={blog.excerpt}>{r.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          <nav className="linkRow" aria-label="Related pages" style={{ marginTop: "2rem" }}>
            <Link href="/blog">All blog posts</Link>
            <Link href="/archive">Enter the Archive</Link>
            <Link href="/contribute">Share Your Story</Link>
          </nav>
        </article>
      </div>
    </div>
  );
}
