"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, type ToastItem } from "./toast";
import s from "./studio.module.css";

/** Success toasts fade after 10s; errors stay until dismissed. */
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(
    () =>
      toast.subscribe((t) => {
        if (t.clear) return void setItems((list) => list.filter((x) => x.message !== t.message));
        setItems((list) => [...list.filter((x) => x.message !== t.message), t].slice(-4));
        if (t.kind !== "error") {
          window.setTimeout(() => setItems((list) => list.filter((x) => x.id !== t.id)), 10000);
        }
      }),
    [],
  );

  const dismiss = (id: number) => setItems((list) => list.filter((x) => x.id !== id));

  return (
    <div className={s.toaster}>
      <div role="status" aria-live="polite" style={{ display: "contents" }}>
        {items
          .filter((t) => t.kind !== "error")
          .map((t) => (
            <Toast key={t.id} t={t} onClose={() => dismiss(t.id)} />
          ))}
      </div>
      <div role="alert" aria-live="assertive" style={{ display: "contents" }}>
        {items
          .filter((t) => t.kind === "error")
          .map((t) => (
            <Toast key={t.id} t={t} onClose={() => dismiss(t.id)} />
          ))}
      </div>
    </div>
  );
}

function Toast({ t, onClose }: { t: ToastItem; onClose: () => void }) {
  const cls =
    t.kind === "error" ? `${s.toast} ${s.toastError}` : t.kind === "info" ? `${s.toast} ${s.toastInfo}` : s.toast;
  return (
    <div className={cls}>
      <span className={s.toastIcon} aria-hidden="true">
        {t.kind === "error" ? "!" : t.kind === "info" ? "i" : "✓"}
      </span>
      <p>
        {t.message}{" "}
        {t.action?.href ? (
          <Link className={s.toastAction} href={t.action.href}>
            {t.action.label}
          </Link>
        ) : t.action?.onClick ? (
          <button type="button" className={s.smallBtn} onClick={t.action.onClick}>
            {t.action.label}
          </button>
        ) : null}
      </p>
      <button type="button" className={s.toastClose} onClick={onClose} aria-label="Dismiss message">
        ×
      </button>
    </div>
  );
}
