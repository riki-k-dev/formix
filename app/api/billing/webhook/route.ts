import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  sendWelcomeProEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentFailedEmail,
} from "@/lib/email";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const eventType = body.type;

    const payload = body.data;
    const userId =
      payload.metadata?.userId || payload.customer?.metadata?.userId;
    const customerEmail = payload.customer?.email || payload.email;

    // Helper to find the user efficiently
    let dbUser = null;
    if (userId) {
      dbUser = await db.query.user.findFirst({ where: eq(user.id, userId) });
    } else if (customerEmail) {
      dbUser = await db.query.user.findFirst({
        where: eq(user.email, customerEmail),
      });
    }

    if (!dbUser) {
      console.error(
        "Webhook Error: User not found for email/id:",
        customerEmail || userId,
      );
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. PAYMENT SUCCESS / SUBSCRIPTION ACTIVE
    if (
      eventType === "payment.succeeded" ||
      eventType === "subscription.active" ||
      eventType === "checkout_session.completed"
    ) {
      // Fallback: Add 30 days if Dodo payload doesn't explicitly send next_billing_date
      const nextBillingDate = payload.next_billing_date
        ? new Date(payload.next_billing_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const wasStarter = dbUser.plan === "starter";

      await db
        .update(user)
        .set({
          plan: "pro",
          dodoCustomerId:
            payload.customer_id ||
            payload.customer?.customer_id ||
            dbUser.dodoCustomerId,
          subscriptionEndDate: nextBillingDate,
          cancelAtPeriodEnd: false, // Reset this just in case they resubscribed
          updatedAt: new Date(),
        })
        .where(eq(user.id, dbUser.id));

      // Send Welcome Email only if they were just upgraded
      if (wasStarter && dbUser.email) {
        await sendWelcomeProEmail(dbUser.email, dbUser.name);
      }
    }

    // 2. SUBSCRIPTION CANCELLED
    if (
      eventType === "subscription.canceled" ||
      eventType === "subscription.cancelled"
    ) {
      // We don't downgrade immediately. We set cancelAtPeriodEnd = true.
      await db
        .update(user)
        .set({
          cancelAtPeriodEnd: true,
          updatedAt: new Date(),
        })
        .where(eq(user.id, dbUser.id));

      if (dbUser.email) {
        // Formatting the date nicely for the email
        const expiryDate = dbUser.subscriptionEndDate
          ? dbUser.subscriptionEndDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "the end of your billing cycle";

        await sendSubscriptionCancelledEmail(dbUser.email, expiryDate);
      }
    }

    // 3. PAYMENT FAILED / PAST DUE
    if (
      eventType === "payment.failed" ||
      eventType === "subscription.past_due"
    ) {
      if (dbUser.email) {
        await sendPaymentFailedEmail(dbUser.email);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
