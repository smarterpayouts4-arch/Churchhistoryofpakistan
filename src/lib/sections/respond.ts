import { NextResponse } from "next/server";
import { SectionError } from "./server";

/** Turn a SectionError into a friendly JSON reply; anything else is re-thrown. */
export function sectionErrorResponse(err: unknown) {
  if (err instanceof SectionError) {
    return NextResponse.json({ error: err.message, ...err.extra }, { status: err.status });
  }
  throw err;
}
