import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, apiKeys } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ApiWebhooksClient from "./api-webhooks-client";
import crypto from "crypto";

export default async function ApiWebhooksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const userForms = await db
    .select({
      id: forms.id,
      name: forms.name,
      hasWebhook: forms.hasWebhook,
      webhookUrl: forms.webhookUrl,
    })
    .from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.createdAt));

  let userApiKeyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.userId, session.user.id),
  });

  if (!userApiKeyRecord) {
    const newKey = `fmx_live_${crypto.randomBytes(16).toString("hex")}`;
    const newId = `key_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;

    const [insertedKey] = await db
      .insert(apiKeys)
      .values({
        id: newId,
        userId: session.user.id,
        key: newKey,
      })
      .returning();

    userApiKeyRecord = insertedKey;
  }

  return (
    <ApiWebhooksClient initialForms={userForms} apiKey={userApiKeyRecord.key} />
  );
}
