"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/app/admin/admin.module.css";

type AspectMode = "free" | "4:3" | "3:4";

type Props = {
  destination?: "uploads" | "facebook" | "cathedrals";
  onUploaded: (publicPath: string) => void;
};

type DragRect = { x: number; y: number; w: number; h: number };

export function ImageCropUpload({
  destination = "uploads",
  onUploaded,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [aspect, setAspect] = useState<AspectMode>("4:3");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const drag = useRef<{
    startX: number;
    startY: number;
    rect: DragRect | null;
    dragging: boolean;
  }>({ startX: 0, startY: 0, rect: null, dragging: false });
  const [selection, setSelection] = useState<DragRect | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const rect = selection;
    if (rect && rect.w > 2 && rect.h > 2) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
      ctx.drawImage(
        img,
        (rect.x / canvas.width) * img.naturalWidth,
        (rect.y / canvas.height) * img.naturalHeight,
        (rect.w / canvas.width) * img.naturalWidth,
        (rect.h / canvas.height) * img.naturalHeight,
        rect.x,
        rect.y,
        rect.w,
        rect.h,
      );
      ctx.strokeStyle = "#af8b58";
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
  }, [selection]);

  useEffect(() => {
    draw();
  }, [draw]);

  function loadFile(file: File) {
    setError(null);
    setStatus(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxW = 640;
      const scale = Math.min(1, maxW / img.naturalWidth);
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      // default selection: full or aspect-fitted
      const full: DragRect = { x: 0, y: 0, w: canvas.width, h: canvas.height };
      setSelection(fitAspect(full, aspect, canvas.width, canvas.height));
      setHasImage(true);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Could not load that image.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function pointerPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    return { x, y };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!hasImage) return;
    const { x, y } = pointerPos(e);
    drag.current = { startX: x, startY: y, rect: null, dragging: true };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drag.current.dragging || !canvasRef.current) return;
    const { x, y } = pointerPos(e);
    const canvas = canvasRef.current;
    let w = x - drag.current.startX;
    let h = y - drag.current.startY;
    let rx = drag.current.startX;
    let ry = drag.current.startY;
    if (w < 0) {
      rx = x;
      w = Math.abs(w);
    }
    if (h < 0) {
      ry = y;
      h = Math.abs(h);
    }
    let rect: DragRect = { x: rx, y: ry, w, h };
    rect = fitAspect(rect, aspect, canvas.width, canvas.height, true);
    drag.current.rect = rect;
    setSelection(rect);
  }

  function onPointerUp() {
    drag.current.dragging = false;
  }

  async function upload() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !selection) {
      setError("Load an image and select a crop area first.");
      return;
    }
    setPending(true);
    setError(null);
    setStatus(null);
    try {
      const out = document.createElement("canvas");
      const sx = (selection.x / canvas.width) * img.naturalWidth;
      const sy = (selection.y / canvas.height) * img.naturalHeight;
      const sw = (selection.w / canvas.width) * img.naturalWidth;
      const sh = (selection.h / canvas.height) * img.naturalHeight;
      out.width = Math.max(1, Math.round(sw));
      out.height = Math.max(1, Math.round(sh));
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, out.width, out.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        out.toBlob(resolve, "image/jpeg", 0.9),
      );
      if (!blob) throw new Error("Could not encode crop");
      const form = new FormData();
      form.append("file", blob, "crop.jpg");
      form.append("destination", destination);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        path?: string;
      };
      if (!res.ok || !data.path) {
        setError(data.error || "Upload failed.");
        return;
      }
      setStatus(`Uploaded: ${data.path}`);
      onUploaded(data.path);
    } catch {
      setError("Upload failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.cropWrap}>
      <p className={styles.hint}>
        Optional client-side crop. Drag on the preview to select an area, then
        upload. Aspect: free, 4:3, or 3:4.
      </p>
      <div className={styles.tabs} role="group" aria-label="Crop aspect">
        {(["free", "4:3", "3:4"] as AspectMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            className={aspect === mode ? styles.tabActive : styles.tab}
            onClick={() => {
              setAspect(mode);
              if (canvasRef.current && selection) {
                setSelection(
                  fitAspect(
                    selection,
                    mode,
                    canvasRef.current.width,
                    canvasRef.current.height,
                  ),
                );
              }
            }}
          >
            {mode}
          </button>
        ))}
      </div>
      <label className={styles.label}>
        Choose image
        <input
          className={styles.input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadFile(f);
          }}
        />
      </label>
      <canvas
        ref={canvasRef}
        className={styles.cropCanvas}
        aria-label="Crop preview"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      <div className={styles.rowActions}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={upload}
          disabled={!hasImage || pending}
        >
          {pending ? "Uploading…" : "Upload crop"}
        </button>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={async () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpeg,image/png,image/webp,image/gif";
            input.onchange = async () => {
              const f = input.files?.[0];
              if (!f) return;
              setPending(true);
              setError(null);
              try {
                const form = new FormData();
                form.append("file", f);
                form.append("destination", destination);
                const res = await fetch("/api/admin/upload", {
                  method: "POST",
                  body: form,
                });
                const data = (await res.json().catch(() => ({}))) as {
                  error?: string;
                  path?: string;
                };
                if (!res.ok || !data.path) {
                  setError(data.error || "Upload failed.");
                  return;
                }
                setStatus(`Uploaded: ${data.path}`);
                onUploaded(data.path);
              } catch {
                setError("Upload failed.");
              } finally {
                setPending(false);
              }
            };
            input.click();
          }}
          disabled={pending}
        >
          Upload without crop
        </button>
      </div>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {status ? <p className={styles.success}>{status}</p> : null}
    </div>
  );
}

function fitAspect(
  rect: DragRect,
  aspect: AspectMode,
  maxW: number,
  maxH: number,
  fromDrag = false,
): DragRect {
  let { x, y, w, h } = rect;
  if (aspect === "free") {
    w = Math.min(w, maxW - x);
    h = Math.min(h, maxH - y);
    return { x, y, w: Math.max(1, w), h: Math.max(1, h) };
  }
  const ratio = aspect === "4:3" ? 4 / 3 : 3 / 4;
  if (fromDrag) {
    // lock height from width
    h = w / ratio;
    if (y + h > maxH) {
      h = maxH - y;
      w = h * ratio;
    }
    if (x + w > maxW) {
      w = maxW - x;
      h = w / ratio;
    }
  } else {
    // center-fit inside rect
    const targetH = w / ratio;
    if (targetH <= h) {
      y = y + (h - targetH) / 2;
      h = targetH;
    } else {
      const targetW = h * ratio;
      x = x + (w - targetW) / 2;
      w = targetW;
    }
  }
  x = Math.max(0, Math.min(x, maxW - 1));
  y = Math.max(0, Math.min(y, maxH - 1));
  w = Math.max(1, Math.min(w, maxW - x));
  h = Math.max(1, Math.min(h, maxH - y));
  return { x, y, w, h };
}
