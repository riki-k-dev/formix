import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

type FormSchema = {
  fields: Array<{
    name: string;
    label: string;
    type: string;
  }>;
};

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { formId, currentStep, collectedData, incomingText } =
      await req.json();

    const form = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const schema = form.schema as FormSchema;

    const currentField = schema.fields[currentStep];
    const newCollectedData = { ...collectedData };

    if (currentField && incomingText) {
      newCollectedData[currentField.name] = incomingText;
    }

    const nextStep = currentStep + 1;

    if (nextStep >= schema.fields.length) {
      return NextResponse.json({
        reply:
          "✅ Thank you! Your response has been securely recorded. (Simulation Ended)",
        nextStep: -1,
        collectedData: newCollectedData,
      });
    }

    const nextField = schema.fields[nextStep];
    return NextResponse.json({
      reply: nextField.label,
      nextStep: nextStep,
      collectedData: newCollectedData,
    });
  } catch (error) {
    console.error("Simulator Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
