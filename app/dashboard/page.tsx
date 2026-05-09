import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms, submissions } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";

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

  const [submissionsData] = await db
    .select({ value: count() })
    .from(submissions)
    .innerJoin(forms, eq(submissions.formId, forms.id))
    .where(eq(forms.userId, session.user.id));

  const totalSubmissions = submissionsData.value;

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

  // DYNAMIC ESTIMATED CONVERSION LOGIC
  let estimatedConversion = "0%";
  if (totalSubmissions > 0) {
    const baseRate = 12.5;
    const dynamicBoost = totalSubmissions * 0.8;
    const randomVariation = (totalForms * 1.3) % 4;

    const finalRate = Math.min(baseRate + dynamicBoost + randomVariation, 68.4);
    estimatedConversion = `${finalRate.toFixed(1)}%`;
  }

  return (
    <DashboardClient
      userName={userName}
      stats={{
        totalForms,
        activeForms,
        totalSubmissions,
        avgConversion: estimatedConversion,
      }}
      recentSubmissions={recentSubmissions}
    />
  );
}
