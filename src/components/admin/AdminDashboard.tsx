"use client";

import { useState } from "react";
import type {
  CathedralsFile,
  CuratorProfileFile,
  FamilyArchiveItem,
  FeaturedInterview,
  BlogPost,
  HomepageContent,
  PeopleFrame,
  SiteSettings,
} from "@/lib/cms/types";
import { ImageCropUpload } from "./ImageCropUpload";
import { HomepageEditor } from "./HomepageEditor";
import { ChurchesEditor } from "./ChurchesEditor";
import { FamilyArchivesEditor } from "./FamilyArchivesEditor";
import { FeaturedInterviewsEditor } from "./FeaturedInterviewsEditor";
import { CuratorProfileEditor } from "./CuratorProfileEditor";
import { PeopleFramesEditor } from "./PeopleFramesEditor";
import { SiteEditor } from "./SiteEditor";
import { BlogEditor } from "./BlogEditor";
import styles from "@/app/admin/admin.module.css";

type Tab =
  | "site"
  | "blog"
  | "home"
  | "churches"
  | "archives"
  | "interviews"
  | "people"
  | "media"
  | "profile";

type Props = {
  initialHomepage: HomepageContent;
  initialCathedrals: CathedralsFile;
  initialArchives: FamilyArchiveItem[];
  archiveNote: string;
  initialInterviews: FeaturedInterview[];
  initialPeopleFrames: PeopleFrame[];
  initialProfile: CuratorProfileFile;
  initialSite: SiteSettings;
  initialBlogPosts: BlogPost[];
};

export function AdminDashboard({
  initialHomepage,
  initialCathedrals,
  initialArchives,
  archiveNote,
  initialInterviews,
  initialPeopleFrames,
  initialProfile,
  initialSite,
  initialBlogPosts,
}: Props) {
  const [tab, setTab] = useState<Tab>("home");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [incomingImage, setIncomingImage] = useState<{
    path: string;
    nonce: number;
  } | null>(null);

  function handImageToArchive(path: string, announce: string) {
    setIncomingImage((current) => ({
      path,
      nonce: (current?.nonce ?? 0) + 1,
    }));
    setMessage(announce);
    setError(null);
    setTab("archives");
  }

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Curator sections">
        {(
          [
            ["site", "Site & Pages"],
            ["blog", "Blog"],
            ["home", "Home"],
            ["churches", "Churches"],
            ["archives", "Family Archives"],
            ["interviews", "Featured Interviews"],
            ["people", "People"],
            ["media", "Media library"],
            ["profile", "Curator profile"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? styles.tabActive : styles.tab}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className={styles.success}>{message}</p> : null}

      {tab === "site" ? (
        <SiteEditor
          initialSite={initialSite}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
        />
      ) : null}

      {tab === "blog" ? (
        <BlogEditor
          initialPosts={initialBlogPosts}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
        />
      ) : null}

      {tab === "home" ? (
        <HomepageEditor
          initialHomepage={initialHomepage}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
        />
      ) : null}

      {tab === "churches" ? (
        <ChurchesEditor
          initialCathedrals={initialCathedrals}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
        />
      ) : null}

      <div hidden={tab !== "archives"}>
        <FamilyArchivesEditor
          initialArchives={initialArchives}
          archiveNote={archiveNote}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
          incomingImage={incomingImage}
        />
      </div>

      <div hidden={tab !== "people"}>
        <PeopleFramesEditor
          initialFrames={initialPeopleFrames}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
        />
      </div>

      <div hidden={tab !== "interviews"}>
        <FeaturedInterviewsEditor
          initialInterviews={initialInterviews}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
        />
      </div>

      {tab === "media" ? (
        <section className={styles.section} aria-labelledby="media-heading">
          <h2 id="media-heading">Media library</h2>
          <p className={styles.hint}>
            When Vercel Blob is configured, uploads go to Blob and the
            returned URL can be pasted anywhere an image is used; otherwise
            they land in <code>public/media/uploads/</code>. Paste the returned
            path/URL into an image field.
          </p>
          <div className={styles.panel}>
            <ImageCropUpload
              destination="uploads"
              onUploaded={(path) =>
                handImageToArchive(
                  path,
                  `Image ready: ${path}. Switched into the archive form.`,
                )
              }
            />
          </div>
          <div className={styles.panel} style={{ marginTop: "1rem" }}>
            <h3 style={{ marginTop: 0 }}>Facebook archive destination</h3>
            <ImageCropUpload
              destination="facebook"
              onUploaded={(path) =>
                handImageToArchive(path, `Image ready: ${path}`)
              }
            />
          </div>
        </section>
      ) : null}

      <div hidden={tab !== "profile"}>
        <CuratorProfileEditor
          initialProfile={initialProfile}
          pending={pending}
          setPending={setPending}
          setMessage={setMessage}
          setError={setError}
        />
      </div>
    </div>
  );
}
