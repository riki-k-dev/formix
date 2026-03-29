import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, formIntegrations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

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

    await db
      .delete(formIntegrations)
      .where(eq(formIntegrations.formId, formId));

    await db
      .delete(forms)
      .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)));

    return NextResponse.json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    console.error("Form Deletion Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
