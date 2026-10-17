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
        <nav className="linkRow" aria-label="Helpful links" style={{ marginTop: 0 }}>
          <Link href="/">Return home</Link>
          <Link href="/archive">Browse the archive</Link>
          <Link href="/sources">Sources &amp; credits</Link>
        </nav>
      </div>
    </div>
  );
}
