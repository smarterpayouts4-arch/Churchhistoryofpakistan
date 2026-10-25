import { Hero } from "@/components/home/Hero";
import { Purpose } from "@/components/home/Purpose";
import { Interviews } from "@/components/home/Interviews";
import { ChurchesPreview } from "@/components/home/Churches";
import { Timeline } from "@/components/home/Timeline";
import { FamilyArchives } from "@/components/home/FamilyArchives";
import { MyConnection } from "@/components/home/MyConnection";
import { ContributeCta } from "@/components/home/ContributeCta";
import { GuidingPrinciple } from "@/components/home/GuidingPrinciple";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FamilyArchives />
      <Purpose />
      <ChurchesPreview />
      <Timeline />
      <Interviews />
      <MyConnection />
      <ContributeCta />
      <GuidingPrinciple />
    </>
  );
}
