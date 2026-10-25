"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/cms/types";
import { slugify } from "@/lib/blog/markdown-client";
import { ImageCropUpload } from "./ImageCropUpload";
import styles from "@/app/admin/admin.module.css";

type Props = {
  initialPosts: BlogPost[];
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
};

function blankPost(): BlogPost {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `post-${Date.now().toString(36)}`,
    title: "",
    slug: "",
    excerpt: "",
    coverSrc: "",
    coverAlt: "",
    body: "",
    author: "",
    date: today,
    tags: [],
    status: "draft",
    featured: false,
  };
}

export function BlogEditor({ initialPosts, pending, setPending, setMessage, setError }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [editingId, setEditingId] = useState<string | null>(initialPosts[0]?.id ?? null);
  const editing = posts.find((p) => p.id === editingId) ?? null;

  function patch(id: string, patch: Partial<BlogPost>) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function newPost() {
    const post = blankPost();
    setPosts((prev) => [post, ...prev]);
    setEditingId(post.id);
    setMessage("New draft started — fill it in, then press Save blog posts.");
    setError(null);
  }

  function remove(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) setEditingId(null);
  }

  async function save() {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; data?: { posts: BlogPost[] } };
      if (!res.ok || !data.data) {
        setError(data.error || "Blog save failed. Check every post has a title, slug, excerpt, author, date and body.");
        return;
      }
      setPosts(data.data.posts);
      setMessage("Blog posts saved. Published posts are now live; drafts stay hidden.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="blog-heading">
      <h2 id="blog-heading">Blog</h2>
      <p className={styles.hint}>
        Write in Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>*italic*</code>,{" "}
        <code>&gt; pull-quote</code>, <code>- list</code>, <code>[link text](https://…)</code>. Raw HTML is
        stripped for safety. Drafts never appear on the public site. Only mark a post Featured when you want
        it shown large at the top of /blog (the newest published post is shown large automatically).
      </p>
      <div className={styles.form} style={{ marginTop: "1rem" }}>
        <div className={styles.rowActions}>
          <button type="button" className={styles.primaryBtn} onClick={newPost} disabled={pending}>+ New post</button>
          <button type="button" className={styles.secondaryBtn} onClick={save} disabled={pending}>Save blog posts</button>
        </div>

        {posts.length === 0 ? (
          <p className={styles.hint}>No posts yet. Press “+ New post” to write the first one.</p>
        ) : (
          <div className={styles.form}>
            {posts.map((post) => (
              <article key={post.id} className={styles.panel}>
                <div className={styles.rowActions} style={{ justifyContent: "space-between" }}>
                  <strong>{post.title || "(untitled draft)"}</strong>
                  <span className={styles.hint}>{post.status}{post.featured ? " · featured" : ""} · /blog/{post.slug || "—"}</span>
                </div>
                <div className={styles.rowActions} style={{ marginTop: ".6rem" }}>
                  <button type="button" className={styles.secondaryBtn} onClick={() => setEditingId(editingId === post.id ? null : post.id)}>
                    {editingId === post.id ? "Close" : "Edit"}
                  </button>
                  <button type="button" className={styles.dangerBtn} onClick={() => remove(post.id)}>Delete</button>
                </div>

                {editing && editing.id === post.id ? (
                  <div className={styles.form} style={{ marginTop: "1rem" }}>
                    <label className={styles.label}>Title
                      <input className={styles.input} value={editing.title} onChange={(e) => {
                        const title = e.target.value;
                        patch(editing.id, { title, slug: editing.slug && editing.slug !== slugify(editing.title) ? editing.slug : slugify(title) });
                      }} />
                    </label>
                    <label className={styles.label}>Slug (web address, auto-filled from title)
                      <input className={styles.input} value={editing.slug} onChange={(e) => patch(editing.id, { slug: slugify(e.target.value) })} />
                    </label>
                    <label className={styles.label}>Excerpt (short summary for cards & search)
                      <textarea className={styles.textarea} value={editing.excerpt} onChange={(e) => patch(editing.id, { excerpt: e.target.value })} />
                    </label>
                    <label className={styles.label}>Cover image path or URL (use a wide photo at least 1200px across so it stays sharp)
                      <input className={styles.input} value={editing.coverSrc} onChange={(e) => patch(editing.id, { coverSrc: e.target.value })} placeholder="/media/… or https://…blob.vercel-storage.com/…" />
                    </label>
                    <ImageCropUpload destination="uploads" onUploaded={(path) => patch(editing.id, { coverSrc: path })} />
                    <label className={styles.label}>Cover image alt text
                      <input className={styles.input} value={editing.coverAlt} onChange={(e) => patch(editing.id, { coverAlt: e.target.value })} />
                    </label>
                    <div className={styles.grid2}>
                      <label className={styles.label}>Author
                        <input className={styles.input} value={editing.author} onChange={(e) => patch(editing.id, { author: e.target.value })} />
                      </label>
                      <label className={styles.label}>Date
                        <input className={styles.input} type="date" value={editing.date} onChange={(e) => patch(editing.id, { date: e.target.value })} />
                      </label>
                    </div>
                    <label className={styles.label}>Tags (comma-separated)
                      <input className={styles.input} value={editing.tags.join(", ")} onChange={(e) => patch(editing.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
                    </label>
                    <label className={styles.label}>Body (Markdown)
                      <textarea className={styles.textarea} style={{ minHeight: "16rem" }} value={editing.body} onChange={(e) => patch(editing.id, { body: e.target.value })} />
                    </label>
                    <div className={styles.grid2}>
                      <label className={styles.label}>Status
                        <select className={styles.select} value={editing.status} onChange={(e) => patch(editing.id, { status: e.target.value as BlogPost["status"] })}>
                          <option value="draft">Draft — hidden</option>
                          <option value="published">Published — live</option>
                        </select>
                      </label>
                      <label className={styles.label}>Featured
                        <select className={styles.select} value={editing.featured ? "yes" : "no"} onChange={(e) => patch(editing.id, { featured: e.target.value === "yes" })}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
        <button type="button" className={styles.primaryBtn} disabled={pending} onClick={save}>Save blog posts</button>
      </div>
    </section>
  );
}
