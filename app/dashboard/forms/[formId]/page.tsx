import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import EditFormClient from "./edit-client";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  // 1. Authenticate user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  // 2. Fetch the specific form
  const formRecord = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
  });

  if (!formRecord) {
    notFound();
  }

  // 3. Safely parse the JSON schema
  let parsedSchema;
  try {
    parsedSchema = JSON.parse(formRecord.schema);
  } catch {
    parsedSchema = {
      name: formRecord.name,
      description: formRecord.description,
      fields: [],
    };
  }

  // 4. Render the Builder UI
  return <EditFormClient formId={formRecord.id} initialSchema={parsedSchema} />;
}
