import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingClient from "./billing-client";
import { getDodoBillingData, type DodoPayment } from "@/lib/dodo";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  const currentPlan = dbUser?.plan || "starter";
  const dodoCustomerId = dbUser?.dodoCustomerId;

  let billingHistory: DodoPayment[] = [];
  let portalUrl = "";

  if (dodoCustomerId) {
    const dodoData = await getDodoBillingData(dodoCustomerId);
    billingHistory = dodoData.history || [];
    portalUrl = dodoData.portalUrl || "";
  }

  return (
    <BillingClient
      currentPlan={currentPlan}
      billingHistory={billingHistory}
      portalUrl={portalUrl}
    />
  );
}
