"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className={styles.logoutBtn}
      onClick={logout}
      disabled={pending}
    >
      {pending ? "Signing out…" : "Log out"}
    </button>
  );
}
