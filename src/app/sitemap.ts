import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { loadPublishedBlogPosts } from "@/content/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl().replace(/\/$/, "");
  const routes = ["", "/about", "/archive", "/interviews", "/churches", "/people", "/sources", "/contribute", "/blog"];
  const posts = await loadPublishedBlogPosts().catch(() => []);
  return [
    ...routes.map((r) => ({ url: `${base}${r || "/"}`, changeFrequency: "monthly" as const, priority: r === "" ? 1 : 0.7 })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
