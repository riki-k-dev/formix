import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { formId, status } = body;

    if (!formId || !status) {
      return NextResponse.json(
        { error: "Form ID and Status are required" },
        { status: 400 },
      );
    }

    const updateResult = await db
      .update(forms)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)))
      .returning();

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: "Form not found or you don't have permission" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Flow status updated to ${status}`,
    });
  } catch (error) {
    console.error("Toggle Flow Status Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
