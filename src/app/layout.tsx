import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cormorant, sourceSans } from "@/lib/fonts";
import { SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import { loadSiteSettings } from "@/content/site";
import { loadHomepage } from "@/content/homepage";
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/media/brand/archive-cross-mark.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/media/brand/archive-cross-mark.svg",
  },
  openGraph: {
    title: homepage.site_title,
    description: SITE_DESCRIPTION,
    siteName: homepage.site_title,
    type: "website",
  },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${sourceSans.variable}`}>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <Header siteName={homepage.site_title} navItems={site.nav.primary} />
        <main id="main">{children}</main>
        <Footer siteName={homepage.site_title} strapline={homepage.strapline} navItems={site.nav.footer} exploreTitle={site.footer.explore_title} aboutTitle={site.footer.about_title} aboutCopy={site.footer.about_copy} curatorLinkLabel={site.footer.curator_link_label} />
        <p className="sr-only">{homepage.strapline}</p>
      </body>
    </html>
  );
}
