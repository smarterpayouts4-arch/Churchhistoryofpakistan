"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { readDoc, writeDoc } from "@/lib/cms/store";
import type { Contribution, ContributionsFile } from "@/lib/cms/types";
import { rateLimit, clientIp } from "@/lib/auth/rate-limit";
import { safeMediaFilename } from "@/lib/media/rules";
import {
  CONTRIB_MAX_FILES,
  CONTRIB_MAX_TOTAL_BYTES,
  CONTRIB_TYPES,
  intakeStatus,
  storeAttachment,
} from "@/lib/contributions/intake";

export type ShareStoryState = {
  ok: boolean;
  message: string;
};

const TEXT_LIMIT = 8000;

export async function submitStory(
  _prev: ShareStoryState,
  formData: FormData,
): Promise<ShareStoryState> {
  const status = intakeStatus();
  if (!status.enabled) {
    return {
      ok: false,
      message:
        "Sharing stories online is not switched on for this site yet. Nothing was sent. Please contact the Project Curator directly.",
    };
  }

  // Honeypot: real people never fill the hidden "website" field.
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true, message: "Thank you for sharing your story." };
  }

  const ip = clientIp(await headers());
  const limit = await rateLimit(`contribute:${ip}`, 5, 60 * 60);
  if (!limit.allowed) {
    return {
      ok: false,
      message: "Too many submissions from this connection. Please try again in an hour. Nothing was sent.",
    };
  }

  if (formData.get("rights_confirmation") !== "on" || formData.get("publication_consent") !== "on") {
    return {
      ok: false,
      message: "Please confirm rights and publication consent before submitting. Nothing was sent.",
    };
  }

  const fields: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || key.startsWith("$") || key === "website") continue;
    fields[key.slice(0, 80)] = value.slice(0, TEXT_LIMIT);
  }
  const email = fields.contact_email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please check the email address. Nothing was sent." };
  }
  if (!fields.story?.trim() && !fields.subject?.trim()) {
    return {
      ok: false,
      message: "Please tell us who or what your story is about. Nothing was sent.",
    };
  }

  const files = formData
    .getAll("uploads")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length && !status.attachments) {
    return {
      ok: false,
      message: "File uploads are not available on this site yet. Please remove the files, or email them to the curator. Nothing was sent.",
    };
  }
  if (files.length > CONTRIB_MAX_FILES) {
    return { ok: false, message: `Please attach at most ${CONTRIB_MAX_FILES} files. Nothing was sent.` };
  }
  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > CONTRIB_MAX_TOTAL_BYTES) {
    return { ok: false, message: "The attached files are too large together (limit 4 MB). Nothing was sent." };
  }
  if (files.some((f) => !CONTRIB_TYPES.includes(f.type))) {
    return { ok: false, message: "Please attach JPEG, PNG or WebP photos, or PDF documents only. Nothing was sent." };
  }

  const id = `c-${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
  const contribution: Contribution = {
    id,
    receivedAt: new Date().toISOString(),
    status: "new",
    fields,
    attachments: [],
  };

  try {
    if (status.inbox) {
      for (const file of files) {
        const fileId = randomUUID().slice(0, 8);
        const filename = safeMediaFilename(file.name || "file", file.type);
        const stored = await storeAttachment(id, fileId, filename, file);
        contribution.attachments.push({
          id: fileId,
          filename,
          contentType: file.type,
          bytes: file.size,
          ...stored,
        });
      }
      const inbox = await readDoc<ContributionsFile>("contributions.json");
      await writeDoc("contributions.json", { items: [contribution, ...(inbox.items ?? [])].slice(0, 2000) });
    }
  } catch (err) {
    console.error("[contribute]", err);
    return {
      ok: false,
      message: "We could not save your story just now. Nothing was confirmed as saved. Please try again later.",
    };
  }

  if (status.webhook) {
    try {
      const res = await fetch(process.env.CONTRIBUTE_WEBHOOK_URL as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CONTRIBUTE_API_KEY
            ? { Authorization: `Bearer ${process.env.CONTRIBUTE_API_KEY}` }
            : {}),
        },
        body: JSON.stringify({
          id,
          receivedAt: contribution.receivedAt,
          fields,
          attachments: contribution.attachments.map((a) => ({
            filename: a.filename,
            bytes: a.bytes,
            contentType: a.contentType,
          })),
        }),
      });
      if (!res.ok && !status.inbox) {
        return { ok: false, message: `The story service returned an error (${res.status}). Nothing was confirmed as saved.` };
      }
    } catch {
      if (!status.inbox) {
        return { ok: false, message: "Could not reach the story service. Nothing was submitted." };
      }
    }
  }

  return {
    ok: true,
    message:
      files.length > 0
        ? `Thank you for sharing your story. It arrived with ${files.length} file${files.length === 1 ? "" : "s"}. The Project Curator will review rights and sources before anything is published.`
          : "Thank you for sharing your story. The Project Curator will review rights and sources before anything is published.",
  };
}
