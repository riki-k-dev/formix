import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { formIntegrations, userIntegrations, forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { encryptConfig } from "@/lib/encryption";
import { validateWebhookUrl } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { formId, provider, type, credentials, config } = body;

    if (!formId || !provider || !type || !credentials || !config) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (
      ["slack", "discord", "zapier"].includes(provider) &&
      config.webhookUrl
    ) {
      const validation = validateWebhookUrl(provider, config.webhookUrl);
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    const formRecord = await db.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    });

    if (!formRecord)
      return NextResponse.json({ error: "Form not found" }, { status: 404 });

    const encryptedCredentials = encryptConfig(JSON.stringify(credentials));
    const encryptedConfig = encryptConfig(JSON.stringify(config));

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
          credentials: encryptedCredentials,
        })
        .returning();
      userIntegration = newIntegration;
    } else {
      await db
        .update(userIntegrations)
        .set({ credentials: encryptedCredentials, updatedAt: new Date() })
        .where(eq(userIntegrations.id, userIntegration.id));
    }

    await db.insert(formIntegrations).values({
      formId: formId,
      integrationId: userIntegration.id,
      type: type,
      config: encryptedConfig,
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
