import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cormorant, sourceSans } from "@/lib/fonts";
import { SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import { socialMetadata } from "@/lib/seo";
import { loadSiteSettings } from "@/content/site";
import { loadHomepage } from "@/content/homepage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);
  return {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${homepage.site_title} | ${site.seo.title_suffix}`,
    template: `%s | ${homepage.site_title}`,
  },
  description: site.seo.description || SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  ...socialMetadata({ description: site.seo.description || SITE_DESCRIPTION, path: "/" }),
  robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf5e9",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [homepage, site, requestHeaders] = await Promise.all([
    loadHomepage(),
    loadSiteSettings(),
    // Reading headers keeps every page per-request, which the nonce-based
    // Content-Security-Policy in src/proxy.ts needs.
    headers(),
  ]);
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const base = siteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: homepage.site_title,
        description: site.seo.description || SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${base}/#archive` },
      },
      {
        "@type": "ArchiveOrganization",
        "@id": `${base}/#archive`,
        name: homepage.site_title,
        url: `${base}/`,
        slogan: homepage.strapline,
        logo: `${base}/media/brand/archive-cross-mark.svg`,
        founder: { "@type": "Person", name: "Javed Qadir Bakhsh" },
      },
    ],
  };
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${sourceSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          nonce={nonce}
          // JSON-LD is data, not code; "<" is escaped so content can never close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <Header siteName={homepage.site_title} navItems={site.nav.primary} />
        <main id="main">
          <ViewTransition name="site-main">{children}</ViewTransition>
        </main>
        <ScrollReveal />
        <Footer siteName={homepage.site_title} strapline={homepage.strapline} navItems={site.nav.footer} exploreTitle={site.footer.explore_title} aboutTitle={site.footer.about_title} aboutCopy={site.footer.about_copy} curatorLinkLabel={site.footer.curator_link_label} />
        <p className="sr-only">{homepage.strapline}</p>
      </body>
    </html>
  );
}
