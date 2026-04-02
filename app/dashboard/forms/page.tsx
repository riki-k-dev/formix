import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, submissions, formIntegrations } from "@/db/schema";
import { eq, desc, count, inArray, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FormsClient from "./forms-client";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
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
      description: forms.description,
      status: forms.status,
      hasWhatsapp: forms.hasWhatsapp,
      hasWebhook: forms.hasWebhook,
      createdAt: forms.createdAt,
      submissionsCount: count(submissions.id),
    })
    .from(forms)
    .leftJoin(submissions, eq(submissions.formId, forms.id))
    .where(eq(forms.userId, session.user.id))
    .groupBy(forms.id)
    .orderBy(desc(forms.createdAt));

  const formIds = userForms.map((f) => f.id);
  let integratedFormIds = new Set<string>();

  if (formIds.length > 0) {
    const activeIntegrations = await db
      .select({ formId: formIntegrations.formId })
      .from(formIntegrations)
      .where(
        and(
          inArray(formIntegrations.formId, formIds),
          eq(formIntegrations.isActive, true),
        ),
      );

    integratedFormIds = new Set(activeIntegrations.map((i) => i.formId));
  }

  const formsWithIntegrations = userForms.map((form) => ({
    ...form,
    hasIntegration: integratedFormIds.has(form.id),
  }));

  return <FormsClient initialForms={formsWithIntegrations} />;
}
