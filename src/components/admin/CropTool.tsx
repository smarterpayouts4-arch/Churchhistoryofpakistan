"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import s from "./studio.module.css";

type AspectMode = "free" | "4:3" | "3:2" | "1:1" | "3:4";
type Rect = { x: number; y: number; w: number; h: number };
const RATIOS: Record<Exclude<AspectMode, "free">, number> = {
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "1:1": 1,
  "3:4": 3 / 4,
};

/**
 * Crop a photo into a NEW file (the original is never changed).
 * Drag on the preview to choose the area; full-resolution pixels are used.
 */
export function CropTool({
  src,
  filename,
  onCropped,
  onCancel,
}: {
  src: string;
  filename: string;
  onCropped: (file: File) => void | Promise<void>;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [aspect, setAspect] = useState<AspectMode>("free");
  const [sel, setSel] = useState<Rect | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const drag = useRef<{ x: number; y: number; on: boolean }>({ x: 0, y: 0, on: false });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      const c = canvasRef.current;
      if (!c) return;
      const scale = Math.min(1, 760 / img.naturalWidth);
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      setSel({ x: 0, y: 0, w: c.width, h: c.height });
    };
    img.onerror = () => setError("Could not open this photo for cropping.");
    img.src = src;
  }, [src]);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    const img = imgRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !img || !ctx) return;
    ctx.drawImage(img, 0, 0, c.width, c.height);
    if (sel) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, c.width, c.height);
      const kx = img.naturalWidth / c.width;
      const ky = img.naturalHeight / c.height;
      ctx.drawImage(img, sel.x * kx, sel.y * ky, sel.w * kx, sel.h * ky, sel.x, sel.y, sel.w, sel.h);
      ctx.strokeStyle = "#af8b58";
      ctx.lineWidth = 2;
      ctx.strokeRect(sel.x, sel.y, sel.w, sel.h);
    }
  }, [sel]);

  useEffect(draw, [draw]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(c.width, ((e.clientX - r.left) / r.width) * c.width)),
      y: Math.max(0, Math.min(c.height, ((e.clientY - r.top) / r.height) * c.height)),
    };
  }

  function fit(r: Rect): Rect {
    const c = canvasRef.current!;
    if (aspect === "free") return r;
    const ratio = RATIOS[aspect];
    let { w, h } = r;
    h = w / ratio;
    if (r.y + h > c.height) {
      h = c.height - r.y;
      w = h * ratio;
    }
    if (r.x + w > c.width) {
      w = c.width - r.x;
      h = w / ratio;
    }
    return { x: r.x, y: r.y, w, h };
  }

  function centred(mode: AspectMode) {
    const c = canvasRef.current;
    if (!c) return;
    if (mode === "free") {
      setSel({ x: 0, y: 0, w: c.width, h: c.height });
      return;
    }
    const ratio = RATIOS[mode];
    let w = c.width;
    let h = w / ratio;
    if (h > c.height) {
      h = c.height;
      w = h * ratio;
    }
    setSel({ x: (c.width - w) / 2, y: (c.height - h) / 2, w, h });
  }

  async function save() {
    const img = imgRef.current;
    const c = canvasRef.current;
    if (!img || !c || !sel || sel.w < 4 || sel.h < 4) {
      setError("Drag on the photo to choose the area to keep.");
      return;
    }
    setBusy(true);
    try {
      const kx = img.naturalWidth / c.width;
      const ky = img.naturalHeight / c.height;
      const out = document.createElement("canvas");
      out.width = Math.round(sel.w * kx);
      out.height = Math.round(sel.h * ky);
      out.getContext("2d")!.drawImage(img, sel.x * kx, sel.y * ky, sel.w * kx, sel.h * ky, 0, 0, out.width, out.height);
      const blob = await new Promise<Blob | null>((r) => out.toBlob(r, "image/jpeg", 0.92));
      if (!blob) throw new Error("encode");
      const stem = filename.replace(/\.[^.]+$/, "");
      await onCropped(new File([blob], `${stem}-crop.jpg`, { type: "image/jpeg" }));
    } catch {
      setError("Could not crop this photo (it may be stored on another site).");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.cropWrap}>
      <p className={styles.hint}>
        Drag on the photo to choose the part to keep. A new cropped copy is saved — the original stays untouched.
      </p>
      <div className={s.toolbar} role="group" aria-label="Crop shape">
        {(["free", "4:3", "3:2", "1:1", "3:4"] as AspectMode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={aspect === m ? s.chipActive : s.chip}
            aria-pressed={aspect === m}
            onClick={() => {
              setAspect(m);
              centred(m);
            }}
          >
            {m === "free" ? "Any shape" : m}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className={styles.cropCanvas}
        aria-label="Crop area. Drag to select."
        onPointerDown={(e) => {
          const p = pos(e);
          drag.current = { ...p, on: true };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current.on) return;
          const p = pos(e);
          const r = {
            x: Math.min(p.x, drag.current.x),
            y: Math.min(p.y, drag.current.y),
            w: Math.abs(p.x - drag.current.x),
            h: Math.abs(p.y - drag.current.y),
          };
          setSel(fit(r));
        }}
        onPointerUp={() => {
          drag.current.on = false;
        }}
      />
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className={styles.rowActions}>
        <button type="button" className={styles.primaryBtn} onClick={save} disabled={busy}>
          {busy ? "Saving copy…" : "Save cropped copy"}
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
