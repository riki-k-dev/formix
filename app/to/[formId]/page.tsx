import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import FormRenderer from "./FormRenderer";

type FormField = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox";
  required: boolean;
  options?: string[];
};

type FormSchema = {
  name: string;
  description?: string;
  fields: FormField[];
};

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  const formRecord = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });

  if (!formRecord || formRecord.status !== "active") {
    notFound();
  }

  const parsedSchema =
    typeof formRecord.schema === "object" && formRecord.schema !== null
      ? (formRecord.schema as FormSchema)
      : {
          name: formRecord.name,
          description: formRecord.description ?? undefined,
          fields: [],
        };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-neutral-800 selection:text-white">
      <FormRenderer formId={formRecord.id} schema={parsedSchema} />
    </div>
  );
}
