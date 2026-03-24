import { NextResponse } from "next/server";
import { db } from "@/db";
import { forms, submissions, apiKeys } from "@/db/schema";
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
    const { formId } = await params;

    const formRecord = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!formRecord || formRecord.status !== "active") {
      return NextResponse.json(
        { error: "Form not found or inactive" },
        { status: 404, headers: corsHeaders },
      );
    }

    const origin =
      req.headers.get("origin") || req.headers.get("referer") || "";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const isInternalRequest =
      origin.includes("localhost:3000") || (appUrl && origin.includes(appUrl));

    if (!isInternalRequest) {
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            error:
              "Unauthorized: Missing or invalid API Key. Please provide 'Authorization: Bearer YOUR_KEY' in headers.",
          },
          { status: 401, headers: corsHeaders },
        );
      }

      const providedKey = authHeader.split(" ")[1];

      const validKeyRecordArray = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.key, providedKey))
        .limit(1);

      const validKeyRecord = validKeyRecordArray[0];

      if (!validKeyRecord || validKeyRecord.userId !== formRecord.userId) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid API Key for this form." },
          { status: 403, headers: corsHeaders },
        );
      }
    }

    const body = await req.json();
    const submissionData = body.data || body;

    if (!submissionData || Object.keys(submissionData).length === 0) {
      return NextResponse.json(
        { error: "Submission data is empty" },
        { status: 400, headers: corsHeaders },
      );
    }

    const submissionId = `sub_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;

    await db.insert(submissions).values({
      id: submissionId,
      formId: formRecord.id,
      data: JSON.stringify(submissionData),
    });

    await db
      .update(forms)
      .set({ submissionsCount: sql`${forms.submissionsCount} + 1` })
      .where(eq(forms.id, formRecord.id));

    if (formRecord.hasWebhook && formRecord.webhookUrl) {
      fetch(formRecord.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Formix-Webhook-Engine/1.0",
        },
        body: JSON.stringify({
          event: "form.submitted",
          formId: formRecord.id,
          formName: formRecord.name,
          submissionId: submissionId,
          timestamp: new Date().toISOString(),
          data: submissionData,
        }),
      }).catch((err) => console.error(`Webhook Delivery Failed:`, err));
    }

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
