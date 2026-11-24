"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import s from "./studio.module.css";
import { adminFetch } from "./adminFetch";
import { toast } from "./toast";
import { NAME } from "./typing";

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
};

/** Readable temporary password, e.g. "cedar-lamp-river-42". */
export function suggestPassword() {
  const words = ["cedar", "river", "lamp", "olive", "stone", "bell", "garden", "harbor", "candle", "meadow", "lantern", "psalm", "willow", "chapel", "morning", "summit"];
  const pick = () => words[crypto.getRandomValues(new Uint32Array(1))[0]! % words.length];
  const n = 10 + (crypto.getRandomValues(new Uint32Array(1))[0]! % 90);
  return `${pick()}-${pick()}-${pick()}-${n}`;
}

/** Admins only: invite family members, set roles, reset passwords. */
export function UsersPanel({ me }: { me: string }) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "editor" as "admin" | "editor", password: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/users");
    const body = (await res.json().catch(() => ({}))) as { users?: User[] };
    setUsers(body.users ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function call(url: string, method: string, body?: unknown, success?: string) {
    setBusy(true);
    const res = await adminFetch(url, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      toast.error(data.error || "That didn't work. Please try again.");
      return false;
    }
    if (success) toast.success(success);
    await load();
    return true;
  }

  async function create(e: FormEvent) {
    e.preventDefault();
    const ok = await call("/api/admin/users", "POST", form, `Account created for ${form.name}. Share the email and temporary password with them privately.`);
    if (ok) setForm({ name: "", email: "", role: "editor", password: "" });
  }

  async function resetPassword(u: User) {
    const pw = window.prompt(`New temporary password for ${u.name} (at least 10 characters):`, suggestPassword());
    if (!pw) return;
    await call(`/api/admin/users/${u.id}`, "PATCH", { password: pw }, `Password changed for ${u.name}. Their other sign-ins were ended.`);
  }

  return (
    <div className={styles.form}>
      <div className={styles.panel}>
        <h3 style={{ marginTop: 0 }}>Who can sign in</h3>
        <p className={styles.hint} style={{ marginBottom: "0.75rem" }}>
          <strong>Administrators</strong> can do everything, including managing accounts.{" "}
          <strong>Editors</strong> can edit content and upload photos, but can&rsquo;t manage accounts.
        </p>
        {users === null ? (
          <p className={styles.hint}>Loading…</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last sign-in</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      {u.id === me ? <div className={styles.hint}>(you)</div> : null}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className={styles.select}
                        aria-label={`Role for ${u.name}`}
                        value={u.role}
                        disabled={busy || u.id === me}
                        onChange={(e) => call(`/api/admin/users/${u.id}`, "PATCH", { role: e.target.value }, `${u.name} is now ${e.target.value === "admin" ? "an administrator" : "an editor"}.`)}
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td>
                      <span className={u.active ? s.statusPill : s.statusNew}>{u.active ? "Active" : "Switched off"}</span>
                    </td>
                    <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" className={s.smallBtn} disabled={busy} onClick={() => resetPassword(u)}>
                          Reset password
                        </button>
                        {u.id !== me ? (
                          <button type="button" className={s.smallBtn} disabled={busy} onClick={() => call(`/api/admin/users/${u.id}`, "PATCH", { active: !u.active }, u.active ? `${u.name} can no longer sign in.` : `${u.name} can sign in again.`)}>
                            {u.active ? "Switch off" : "Switch on"}
                          </button>
                        ) : null}
                        {u.id !== me ? (
                          <button
                            type="button"
                            className={styles.dangerBtn}
                            disabled={busy}
                            onClick={() => window.confirm(`Delete ${u.name}'s account?`) && call(`/api/admin/users/${u.id}`, "DELETE", undefined, `${u.name}'s account was deleted.`)}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form className={`${styles.panel} ${styles.form}`} onSubmit={create}>
        <h3 style={{ margin: 0 }}>Add a family member</h3>
        <div className={styles.grid2}>
          <label className={styles.label}>
            Name
            <input {...NAME} className={styles.input} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className={styles.label}>
            Email (used to sign in)
            <input className={styles.input} type="email" required autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className={styles.label}>
            Role
            <select className={styles.select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "editor" })}>
              <option value="editor">Editor — edits content and photos</option>
              <option value="admin">Administrator — everything, including accounts</option>
            </select>
          </label>
          <label className={styles.label}>
            Temporary password (at least 10 characters)
            <span style={{ display: "flex", gap: "0.4rem" }}>
              <input className={styles.input} required minLength={10} autoComplete="new-password" spellCheck={false} autoCorrect="off" autoCapitalize="none" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" className={s.smallBtn} onClick={() => setForm({ ...form, password: suggestPassword() })}>
                Suggest
              </button>
            </span>
          </label>
        </div>
        <p className={styles.hint}>They can change it themselves under “My account” after signing in.</p>
        <div className={styles.rowActions}>
          <button className={styles.primaryBtn} type="submit" disabled={busy}>
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
