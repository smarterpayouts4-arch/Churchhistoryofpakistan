import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Blog body is authored in Markdown in the admin. It is rendered with
 * marked, then sanitised with an allow-list — raw HTML from the editor
 * can never inject scripts, event handlers, or iframes into a page.
 */
export function renderMarkdown(body: string): string {
  const raw = marked.parse(body ?? "", { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags: [
      "p", "h2", "h3", "h4", "strong", "em", "a", "ul", "ol", "li",
      "blockquote", "img", "hr", "br", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href && /^https?:\/\//i.test(attribs.href)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {}),
        },
      }),
    },
  });
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "post";
}
