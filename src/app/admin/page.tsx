import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/require-admin";
import {
  getBlogPosts,
  getCathedrals,
  getCuratorProfileFile,
  getFamilyArchives,
  getFeaturedInterviews,
  getHomepage,
  getPeopleFrames,
  getSiteSettings,
} from "@/lib/cms/store";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LogoutButton } from "@/components/admin/LogoutButton";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Curator admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminPage();
  const [archives, interviews, profile, homepage, cathedrals, peopleFrames, siteSettings, blog] =
    await Promise.all([
      getFamilyArchives(),
      getFeaturedInterviews(),
      getCuratorProfileFile(),
      getHomepage(),
      getCathedrals(),
      getPeopleFrames(),
      getSiteSettings(),
      getBlogPosts(),
    ]);

  return (
    <div className={styles.wrap}>
      <div className="shell">
        <div className={styles.adminNav}>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>
              Curator admin
            </p>
            <h1 style={{ margin: "0.2rem 0 0" }}>Dashboard</h1>
            <p className={styles.hint} style={{ marginTop: "0.35rem" }}>
              Signed in as {session.sub}
            </p>
          </div>
          <span className={styles.spacer} />
          <Link className={styles.inspectLink} href="/" target="_blank">
            View live site
          </Link>
          <Link className={styles.inspectLink} href="/admin/inspect">
            Inspect media
          </Link>
          <LogoutButton />
        </div>
        <AdminDashboard
          initialHomepage={homepage}
          initialCathedrals={cathedrals}
          initialArchives={archives.items}
          archiveNote={archives.note}
          initialInterviews={interviews.items}
          initialPeopleFrames={peopleFrames.frames}
          initialProfile={profile}
          initialSite={siteSettings}
          initialBlogPosts={blog.posts}
        />
      </div>
    </div>
  );
}
