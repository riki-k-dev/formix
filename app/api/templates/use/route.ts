import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { FORM_TEMPLATES } from "@/lib/templates";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 },
      );
    }

    const template = FORM_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    const newFormId = crypto.randomUUID();

    const formSchema = {
      fields: template.fields,
    };

    const [newForm] = await db
      .insert(forms)
      .values({
        id: newFormId,
        userId: session.user.id,
        name: template.name,
        description: template.description,
        schema: JSON.stringify(formSchema),
        status: "draft",
      })
      .returning({ id: forms.id });

    return NextResponse.json({ success: true, formId: newForm.id });
  } catch (error) {
    console.error("Template Use Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
