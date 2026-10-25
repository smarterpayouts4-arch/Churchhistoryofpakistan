/** Blog posts — loaded through the shared CMS storage adapter. */
import { readCmsPublic } from "@/lib/cms/store";
import type { BlogFile, BlogPost } from "@/lib/cms/types";

export type { BlogPost };

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function loadAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = (await readCmsPublic("blog.json")) as BlogFile;
    return sortPosts(data.posts ?? []);
  } catch {
    return [];
  }
}

export async function loadPublishedBlogPosts(): Promise<BlogPost[]> {
  return (await loadAllBlogPosts()).filter((p) => p.status === "published");
}

export async function loadBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadPublishedBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function loadRelatedBlogPosts(post: BlogPost, count = 3): Promise<BlogPost[]> {
  const posts = await loadPublishedBlogPosts();
  const others = posts.filter((p) => p.id !== post.id);
  const shared = others.filter((p) => p.tags.some((t) => post.tags.includes(t)));
  const rest = others.filter((p) => !shared.includes(p));
  return [...shared, ...rest].slice(0, count);
}
