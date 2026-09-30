"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/admin/admin.module.css";

type Props = {
  previewOpen?: boolean;
};

export function LoginForm({ previewOpen = false }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(!previewOpen);

  async function enterPreview() {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login/preview", {
        method: "POST",
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Preview login failed.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        retryAfterSeconds?: number;
      };
      if (!res.ok) {
        setError(
          data.error ||
            (res.status === 429
              ? "Too many attempts. Please wait and try again."
              : "Login failed."),
        );
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.form}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {previewOpen ? (
        <div className={styles.panel} style={{ padding: "1rem", margin: 0 }}>
          <p className={styles.hint} style={{ marginBottom: "0.75rem" }}>
            Local preview mode is on. One click enters the curator dashboard.
            No password required on this machine.
          </p>
          <button
            className={styles.primaryBtn}
            type="button"
            disabled={pending}
            onClick={enterPreview}
            style={{ width: "100%" }}
          >
            {pending ? "Entering…" : "Enter as curator (local preview)"}
          </button>
          {!showPasswordForm ? (
            <button
              type="button"
              className={styles.secondaryBtn}
              style={{ width: "100%", marginTop: "0.75rem" }}
              onClick={() => setShowPasswordForm(true)}
            >
              Use username / password instead
            </button>
          ) : null}
        </div>
      ) : null}

      {showPasswordForm ? (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {previewOpen ? (
            <p className={styles.hint} style={{ margin: 0 }}>
              Password Sign in (optional for local preview)
            </p>
          ) : null}
          <label className={styles.label}>
            Username or email
            <input
              className={styles.input}
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className={styles.primaryBtn} type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
