"use client";

export type ToastKind = "success" | "error" | "info";
export type ToastAction = { label: string; href?: string; onClick?: () => void };
export type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
  action?: ToastAction;
};

type Listener = (t: ToastItem) => void;
const listeners = new Set<Listener>();
let nextId = 1;

function emit(kind: ToastKind, message: string, opts: { action?: ToastAction } = {}) {
  const item: ToastItem = { id: nextId++, kind, message, action: opts.action };
  listeners.forEach((l) => l(item));
  return item.id;
}

export const toast = {
  success: (m: string, o?: { action?: ToastAction }) => emit("success", m, o),
  error: (m: string, o?: { action?: ToastAction }) => emit("error", m, o),
  info: (m: string, o?: { action?: ToastAction }) => emit("info", m, o),
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
