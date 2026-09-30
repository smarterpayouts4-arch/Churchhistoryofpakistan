import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { isAdminPreviewAllowed } from "@/lib/auth/preview";
import { LoginForm } from "@/components/admin/LoginForm";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "Curator login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  // Server-driven: UI only shows preview CTA when preview is actually allowed
  const previewOpen = isAdminPreviewAllowed();

  return (
    <div className={styles.wrap}>
      <div className="shell">
        <p className="eyebrow">Curator access</p>
        <h1>Sign in</h1>
        <p style={{ maxWidth: "36rem", color: "var(--color-muted-brown)" }}>
          For Javed Qadir Bakhsh and authorised curators only. Sessions use an
          HttpOnly cookie; passwords are never stored in the browser.
          {previewOpen
            ? " Local preview mode is enabled on this machine."
            : null}
        </p>
        <div className={`${styles.panel} ${styles.loginCard}`}>
          <LoginForm previewOpen={previewOpen} />
        </div>
      </div>
    </div>
  );
}
