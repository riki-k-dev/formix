// app/api/v1/submit/[formId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { forms, submissions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { formId: string } },
) {
  try {
    // 1. Get the form ID from the URL
    const { formId } = await params;

    // 2. Check if the form exists in our database
    const formRecord = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!formRecord) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (formRecord.status !== "active") {
      return NextResponse.json(
        { error: "This form is currently inactive" },
        { status: 400, headers: corsHeaders },
      );
    }

    // 3. Parse the incoming submitted data
    const body = await req.json();

    const submissionData = body.data || body;

    if (!submissionData || Object.keys(submissionData).length === 0) {
      return NextResponse.json(
        { error: "Submission data is empty" },
        { status: 400, headers: corsHeaders },
      );
    }

    // 4. Generate unique ID for this submission
    const submissionId = `sub_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;

    // 5. Save the submission to the database
    await db.insert(submissions).values({
      id: submissionId,
      formId: formRecord.id,
      data: JSON.stringify(submissionData),
    });

    // 6. Update the submission count on the main form table
    await db
      .update(forms)
      .set({ submissionsCount: sql`${forms.submissionsCount} + 1` })
      .where(eq(forms.id, formRecord.id));

    // 7. Return success to the developer
    return NextResponse.json(
      { success: true, message: "Submission successful", submissionId },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Submission API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
