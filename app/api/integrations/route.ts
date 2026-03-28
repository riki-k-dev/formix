import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { formIntegrations, userIntegrations, forms } from "@/db/schema";
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
    const { formId, provider, type, credentials, config } = body;

    if (!formId || !provider || !type || !credentials || !config) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const formRecord = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!formRecord) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    let userIntegration = await db.query.userIntegrations.findFirst({
      where: and(
        eq(userIntegrations.userId, session.user.id),
        eq(userIntegrations.provider, provider),
      ),
    });

    if (!userIntegration) {
      const [newIntegration] = await db
        .insert(userIntegrations)
        .values({
          userId: session.user.id,
          provider: provider,
          credentials: JSON.stringify(credentials),
        })
        .returning();
      userIntegration = newIntegration;
    } else {
      await db
        .update(userIntegrations)
        .set({
          credentials: JSON.stringify(credentials),
          updatedAt: new Date(),
        })
        .where(eq(userIntegrations.id, userIntegration.id));
    }

    await db.insert(formIntegrations).values({
      formId: formId,
      integrationId: userIntegration.id,
      type: type,
      config: JSON.stringify(config),
    });

    return NextResponse.json({
      success: true,
      message: "Integration connected successfully!",
    });
  } catch (error) {
    console.error("Integration Save Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
