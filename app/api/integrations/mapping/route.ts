import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { formIntegrations, userIntegrations, forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { mappingId, newConfig } = body;
    if (!mappingId || !newConfig)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );

    const validMapping = await db
      .select({ id: formIntegrations.id })
      .from(formIntegrations)
      .innerJoin(forms, eq(formIntegrations.formId, forms.id))
      .where(
        and(
          eq(formIntegrations.id, mappingId),
          eq(forms.userId, session.user.id),
        ),
      )
      .limit(1);

    if (validMapping.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db
      .update(formIntegrations)
      .set({ config: JSON.stringify(newConfig), updatedAt: new Date() })
      .where(eq(formIntegrations.id, mappingId));

    return NextResponse.json({ success: true, message: "Mapping updated" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const mappingId = searchParams.get("id");
    if (!mappingId)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const validMapping = await db
      .select({
        id: formIntegrations.id,
        integrationId: formIntegrations.integrationId,
      })
      .from(formIntegrations)
      .innerJoin(forms, eq(formIntegrations.formId, forms.id))
      .where(
        and(
          eq(formIntegrations.id, mappingId),
          eq(forms.userId, session.user.id),
        ),
      )
      .limit(1);

    if (validMapping.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const integrationId = validMapping[0].integrationId;

    await db.delete(formIntegrations).where(eq(formIntegrations.id, mappingId));

    const remainingMappings = await db
      .select({ id: formIntegrations.id })
      .from(formIntegrations)
      .where(eq(formIntegrations.integrationId, integrationId));

    if (remainingMappings.length === 0) {
      await db
        .delete(userIntegrations)
        .where(eq(userIntegrations.id, integrationId));
    }

    return NextResponse.json({ success: true, message: "Mapping deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
