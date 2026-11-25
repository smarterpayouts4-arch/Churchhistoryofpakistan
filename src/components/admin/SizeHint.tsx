"use client";

import { useRef, useState } from "react";
import { chatGptText, sizeLine, type PhotoSize } from "@/lib/media/sizeHints";
import { Icon } from "./Icon";
import c from "./SizeHint.module.css";

/** Copy text; works on iPhone too (older Safari falls back to a hidden text box). */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the older way */
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;";
  document.body.appendChild(ta);
  let ok = false;
  try {
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

/**
 * A small note next to a photo slot: the best shape and size for that spot,
 * plus one button that copies a ready-made request for ChatGPT.
 */
export function SizeHint({ size, label, compact }: { size: PhotoSize; label?: string; compact?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const box = useRef<HTMLTextAreaElement>(null);
  const text = chatGptText(size);

  return (
    <div className={compact ? c.boxCompact : c.box} data-size-hint="">
      <p className={c.line}>
        <span className={c.icon} aria-hidden="true">
          <Icon name="crop" size={20} />
        </span>
        <span>
          {label ? <>{label}: </> : null}
          <strong>{sizeLine(size)}</strong>
          {size.ratio ? ` (${size.ratio}).` : "."} {size.tip}
        </span>
      </p>
      <p className={c.line2}>
        <span>Photo doesn’t fit? ChatGPT can resize it for you.</span>
        <button
          type="button"
          className={c.copyBtn}
          onClick={async () => {
            const ok = await copyText(text);
            setState(ok ? "copied" : "manual");
            if (!ok) {
              requestAnimationFrame(() => {
                box.current?.focus();
                box.current?.setSelectionRange(0, text.length);
              });
            }
          }}
        >
          {state === "copied" ? "Copied ✓" : "Copy instructions for ChatGPT"}
        </button>
      </p>
      {state !== "idle" ? (
        <div className={c.after}>
          <p role="status" className={c.status}>
            {state === "copied"
              ? "Copied. In ChatGPT, attach your photo, paste this message and send it. Then upload the photo ChatGPT gives back."
              : "Press and hold the message below, choose “Select All”, then “Copy”. In ChatGPT, attach your photo and paste it."}
          </p>
          <textarea ref={box} className={c.text} readOnly rows={5} value={text} aria-label="Instructions for ChatGPT" onFocus={(e) => e.currentTarget.select()} />
        </div>
      ) : null}
    </div>
  );
}
