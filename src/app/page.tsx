import type { ReactNode } from "react";
import { Hero } from "@/components/home/Hero";
import { Purpose } from "@/components/home/Purpose";
import { Interviews } from "@/components/home/Interviews";
import { ChurchesPreview } from "@/components/home/Churches";
import { Timeline } from "@/components/home/Timeline";
import { FamilyArchives } from "@/components/home/FamilyArchives";
import { MyConnection } from "@/components/home/MyConnection";
import { ShareStoryCta } from "@/components/home/ShareStoryCta";
import { GuidingPrinciple } from "@/components/home/GuidingPrinciple";
import { loadHomeLayout } from "@/content/home-layout";
import type { HomeSectionId } from "@/lib/cms/types";

const SECTIONS: Record<HomeSectionId, () => ReactNode> = {
  hero: () => <Hero />,
  archives: () => <FamilyArchives />,
  purpose: () => <Purpose />,
  churches: () => <ChurchesPreview />,
  timeline: () => <Timeline />,
  interviews: () => <Interviews />,
  connection: () => <MyConnection />,
  contribute: () => <ShareStoryCta />,
  guiding: () => <GuidingPrinciple />,
};

/** Homepage sections render in the curator-chosen order (Admin → Homepage → Sections). */
export default async function HomePage() {
  const layout = await loadHomeLayout();
  return (
    <>
      {layout
        .filter((s) => s.visible)
        .map((s) => (
          <div key={s.id} style={{ display: "contents" }}>
            {SECTIONS[s.id]()}
          </div>
        ))}
    </>
  );
}
