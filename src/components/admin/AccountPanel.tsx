"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { adminFetch } from "./adminFetch";
import { toast } from "./toast";
import { NAME } from "./typing";

/** Change your own display name or password. */
export function AccountPanel({ name, email, role }: { name: string; email: string; role: string }) {
  const [displayName, setDisplayName] = useState(name);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (next && next !== confirm) {
      toast.error("The two new passwords don't match.");
      return;
    }
    setBusy(true);
    const res = await adminFetch("/api/admin/account", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: displayName, ...(next ? { currentPassword: current, newPassword: next } : {}) }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      toast.error(body.error || "Could not save your account.");
      return;
    }
    toast.success(next ? "Password changed. You stay signed in here; other devices are signed out." : "Saved.");
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <form className={`${styles.panel} ${styles.form}`} onSubmit={submit} style={{ maxWidth: "36rem" }}>
      <p className={styles.hint} style={{ margin: 0 }}>
        Signed in as <strong>{email}</strong> · {role === "admin" ? "Administrator" : "Editor"}
      </p>
      <label className={styles.label}>
        Your name (shown in History)
        <input {...NAME} className={styles.input} required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </label>
      <h3 style={{ margin: "0.5rem 0 0" }}>Change password</h3>
      <label className={styles.label}>
        Current password
        <input className={styles.input} type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      </label>
      <label className={styles.label}>
        New password (at least 10 characters — a short sentence is great)
        <input className={styles.input} type="password" autoComplete="new-password" minLength={10} value={next} onChange={(e) => setNext(e.target.value)} />
      </label>
      <label className={styles.label}>
        New password again
        <input className={styles.input} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </label>
      <div className={styles.rowActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
