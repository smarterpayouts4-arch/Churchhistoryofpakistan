import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/require-admin";
import {
  CONTENT_DOCS,
  docVersion,
  lastEdited,
  readDoc,
  storageStatus,
} from "@/lib/cms/store";
import type {
  BlogFile,
  CathedralsFile,
  ContributionsFile,
  CuratorProfileFile,
  FamilyArchivesFile,
  FeaturedInterviewsFile,
  HomeLayoutFile,
  HomepageFile,
  PeopleFramesFile,
  SiteSettingsFile,
} from "@/lib/cms/types";
import { getMediaIndex } from "@/lib/media/library";
import { authConfigProblems } from "@/lib/auth/users";
import { intakeStatus } from "@/lib/contributions/intake";
import { resolveHomeLayout } from "@/content/home-layout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { StorageBanner } from "@/components/admin/StorageBanner";
import { loadSectionsState } from "@/lib/sections/server";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Curator admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminPage();
  const [archives, interviews, profile, homepage, layout, cathedrals, peopleFrames, siteSettings, blog, media, contributions, sections] =
    await Promise.all([
      readDoc<FamilyArchivesFile>("family-archives.json"),
      readDoc<FeaturedInterviewsFile>("featured-interviews.json"),
      readDoc<CuratorProfileFile>("curator-profile.json"),
      readDoc<HomepageFile>("homepage.json"),
      readDoc<HomeLayoutFile>("home-layout.json"),
      readDoc<CathedralsFile>("cathedrals.json"),
      readDoc<PeopleFramesFile>("people-frames.json"),
      readDoc<SiteSettingsFile>("site.json"),
      readDoc<BlogFile>("blog.json"),
      getMediaIndex(),
      readDoc<ContributionsFile>("contributions.json"),
      loadSectionsState(),
    ]);
  const storage = storageStatus();

  const docs: Record<string, unknown> = {
    "family-archives.json": archives,
    "featured-interviews.json": interviews,
    "curator-profile.json": profile,
    "homepage.json": homepage,
    "home-layout.json": layout,
    "cathedrals.json": cathedrals,
    "people-frames.json": peopleFrames,
    "site.json": siteSettings,
    "blog.json": blog,
  };
  const versions = Object.fromEntries(Object.entries(docs).map(([k, v]) => [k, docVersion(v)]));
  const editedList = await Promise.all(CONTENT_DOCS.map(async (d) => [d, await lastEdited(d)] as const));
  const edited = Object.fromEntries(editedList.map(([d, r]) => [d, r ? { at: r.at, by: r.by } : null]));

  return (
    <div className={styles.wrap}>
      <div className="shell">
        <div className={styles.adminNav}>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>
              History: Church of Pakistan
            </p>
            <h1 style={{ margin: "0.2rem 0 0" }}>Website admin</h1>
            <p className={styles.hint} style={{ marginTop: "0.35rem" }}>
              Signed in as {session.sub} · {session.role === "admin" ? "Administrator" : "Editor"}
            </p>
          </div>
          <span className={styles.spacer} />
          <Link className={styles.secondaryLink} href="/" target="_blank">
            View website ↗
          </Link>
          <LogoutButton />
        </div>
        <StorageBanner status={storage} problems={session.role === "admin" ? authConfigProblems() : []} />
        <AdminDashboard
          initialHomepage={homepage}
          initialLayout={{ sections: resolveHomeLayout(layout) }}
          initialCathedrals={cathedrals}
          initialArchives={archives.items}
          archiveNote={archives.note}
          initialInterviews={interviews.items}
          initialPeopleFrames={peopleFrames.frames}
          initialProfile={profile}
          initialSite={siteSettings}
          initialBlogPosts={blog.posts}
          versions={versions}
          edited={edited}
          me={{ userId: session.userId, name: session.sub, email: session.email, role: session.role }}
          counts={{ media: media.length, newContributions: (contributions.items ?? []).filter((c) => c.status === "new").length }}
          intakeEnabled={intakeStatus().enabled}
          sections={sections}
          storageInfo={{ blob: storage.blob, hosted: storage.hosted }}
        />
      </div>
    </div>
  );
}
