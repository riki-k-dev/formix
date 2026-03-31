import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardOverview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.createdAt));

  const totalForms = userForms.length;
  const activeForms = userForms.filter((f) => f.status === "active").length;
  const totalSubmissions = userForms.reduce(
    (acc, form) => acc + form.submissionsCount,
    0,
  );

  const recentSubmissionsRaw = await db
    .select({
      id: submissions.id,
      formName: forms.name,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(forms, eq(submissions.formId, forms.id))
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(submissions.createdAt))
    .limit(5);

  const recentSubmissions = recentSubmissionsRaw.map((sub) => ({
    ...sub,
    createdAt: sub.createdAt.toISOString(),
  }));

  const userName = session.user.name?.split(" ")[0] || "Founder";

  return (
    <DashboardClient
      userName={userName}
      stats={{
        totalForms,
        activeForms,
        totalSubmissions,
        avgConversion: totalForms > 0 ? "42.5%" : "0%",
      }}
      recentSubmissions={recentSubmissions}
    />
  );
}
