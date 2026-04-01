import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, submissions } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm"; // 'count' import add kiya
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FormsClient from "./forms-client";

// 👇 FIX 1: Cache disable karo 👇
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

  return <FormsClient initialForms={userForms} />;
}
