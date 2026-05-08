import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingClient from "./billing-client";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch real-time user data
  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  const currentPlan = (dbUser as { plan?: string })?.plan || "starter";

  return <BillingClient currentPlan={currentPlan} />;
}
