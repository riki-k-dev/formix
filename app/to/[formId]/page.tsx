import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import FormRenderer from "./FormRenderer";

export default async function PublicFormPage({
  params,
}: {
  params: { formId: string };
}) {
  const { formId } = await params;

  // 1. Fetch form from database
  const formRecord = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });

  // 2. If form doesn't exist or is not active, show 404
  if (!formRecord || formRecord.status !== "active") {
    notFound();
  }

  // 3. Parse the JSON schema safely
  let parsedSchema;
  try {
    parsedSchema = JSON.parse(formRecord.schema as string);
  } catch {
    parsedSchema = {
      name: formRecord.name,
      description: formRecord.description,
      fields: [],
    };
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-neutral-800 selection:text-white">
      {/* 4. Render the UI */}
      <FormRenderer formId={formRecord.id} schema={parsedSchema} />
    </div>
  );
}
