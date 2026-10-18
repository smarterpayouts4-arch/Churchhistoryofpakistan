import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadSiteSettings } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default async function NotFound() {
  const site = await loadSiteSettings();
  const copy = site.pages.not_found;
  return (
    <div>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />
      <div className="shell pageBody">
        <p
          aria-hidden="true"
          style={{
            margin: "0 0 1rem",
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
            fontWeight: 300,
            fontSize: "clamp(5rem, 18vw, 9rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "var(--gilt-ink)",
            opacity: 0.35,
          }}
        >
          404
        </p>
        <nav className="linkRow" aria-label="Helpful links" style={{ marginTop: 0 }}>
          <Link href="/">{copy.home_label}</Link>
          <Link href="/archive">{copy.archive_label}</Link>
          <Link href="/sources">{copy.sources_label}</Link>
        </nav>
      </div>
    </div>
  );
}
