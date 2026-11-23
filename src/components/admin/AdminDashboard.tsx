"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
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
import s from "./studio.module.css";
import styles from "@/app/admin/admin.module.css";

type Tab =
  | "overview"
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
};

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

function ago(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

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
  } = props;
  // Register the versions this page was rendered with (conflict detection).
  useState(() => {
    if (typeof window !== "undefined") setDocVersions(versions);
    return true;
  });
  const [tab, setTab] = useState<Tab>("overview");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setDocVersions(versions);
    const fromHash = window.location.hash.slice(1) as Tab;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromHash) setTab(fromHash);
  }, [versions]);

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

  const nav: { group: string; items: [Tab, string, string?][] }[] = [
    { group: "Start", items: [["overview", "Dashboard"], ["media", "Photos & videos", String(counts.media)]] },
    {
      group: "Homepage",
      items: [
        ["home", "Text & photos"],
        ["layout", "Sections & order"],
      ],
    },
    {
      group: "Collections",
      items: [
        ["archives", "Family Archive", String(initialArchives.length)],
        ["churches", "Churches", String(initialCathedrals.items.length)],
        ["interviews", "Interviews", String(initialInterviews.length)],
        ["people", "People photos"],
        ["blog", "Blog", String(initialBlogPosts.length)],
      ],
    },
    {
      group: "Pages & settings",
      items: [
        ["profile", "Curator profile"],
        ["site", "Site text & menus"],
        ["contributions", "Contributions", counts.newContributions ? String(counts.newContributions) : undefined],
      ],
    },
    {
      group: "People",
      items: [...(me.role === "admin" ? ([["users", "Accounts"]] as [Tab, string][]) : []), ["account", "My account"]],
    },
  ];

  const docInfo = DOC_FOR_TAB[tab];
  const last = docInfo ? edited[docInfo[0]] : null;

  return (
    <div className={s.shell}>
      <nav className={s.sidebar} aria-label="Admin sections">
        {nav.map((g) => (
          <div key={g.group} style={{ display: "contents" }}>
            <p className={s.sidebarGroup}>{g.group}</p>
            {g.items.map(([id, label, badge]) => (
              <button key={id} type="button" className={tab === id ? s.navBtnActive : s.navBtn} aria-current={tab === id ? "page" : undefined} onClick={() => go(id)}>
                <span>{label}</span>
                {badge && badge !== "0" ? <span className={s.badge}>{badge}</span> : null}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className={s.main} key={tab}>
        {docInfo ? (
          <div className={s.paneHead}>
            <p className={s.paneMeta}>
              {last && last.by !== "original"
                ? `Last saved ${ago(last.at)} by ${last.by}.`
                : "No admin edits yet — this is the original content."}{" "}
              Changes appear on the live site as soon as you save.
            </p>
            <HistoryButton doc={docInfo[0]} label={docInfo[1]} />
          </div>
        ) : null}

        {tab === "overview" ? <Overview me={me} counts={counts} archives={initialArchives.length} posts={initialBlogPosts.length} churches={initialCathedrals.items.length} edited={edited} go={go} /> : null}

        {tab === "media" ? (
          <section aria-labelledby="media-heading">
            <h2 id="media-heading" style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
              Photos & videos
            </h2>
            <p className={styles.hint} style={{ marginBottom: "1rem" }}>
              Everything uploaded here can be chosen in any photo field. Click a photo to describe it, crop a copy,
              or delete it.
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
              Contributions
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

function Overview({
  me,
  counts,
  archives,
  posts,
  churches,
  edited,
  go,
}: {
  me: Props["me"];
  counts: Props["counts"];
  archives: number;
  posts: number;
  churches: number;
  edited: Record<string, Edited>;
  go: (t: Tab) => void;
}) {
  const recent = Object.entries(edited)
    .filter(([, e]) => e && e.by !== "original")
    .sort((a, b) => (a[1]!.at < b[1]!.at ? 1 : -1))
    .slice(0, 5);
  const LABEL: Record<string, string> = Object.fromEntries(Object.values(DOC_FOR_TAB).map(([d, l]) => [d, l]));
  const TAB_FOR_DOC: Record<string, Tab> = Object.fromEntries(Object.entries(DOC_FOR_TAB).map(([t, v]) => [v![0], t as Tab]));
  const cards: [Tab, string, string, string][] = [
    ["media", "photo", "Photos & videos", `${counts.media} uploaded · drag & drop to add more`],
    ["archives", "archive", "Family Archive", `${archives} records with captions & sources`],
    ["home", "home", "Homepage", "Title, introduction, rotating photos"],
    ["layout", "layout", "Homepage sections", "Reorder or hide sections"],
    ["churches", "church", "Churches", `${churches} cathedrals`],
    ["interviews", "video", "Interviews", "Videos, posters and captions"],
    ["blog", "pen", "Blog", `${posts} posts`],
    ["contributions", "mail", "Contributions", counts.newContributions ? `${counts.newContributions} new to review` : "Nothing new"],
  ];
  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>
        Welcome, {me.name.split(" ")[0]}
      </h2>
      <p className={styles.hint} style={{ marginBottom: "1.25rem" }}>
        Choose what you&rsquo;d like to work on. Every save is kept in History, so nothing is ever lost.
      </p>
      <div className={s.cards}>
        {cards.map(([t, icon, title, sub]) => (
          <button key={t} type="button" className={s.card} onClick={() => go(t)}>
            <span className={s.cardIcon} aria-hidden="true">
              <Icon name={icon} />
            </span>
            <strong>{title}</strong>
            <span>{sub}</span>
          </button>
        ))}
      </div>
      <h3 style={{ marginTop: "2rem" }}>Recent changes</h3>
      {recent.length ? (
        <ul className={s.list}>
          {recent.map(([doc, e]) => (
            <li key={doc} className={s.listRow}>
              <div className={s.listMain}>
                <strong>{LABEL[doc] ?? doc}</strong>
                <small>
                  {ago(e!.at)} by {e!.by}
                </small>
              </div>
              {TAB_FOR_DOC[doc] ? (
                <button type="button" className={s.smallBtn} onClick={() => go(TAB_FOR_DOC[doc]!)}>
                  Open
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.hint}>No changes yet.</p>
      )}
    </section>
  );
}
