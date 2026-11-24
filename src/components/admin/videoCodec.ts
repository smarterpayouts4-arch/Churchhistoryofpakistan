"use client";

/**
 * Spot HEVC (H.265) videos before upload. iPhones record HEVC by default
 * ("High Efficiency"); many browsers, Chrome on older computers and phones
 * especially, can't play it. The upload is still allowed; we only warn.
 */

export const HEVC_WARNING =
  "This video may not play in some browsers. On iPhone, set Camera → Formats → Most Compatible, or send it as MP4.";

const HEVC_SAMPLE_ENTRIES = ["hvc1", "hev1", "dvh1", "dvhe"];
const MAX_MOOV_BYTES = 16 * 1024 * 1024;

async function bytes(file: Blob, start: number, end: number) {
  return new Uint8Array(await file.slice(start, end).arrayBuffer());
}

function type4(b: Uint8Array, at: number) {
  return String.fromCharCode(b[at], b[at + 1], b[at + 2], b[at + 3]);
}

/** Find the top-level `moov` box of an MP4/MOV by walking box headers (cheap even for big files). */
async function findMoov(file: File): Promise<{ start: number; size: number } | null> {
  let offset = 0;
  for (let i = 0; i < 64 && offset + 8 <= file.size; i++) {
    const h = await bytes(file, offset, offset + 16);
    if (h.length < 8) return null;
    const view = new DataView(h.buffer, h.byteOffset, h.byteLength);
    let size = view.getUint32(0);
    const type = type4(h, 4);
    let header = 8;
    if (size === 1 && h.length >= 16) {
      size = view.getUint32(8) * 2 ** 32 + view.getUint32(12);
      header = 16;
    } else if (size === 0) {
      size = file.size - offset;
    }
    if (size < header) return null;
    if (type === "moov") return { start: offset, size };
    offset += size;
  }
  return null;
}

/** True when the video's track is HEVC; false when it isn't or can't be told. */
export async function isHevcVideo(file: File): Promise<boolean> {
  try {
    const moov = await findMoov(file);
    if (!moov || moov.size > MAX_MOOV_BYTES) return false;
    const box = await bytes(file, moov.start, moov.start + moov.size);
    const text = new TextDecoder("latin1").decode(box);
    const stsd = text.indexOf("stsd");
    if (stsd < 0) return false;
    return HEVC_SAMPLE_ENTRIES.some((t) => text.indexOf(t, stsd) >= 0);
  } catch {
    return false;
  }
}
