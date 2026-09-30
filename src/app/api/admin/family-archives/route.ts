import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getFamilyArchives, saveFamilyArchives } from "@/lib/cms/store";
import {
  familyArchiveNoteSchema,
  familyArchiveUpsertSchema,
} from "@/lib/cms/schemas";
import type { FamilyArchiveItem } from "@/lib/cms/types";

export const runtime = "nodejs";

function slugifyId(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `fa-${base || "item"}-${Date.now().toString(36)}`;
}

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;
  const data = await getFamilyArchives();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = familyArchiveNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = await getFamilyArchives();
  data.note = parsed.data.note;
  await saveFamilyArchives(data);
  revalidatePath("/");
  revalidatePath("/archive");
  return NextResponse.json({ ok: true, note: data.note });
}

export async function POST(req: NextRequest) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const withDefaults = {
    provenance: "Family Archive" as const,
    ...(typeof body === "object" && body ? body : {}),
    id:
      typeof body === "object" &&
      body &&
      "id" in body &&
      typeof (body as { id: unknown }).id === "string" &&
      (body as { id: string }).id.trim()
        ? (body as { id: string }).id.trim()
        : slugifyId(
            typeof body === "object" &&
              body &&
              "title" in body &&
              typeof (body as { title: unknown }).title === "string"
              ? (body as { title: string }).title
              : "item",
          ),
  };

  const parsed = familyArchiveUpsertSchema.safeParse(withDefaults);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = await getFamilyArchives();
  if (data.items.some((i) => i.id === parsed.data.id)) {
    return NextResponse.json(
      { error: "An item with this id already exists." },
      { status: 409 },
    );
  }

  const item: FamilyArchiveItem = {
    ...parsed.data,
    provenance: "Family Archive",
  };
  if (!item.contextNote) delete item.contextNote;
  if (!item.references?.length) delete item.references;
  data.items.unshift(item);
  await saveFamilyArchives(data);
  revalidatePath("/");
  revalidatePath("/archive");
  return NextResponse.json({ ok: true, item }, { status: 201 });
}
