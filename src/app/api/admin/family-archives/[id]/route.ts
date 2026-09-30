import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { getFamilyArchives, saveFamilyArchives } from "@/lib/cms/store";
import { familyArchiveUpsertSchema } from "@/lib/cms/schemas";
import type { FamilyArchiveItem } from "@/lib/cms/types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = familyArchiveUpsertSchema.safeParse({
    provenance: "Family Archive",
    ...(typeof body === "object" && body ? body : {}),
    id,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = await getFamilyArchives();
  const idx = data.items.findIndex((i) => i.id === id);
  if (idx < 0) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const raw =
    typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const item: FamilyArchiveItem = {
    ...parsed.data,
    id,
    provenance: "Family Archive",
  };
  if (!("references" in raw)) {
    item.references = data.items[idx]!.references;
  }
  if (!item.contextNote) delete item.contextNote;
  if (!item.references?.length) delete item.references;
  data.items[idx] = item;
  await saveFamilyArchives(data);
  revalidatePath("/");
  revalidatePath("/archive");
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const data = await getFamilyArchives();
  const next = data.items.filter((i) => i.id !== id);
  if (next.length === data.items.length) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  data.items = next;
  await saveFamilyArchives(data);
  revalidatePath("/");
  revalidatePath("/archive");
  return NextResponse.json({ ok: true });
}
