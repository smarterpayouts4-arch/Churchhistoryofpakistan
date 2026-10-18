import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div>
      <PageHeader
        eyebrow="Error 404"
        title="Page not found"
        intro="The page you were looking for could not be found. It may have moved, or the address may be mistyped."
      />
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
          <Link href="/">Return home</Link>
          <Link href="/archive">Browse the archive</Link>
          <Link href="/sources">Sources &amp; credits</Link>
        </nav>
      </div>
    </div>
  );
}
