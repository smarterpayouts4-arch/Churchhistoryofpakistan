import { promises as fs } from "fs";
import path from "path";
import { kvConfigured } from "@/lib/cms/kv";
import { localStoreDir } from "@/lib/cms/store";

/** Attachment limits — kept under Vercel's 4.5 MB request limit. */
export const CONTRIB_MAX_FILES = 4;
export const CONTRIB_MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const CONTRIB_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function contributionsBlobToken() {
  return process.env.CONTRIBUTIONS_BLOB_TOKEN || "";
}

/** Can submissions be stored somewhere the curator will see them? */
export function intakeStatus() {
  const hosted = Boolean(process.env.VERCEL);
  const inbox = kvConfigured() || !hosted;
  const webhook = Boolean(process.env.CONTRIBUTE_WEBHOOK_URL);
  const attachments = inbox && (!hosted || Boolean(contributionsBlobToken()));
  return { enabled: inbox || webhook, inbox, webhook, attachments };
}

/** Store a private attachment; returns its storage key. */
export async function storeAttachment(
  contributionId: string,
  fileId: string,
  filename: string,
  file: File,
): Promise<{ key: string; storage: "local" | "vercel-blob" }> {
  if (process.env.VERCEL) {
    const { put } = await import("@vercel/blob");
    const res = await put(`contributions/${contributionId}/${fileId}-${filename}`, file, {
      access: "private",
      contentType: file.type,
      token: contributionsBlobToken(),
      addRandomSuffix: true,
    });
    return { key: res.pathname, storage: "vercel-blob" };
  }
  const dir = path.join(localStoreDir(), "contributions", contributionId);
  await fs.mkdir(dir, { recursive: true });
  const key = `${fileId}-${filename}`;
  await fs.writeFile(path.join(dir, key), Buffer.from(await file.arrayBuffer()));
  return { key: `${contributionId}/${key}`, storage: "local" };
}

export async function readAttachment(
  key: string,
  storage: "local" | "vercel-blob",
): Promise<ReadableStream<Uint8Array> | Buffer | null> {
  if (storage === "vercel-blob") {
    const { get } = await import("@vercel/blob");
    const res = await get(key, { access: "private", token: contributionsBlobToken() });
    return res?.statusCode === 200 ? res.stream : null;
  }
  const root = path.join(localStoreDir(), "contributions");
  const full = path.join(root, key);
  if (!full.startsWith(root + path.sep)) return null;
  return fs.readFile(full).catch(() => null);
}

export async function deleteAttachments(keys: { key: string; storage: "local" | "vercel-blob" }[]) {
  for (const a of keys) {
    if (a.storage === "vercel-blob") {
      const { del } = await import("@vercel/blob");
      await del(a.key, { token: contributionsBlobToken() }).catch(() => {});
    } else {
      const root = path.join(localStoreDir(), "contributions");
      const full = path.join(root, a.key);
      if (full.startsWith(root + path.sep)) await fs.unlink(full).catch(() => {});
    }
  }
}
