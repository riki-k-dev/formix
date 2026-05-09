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
  });

  const usageData = {
    plan: dbUser?.plan || "starter",
    aiGenerations: dbUser?.aiGenerationsCount || 0,
    submissions: dbUser?.submissionsCount || 0,
    apiRequests: dbUser?.apiRequestsCount || 0,
  };

  return <UsageClient usageData={usageData} />;
}
