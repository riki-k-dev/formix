import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, whatsappConfigs, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // PRO PLAN CHECK
    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: { plan: true },
    });

    if (dbUser?.plan !== "pro") {
      return NextResponse.json(
        { error: "WhatsApp Flows are a Pro feature. Please upgrade." },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { formId } = body;

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 },
      );
    }

    const formRecord = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!formRecord) {
      return NextResponse.json(
        { error: "Form not found or access denied" },
        { status: 404 },
      );
    }

    const existingConfig = await db.query.whatsappConfigs.findFirst({
      where: eq(whatsappConfigs.userId, session.user.id),
    });

    if (existingConfig) {
      await db
        .update(whatsappConfigs)
        .set({ activeFormId: formId, updatedAt: new Date() })
        .where(eq(whatsappConfigs.id, existingConfig.id));
    } else {
      await db.insert(whatsappConfigs).values({
        userId: session.user.id,
        phoneNumberId: "MOCK_PHONE_ID_" + crypto.randomBytes(4).toString("hex"),
        accessToken: "MOCK_ACCESS_TOKEN",
        verifyToken: crypto.randomBytes(16).toString("hex"),
        activeFormId: formId,
      });
    }

    await db
      .update(forms)
      .set({ hasWhatsapp: true, updatedAt: new Date() })
      .where(eq(forms.id, formId));

    return NextResponse.json({
      success: true,
      message: "WhatsApp Flow created!",
    });
  } catch (error) {
    console.error("Create WA Flow Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// SECURE DELETE METHOD
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId");

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 },
      );
    }

    // STRICT RLS: Update only if the form belongs to the user
    const updateResult = await db
      .update(forms)
      .set({
        hasWhatsapp: false,
        whatsappStatus: "draft",
        updatedAt: new Date(),
      })
      .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)))
      .returning();

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: "Form not found or access denied" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "WhatsApp flow disabled successfully",
    });
  } catch (error) {
    console.error("Delete WA Flow Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
