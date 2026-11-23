import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { adminRoute } from "@/lib/admin/route";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, VIDEO_TYPES } from "@/lib/media/rules";
import { sectionUploadProblem } from "@/lib/sections/upload-guard";

export const runtime = "nodejs";

/**
 * Issues short-lived client tokens so the browser uploads straight to
 * Vercel Blob (no 4.5 MB serverless body limit — large photos and videos
 * work). Only signed-in admins/editors get a token. Uploads into a
 * "Photos & videos" section send {"section", "kind"} as the client payload,
 * so a full section is refused before any bytes are stored.
 */
export const POST = adminRoute(async (req: NextRequest) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Photo storage (Vercel Blob) is not connected on this site." },
      { status: 503 },
    );
  }
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("uploads/")) throw new Error("Invalid upload path");
        let payload: { section?: string; kind?: string; replace?: boolean } = {};
        try {
          payload = clientPayload ? JSON.parse(clientPayload) : {};
        } catch {
          /* no payload: a general library upload */
        }
        const kind = payload.kind === "video" ? "video" : payload.kind === "image" ? "image" : null;
        if (kind) {
          const problem = await sectionUploadProblem(payload.section, kind, payload.replace === true);
          if (problem) throw new Error(problem.error);
        }
        return {
          allowedContentTypes:
            kind === "image" ? [...IMAGE_TYPES] : kind === "video" ? [...VIDEO_TYPES] : [...IMAGE_TYPES, ...VIDEO_TYPES],
          maximumSizeInBytes: kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 60 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    // e.g. the section is full: show the reason in the admin.
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload refused." }, { status: 400 });
  }
});
