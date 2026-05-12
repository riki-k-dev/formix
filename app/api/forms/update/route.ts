import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { updateFormValidator } from "@/lib/validators";
import { dashboardApiRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. DASHBOARD RATE LIMITING
    const { success } = await dashboardApiRateLimit.limit(session.user.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many actions performed. Please slow down." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsedBody = updateFormValidator.safeParse(body);

    if (!parsedBody.success) {
      const errorMessage = parsedBody.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { formId, name, description, schema } = parsedBody.data;

    const updateResult = await db
      .update(forms)
      .set({
        name: name,
        description: description,
        schema: schema,
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
      message: "Form updated successfully",
    });
  } catch (error) {
    console.error("Update Form Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
