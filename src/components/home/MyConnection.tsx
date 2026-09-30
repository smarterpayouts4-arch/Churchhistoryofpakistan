import { loadHomepage } from "@/content/homepage";
import {
  ConnectionBulletList,
  ConnectionLayout,
} from "@/components/ui/ConnectionLayout";

export async function MyConnection() {
  const homepage = await loadHomepage();
  const bullets = homepage.connection.slice(0, 3);
  const pullQuote = homepage.connection[3];

  return (
    <section className="section sectionPaper" aria-labelledby="connection-heading">
      <div className="shell">
        <ConnectionLayout portraitSrc={homepage.hero.portrait}>
          <p className="eyebrow">A personal commitment</p>
          <h2 id="connection-heading">My Connection to the Church</h2>
          <ConnectionBulletList bullets={bullets} pullQuote={pullQuote} />
        </ConnectionLayout>
      </div>
    </section>
  );
}
