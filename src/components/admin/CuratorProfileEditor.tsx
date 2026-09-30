"use client";

import { useState } from "react";
import type { CuratorProfileFile } from "@/lib/cms/types";
import styles from "@/app/admin/admin.module.css";

type Props = {
  initialProfile: CuratorProfileFile;
  pending: boolean;
  setPending: (v: boolean) => void;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
};

export function CuratorProfileEditor({
  initialProfile,
  pending,
  setPending,
  setMessage,
  setError,
}: Props) {
  const [profileFile, setProfileFile] = useState(initialProfile);
  const [profileJson, setProfileJson] = useState(() =>
    JSON.stringify(initialProfile, null, 2),
  );

  async function saveProfile() {
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      let parsed: CuratorProfileFile;
      try {
        parsed = JSON.parse(profileJson) as CuratorProfileFile;
      } catch {
        setError("Profile JSON is invalid.");
        setPending(false);
        return;
      }
      const res = await fetch("/api/admin/curator-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        data?: CuratorProfileFile;
      };
      if (!res.ok || !data.data) {
        setError(data.error || "Profile save failed.");
        return;
      }
      setProfileFile(data.data);
      setProfileJson(JSON.stringify(data.data, null, 2));
      setMessage("Curator profile saved. Public /about#profile will reflect it.");
    } catch {
      setError("Network error.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="profile-heading">
      <h2 id="profile-heading">Curator profile</h2>
      <p className={styles.hint}>
        Stored in <code>data/cms/curator-profile.json</code>. Edit carefully.
        Do not invent biographical facts. Current name: {profileFile.profile.name}.
      </p>
      <label className={styles.label}>
        Profile JSON
        <textarea
          className={styles.textarea}
          style={{ minHeight: "28rem", fontFamily: "ui-monospace, monospace" }}
          value={profileJson}
          onChange={(e) => setProfileJson(e.target.value)}
          spellCheck={false}
        />
      </label>
      <button
        type="button"
        className={styles.primaryBtn}
        onClick={saveProfile}
        disabled={pending}
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </section>
  );
}
