import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SubmissionsClient from "./submissions-client";

export default async function SubmissionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const data = await db
    .select({
      id: submissions.id,
      formId: forms.id,
      formName: forms.name,
      data: submissions.data,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(forms, eq(submissions.formId, forms.id))
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(submissions.createdAt));

  const formattedSubmissions = data.map((sub) => {
    let parsedData = {};
    try {
      parsedData = JSON.parse(sub.data);
    } catch {
      parsedData = { raw: sub.data };
    }

    return {
      id: sub.id,
      formId: sub.formId,
      formName: sub.formName,
      data: parsedData,
      channel: "API",
      createdAt: new Date(sub.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });

  return <SubmissionsClient initialSubmissions={formattedSubmissions} />;
}
