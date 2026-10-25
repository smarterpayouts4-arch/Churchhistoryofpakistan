import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { MediaImage } from "@/components/ui/MediaImage";
import { loadPublishedBlogPosts } from "@/content/blog";
import styles from "../pages.module.css";
import blog from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, reflections and updates from the Church of Pakistan history archive.",
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await loadPublishedBlogPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="From the archive"
        title="Blog"
        intro="Stories, reflections and news from the work of preserving the memory of the Church of Pakistan — written only when there is something true to share."
      />
      <div className="shell pageBody">
        {posts.length === 0 ? (
          <div className={blog.empty}>
            <p className="eyebrow">The journal begins soon</p>
            <h2>First stories are being prepared</h2>
            <p>When the curator publishes the first article, it will appear here. Until then, explore the photographs, interviews and family records in the archive.</p>
            <p><Link className="tapLink" href="/archive">Enter the Archive</Link> · <Link className="tapLink" href="/contribute">Share Your Story</Link></p>
          </div>
        ) : (
          <div className={blog.grid}>
            {featured ? (
              <Link key={featured.id} href={`/blog/${featured.slug}`} className={`${blog.card} ${blog.featured}`}>
                {featured.coverSrc ? (
                  <div className={blog.media}><MediaImage src={featured.coverSrc} alt={featured.coverAlt || featured.title} fill sizes="100vw" style={{ objectFit: "cover" }} /></div>
                ) : null}
                <div className={blog.cardBody}>
                  <p className={blog.meta}>{featured.author} · {formatDate(featured.date)}</p>
                  <h2 className={blog.cardTitle}>{featured.title}</h2>
                  <p className={blog.excerpt}>{featured.excerpt}</p>
                </div>
              </Link>
            ) : null}
            {rest.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={blog.card}>
                {post.coverSrc ? (
                  <div className={blog.media}><MediaImage src={post.coverSrc} alt={post.coverAlt || post.title} fill sizes="(max-width: 640px) 50vw, 400px" style={{ objectFit: "cover" }} /></div>
                ) : null}
                <div className={blog.cardBody}>
                  <p className={blog.meta}>{post.author} · {formatDate(post.date)}</p>
                  <h2 className={blog.cardTitle}>{post.title}</h2>
                  <p className={blog.excerpt}>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
