"use client";

import { useEffect, useState } from "react";
import type {
  BlogPost,
  CathedralsFile,
  CuratorProfileFile,
  FamilyArchiveItem,
  FeaturedInterview,
  HomeLayoutFile,
  HomepageContent,
  PeopleFrame,
  SiteSettings,
} from "@/lib/cms/types";
import { HomepageEditor } from "./HomepageEditor";
import { HomeLayoutEditor } from "./HomeLayoutEditor";
import { ChurchesEditor } from "./ChurchesEditor";
import { FamilyArchivesEditor } from "./FamilyArchivesEditor";
import { FeaturedInterviewsEditor } from "./FeaturedInterviewsEditor";
import { CuratorProfileEditor } from "./CuratorProfileEditor";
import { PeopleFramesEditor } from "./PeopleFramesEditor";
import { SiteEditor } from "./SiteEditor";
import { SectionMediaManager } from "./SectionMediaManager";
import type { SectionsSnapshot } from "@/lib/sections/config";
import type { StorageInfo } from "./upload";
import { BlogEditor } from "./BlogEditor";
import { MediaLibrary } from "./MediaLibrary";
import { UsersPanel } from "./UsersPanel";
import { AccountPanel } from "./AccountPanel";
import { ContributionsInbox } from "./ContributionsInbox";
import { HistoryButton } from "./HistoryButton";
import { Toaster } from "./Toaster";
import { ConflictDialog } from "./ConflictDialog";
import { setDocVersions } from "./adminFetch";
import { toast } from "./toast";
import { LocalTime } from "./LocalTime";
import s from "./studio.module.css";
import styles from "@/app/admin/admin.module.css";

type Tab =
  | "photos"
  | "media"
  | "home"
  | "layout"
  | "archives"
  | "churches"
  | "interviews"
  | "people"
  | "blog"
  | "profile"
  | "site"
  | "contributions"
  | "users"
  | "account";

type Edited = { at: string; by: string } | null;

type Props = {
  initialHomepage: HomepageContent;
  initialLayout: HomeLayoutFile;
  initialCathedrals: CathedralsFile;
  initialArchives: FamilyArchiveItem[];
  archiveNote: string;
  initialInterviews: FeaturedInterview[];
  initialPeopleFrames: PeopleFrame[];
  initialProfile: CuratorProfileFile;
  initialSite: SiteSettings;
  initialBlogPosts: BlogPost[];
  versions: Record<string, string>;
  edited: Record<string, Edited>;
  me: { userId: string; name: string; email: string; role: "admin" | "editor" };
  counts: { media: number; newContributions: number };
  intakeEnabled: boolean;
  sections: SectionsSnapshot;
  storageInfo: StorageInfo;
};

/** Tabs outside the owner's everyday path, tucked under "More settings". */
const MORE_TABS: Tab[] = ["home", "layout", "archives", "churches", "interviews", "people", "blog", "profile", "site", "media", "users"];
const ALL_TABS: Tab[] = ["photos", "contributions", "account", ...MORE_TABS];

const DOC_FOR_TAB: Partial<Record<Tab, [string, string]>> = {
  home: ["homepage.json", "Homepage text & photos"],
  layout: ["home-layout.json", "Homepage sections"],
  archives: ["family-archives.json", "Family Archive"],
  churches: ["cathedrals.json", "Churches"],
  interviews: ["featured-interviews.json", "Interviews"],
  people: ["people-frames.json", "People photos"],
  blog: ["blog.json", "Blog"],
  profile: ["curator-profile.json", "Curator profile"],
  site: ["site.json", "Site settings & page text"],
};

export function AdminDashboard(props: Props) {
  const {
    initialHomepage,
    initialLayout,
    initialCathedrals,
    initialArchives,
    archiveNote,
    initialInterviews,
    initialPeopleFrames,
    initialProfile,
    initialSite,
    initialBlogPosts,
    versions,
    edited,
    me,
    counts,
    intakeEnabled,
    sections,
    storageInfo,
  } = props;
  // Register the versions this page was rendered with (conflict detection).
  useState(() => {
    if (typeof window !== "undefined") setDocVersions(versions);
    return true;
  });
  const [tab, setTab] = useState<Tab>("photos");
  const [more, setMore] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setDocVersions(versions);
  }, [versions]);

  // Open the tab named in the address (#photos, #archives …), also when a link changes it.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1) as Tab;
      if (!ALL_TABS.includes(h)) return;
      setTab(h);
      if (MORE_TABS.includes(h)) setMore(true);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function go(t: Tab) {
    setTab(t);
    history.replaceState(null, "", `#${t}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Existing editors report through these; we show them as toasts.
  const setMessage = (m: string | null) => {
    if (m) toast.success(m);
  };
  const setError = (m: string | null) => {
    if (m) toast.error(m);
  };
  const editorProps = { pending, setPending, setMessage, setError };

  const main: [Tab, string, string?][] = [
    ["photos", "Photos & videos"],
    ["contributions", "Stories", counts.newContributions ? String(counts.newContributions) : undefined],
    ["account", "My account"],
  ];
  const extra: [Tab, string, string?][] = [
    ["home", "Homepage text"],
    ["layout", "Homepage section order"],
    ["archives", "Archive captions & sources"],
    ["churches", "Churches"],
    ["interviews", "Interview details"],
    ["people", "People photo details"],
    ["blog", "Blog", String(initialBlogPosts.length)],
    ["profile", "Curator profile"],
    ["site", "Site text & menus"],
    ["media", "All uploaded files", String(counts.media)],
    ...(me.role === "admin" ? ([["users", "Accounts"]] as [Tab, string][]) : []),
  ];
  const navButton = ([id, label, badge]: [Tab, string, string?]) => (
    <button key={id} type="button" className={tab === id ? s.navBtnActive : s.navBtn} aria-current={tab === id ? "page" : undefined} onClick={() => go(id)}>
      <span>{label}</span>
      {badge && badge !== "0" ? <span className={s.badge}>{badge}</span> : null}
    </button>
  );

  const docInfo = DOC_FOR_TAB[tab];
  const last = docInfo ? edited[docInfo[0]] : null;

  return (
    <div className={s.shell}>
      <nav className={s.sidebar} aria-label="Admin sections">
        <p className={s.sidebarGroup}>Website</p>
        {main.map(navButton)}
        <button type="button" className={s.moreBtn} aria-expanded={more} onClick={() => setMore((v) => !v)}>
          <span>More settings</span>
          <span aria-hidden="true">{more ? "▴" : "▾"}</span>
        </button>
        {more ? extra.map(navButton) : null}
      </nav>

      <div className={s.main} key={tab}>
        {docInfo ? (
          <div className={s.paneHead}>
            <p className={s.paneMeta}>
              {last && last.by !== "original" ? (
                <>
                  Last saved <LocalTime iso={last.at} /> by {last.by}.
                </>
              ) : (
                "No admin edits yet — this is the original content."
              )}{" "}
              These settings go live as soon as you save (no Publish step).
            </p>
            <HistoryButton doc={docInfo[0]} label={docInfo[1]} />
          </div>
        ) : null}

        {tab === "photos" ? <SectionMediaManager initial={sections} storageInfo={storageInfo} /> : null}

        {tab === "media" ? (
          <section aria-labelledby="media-heading">
            <h2 id="media-heading" style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
              All uploaded files
            </h2>
            <p className={styles.hint} style={{ marginBottom: "1rem" }}>
              Every photo and video file on the site. To change what the website shows, use{" "}
              <a href="#photos">Photos &amp; videos</a>. Here you can describe a file, crop a copy, or delete files
              nothing uses. <a href="/admin/inspect">Check photo sizes and framing</a>.
            </p>
            <MediaLibrary />
          </section>
        ) : null}

        <div hidden={tab !== "home"}>
          <HomepageEditor initialHomepage={initialHomepage} {...editorProps} />
        </div>
        {tab === "layout" ? (
          <section aria-labelledby="layout-heading">
            <h2 id="layout-heading" style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
              Homepage sections
            </h2>
            <HomeLayoutEditor initial={initialLayout} />
          </section>
        ) : null}
        <div hidden={tab !== "archives"}>
          <FamilyArchivesEditor initialArchives={initialArchives} archiveNote={archiveNote} {...editorProps} />
        </div>
        <div hidden={tab !== "churches"}>
          <ChurchesEditor initialCathedrals={initialCathedrals} {...editorProps} />
        </div>
        <div hidden={tab !== "interviews"}>
          <FeaturedInterviewsEditor initialInterviews={initialInterviews} {...editorProps} />
        </div>
        <div hidden={tab !== "people"}>
          <PeopleFramesEditor initialFrames={initialPeopleFrames} {...editorProps} />
        </div>
        <div hidden={tab !== "blog"}>
          <BlogEditor initialPosts={initialBlogPosts} {...editorProps} />
        </div>
        <div hidden={tab !== "profile"}>
          <CuratorProfileEditor initialProfile={initialProfile} {...editorProps} />
        </div>
        <div hidden={tab !== "site"}>
          <SiteEditor initialSite={initialSite} {...editorProps} />
        </div>
        {tab === "contributions" ? (
          <section aria-labelledby="contrib-heading">
            <h2 id="contrib-heading" style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
              Submitted stories
            </h2>
            <ContributionsInbox isAdmin={me.role === "admin"} enabled={intakeEnabled} />
          </section>
        ) : null}
        {tab === "users" && me.role === "admin" ? (
          <section aria-labelledby="users-heading">
            <h2 id="users-heading" style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
              Accounts
            </h2>
            <UsersPanel me={me.userId} />
          </section>
        ) : null}
        {tab === "account" ? (
          <section aria-labelledby="account-heading">
            <h2 id="account-heading" style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
              My account
            </h2>
            <AccountPanel name={me.name} email={me.email} role={me.role} />
          </section>
        ) : null}
      </div>
      <Toaster />
      <ConflictDialog />
    </div>
  );
}
