import { loadHomepage } from "@/content/homepage";
import { loadSiteSettings } from "@/content/site";
import {
  ConnectionBulletList,
  ConnectionLayout,
} from "@/components/ui/ConnectionLayout";

export async function MyConnection() {
  const [homepage, site] = await Promise.all([loadHomepage(), loadSiteSettings()]);
  const bullets = homepage.connection.slice(0, 3);
  const pullQuote = homepage.connection[3];

  return (
    <section className="section sectionPaper" aria-labelledby="connection-heading">
      <div className="shell">
        <ConnectionLayout portraitSrc={homepage.hero.portrait}>
          <p className="eyebrow">{site.home_sections.connection.eyebrow}</p>
          <h2 id="connection-heading">{site.home_sections.connection.heading}</h2>
          <ConnectionBulletList bullets={bullets} pullQuote={pullQuote} />
        </ConnectionLayout>
      </div>
    </section>
  );
}
