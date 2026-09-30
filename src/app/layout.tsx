import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cormorant, sourceSans } from "@/lib/fonts";
import { SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import { loadHomepage } from "@/content/homepage";
import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await loadHomepage();
  return {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${homepage.site_title} | Preserving Our Heritage`,
    template: `%s | ${homepage.site_title}`,
  },
  description: SITE_DESCRIPTION,
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
  const homepage = await loadHomepage();
  return (
    <html lang="en" className={`${cormorant.variable} ${sourceSans.variable}`}>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <Header siteName={homepage.site_title} />
        <main id="main">{children}</main>
        <Footer siteName={homepage.site_title} strapline={homepage.strapline} />
        <p className="sr-only">{homepage.strapline}</p>
      </body>
    </html>
  );
}
