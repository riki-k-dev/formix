import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingClient from "./billing-client";
// Yahan DodoPayment type ko bhi import kar liya 👇
import { getDodoBillingData, type DodoPayment } from "@/lib/dodo";

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

  const currentPlan = dbUser?.plan || "starter";
  const dodoCustomerId = dbUser?.dodoCustomerId;

  // TypeScript ko saaf-saaf bata diya ki yeh DodoPayment ka array hai 👇
  let billingHistory: DodoPayment[] = [];
  let portalUrl = "";

  // Agar user ke paas Dodo ID hai, toh safe API call function use karo
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
