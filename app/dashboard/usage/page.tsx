import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UsageClient from "./usage-client";

export const dynamic = "force-dynamic";

export default async function UsagePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: {
      plan: true,
      aiGenerationsCount: true,
      submissionsCount: true,
      apiRequestsCount: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const usageData = {
    plan: dbUser.plan,
    aiGenerations: dbUser.aiGenerationsCount,
    submissions: dbUser.submissionsCount,
    apiRequests: dbUser.apiRequestsCount,
  };

  return <UsageClient usageData={usageData} />;
}
