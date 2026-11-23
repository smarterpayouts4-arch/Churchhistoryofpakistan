import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { adminRoute } from "@/lib/admin/route";
import { IMAGE_TYPES, MAX_VIDEO_BYTES, VIDEO_TYPES } from "@/lib/media/rules";

export const runtime = "nodejs";

/**
 * Issues short-lived client tokens so the browser uploads straight to
 * Vercel Blob (no 4.5 MB serverless body limit — large photos and videos
 * work). Only signed-in admins/editors get a token.
 */
export const POST = adminRoute(async (req: NextRequest) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Photo storage (Vercel Blob) is not connected on this site." },
      { status: 503 },
    );
  }
  const body = (await req.json()) as HandleUploadBody;
  const json = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async (pathname) => {
      if (!pathname.startsWith("uploads/")) throw new Error("Invalid upload path");
      return {
        allowedContentTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
        maximumSizeInBytes: MAX_VIDEO_BYTES,
        addRandomSuffix: true,
        validUntil: Date.now() + 60 * 60 * 1000,
      };
    },
  });
  return NextResponse.json(json);
});
