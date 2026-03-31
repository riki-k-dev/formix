import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { formId, hasWebhook, webhookUrl } = body;

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 },
      );
    }

    const existingForm = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!existingForm) {
      return NextResponse.json(
        { error: "Form not found or you don't have permission" },
        { status: 404 },
      );
    }

    await db
      .update(forms)
      .set({
        hasWebhook: hasWebhook,
        webhookUrl: webhookUrl || null,
      })
      .where(eq(forms.id, formId));

    return NextResponse.json({
      success: true,
      message: "Webhook updated successfully",
    });
  } catch (error) {
    console.error("Update Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
