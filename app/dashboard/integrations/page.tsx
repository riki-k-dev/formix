import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, userIntegrations, formIntegrations } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import IntegrationsClient from "./integrations-client";
import { decryptConfig } from "@/lib/encryption";

export type MappingType = {
  id: string;
  formId: string;
  formName: string;
  config: string;
  isActive: boolean;
};

export default async function IntegrationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) redirect("/login");

  const userForms = await db.query.forms.findMany({
    where: eq(forms.userId, session.user.id),
    orderBy: [desc(forms.createdAt)],
  });

  const detailedConnections = await db
    .select({
      provider: userIntegrations.provider,
      credentials: userIntegrations.credentials,
      integrationId: userIntegrations.id,
      mappingId: formIntegrations.id,
      formId: forms.id,
      formName: forms.name,
      mappingConfig: formIntegrations.config,
      mappingActive: formIntegrations.isActive,
    })
    .from(userIntegrations)
    .innerJoin(
      formIntegrations,
      eq(formIntegrations.integrationId, userIntegrations.id),
    )
    .innerJoin(forms, eq(formIntegrations.formId, forms.id))
    .where(
      and(
        eq(userIntegrations.userId, session.user.id),
        eq(userIntegrations.isActive, true),
      ),
    );

  const connectionsByProvider: Record<
    string,
    { integrationId: string; credentials: string; mappings: MappingType[] }
  > = {};

  detailedConnections.forEach((conn) => {
    let decryptedCreds = "{}";
    let decryptedConfig = "{}";
    try {
      decryptedCreds = decryptConfig(conn.credentials);
      decryptedConfig = decryptConfig(conn.mappingConfig);
    } catch {
      console.error("Failed to decrypt config for", conn.provider);
    }

    if (!connectionsByProvider[conn.provider]) {
      connectionsByProvider[conn.provider] = {
        integrationId: conn.integrationId,
        credentials: decryptedCreds,
        mappings: [],
      };
    }
    connectionsByProvider[conn.provider].mappings.push({
      id: conn.mappingId,
      formId: conn.formId,
      formName: conn.formName,
      config: decryptedConfig,
      isActive: conn.mappingActive,
    });
  });

  const connectedProviderIds = Object.keys(connectionsByProvider);

  return (
    <IntegrationsClient
      availableForms={userForms.map((f) => ({ id: f.id, name: f.name }))}
      connectedProviderIds={connectedProviderIds}
      connectionsByProvider={connectionsByProvider}
    />
  );
}
