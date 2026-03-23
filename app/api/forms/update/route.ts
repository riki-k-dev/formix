import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Authenticate User
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get data from frontend
    const body = await req.json();
    const { formId, name, description, schema } = body;

    if (!formId || !schema) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 3. Security Check & Update Database
    const updateResult = await db
      .update(forms)
      .set({
        name: name,
        description: description,
        schema: JSON.stringify(schema),
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
