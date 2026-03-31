import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import EditFormClient from "./edit-client";

type FormField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

type FormSchema = {
  name: string;
  description: string;
  fields: FormField[];
};

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const formRecord = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
  });

  if (!formRecord) {
    notFound();
  }

  const parsedSchema = formRecord.schema as FormSchema;

  return <EditFormClient formId={formRecord.id} initialSchema={parsedSchema} />;
}
