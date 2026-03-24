import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, submissions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get("id");
    const formId = searchParams.get("formId");

    if (!submissionId || !formId) {
      return NextResponse.json(
        { error: "Missing required IDs" },
        { status: 400 },
      );
    }

    const formRecord = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!formRecord) {
      return NextResponse.json(
        { error: "Unauthorized access to this form" },
        { status: 403 },
      );
    }

    await db.delete(submissions).where(eq(submissions.id, submissionId));

    await db
      .update(forms)
      .set({ submissionsCount: sql`${forms.submissionsCount} - 1` })
      .where(eq(forms.id, formId));

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch (error) {
    console.error("Delete Submission Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
