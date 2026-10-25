import { loadPublishedBlogPosts } from "@/content/blog";
import { siteUrl } from "@/lib/site";
import { loadHomepage } from "@/content/homepage";

export const runtime = "nodejs";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const base = siteUrl().replace(/\/$/, "");
  const [posts, homepage] = await Promise.all([
    loadPublishedBlogPosts().catch(() => []),
    loadHomepage().catch(() => null),
  ]);
  const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>
      <description>${esc(p.excerpt)}</description>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <author>${esc(p.author)}</author>
    </item>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(homepage?.site_title ?? "History: Church of Pakistan")} — Blog</title>
    <link>${base}/blog</link>
    <description>Stories and reflections from the Church of Pakistan history archive.</description>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
