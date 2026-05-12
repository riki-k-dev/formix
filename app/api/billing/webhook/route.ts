import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import {
  sendWelcomeProEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentFailedEmail,
} from "@/lib/email";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    // 1. CRITICAL: Dodo Payments Signature Verification
    const signature =
      req.headers.get("webhook-signature") ||
      req.headers.get("x-dodo-signature");
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error("🚨 Webhook Error: Missing signature or secret config");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      // Prevent Timing Attacks using timingSafeEqual
      const isAuthentic = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );

      if (!isAuthentic) {
        throw new Error("Signature mismatch");
      }
    } catch (cryptoError) {
      console.error("🚨 Webhook Signature Verification Failed:", cryptoError);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Safe Parsing after Verification
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
          cancelAtPeriodEnd: false,
          updatedAt: new Date(),
        })
        .where(eq(user.id, dbUser.id));

      if (wasStarter && dbUser.email) {
        await sendWelcomeProEmail(dbUser.email, dbUser.name);
      }
    }

    // 2. SUBSCRIPTION UPDATED OR CANCELLED
    if (
      eventType === "subscription.updated" ||
      eventType === "subscription.canceled" ||
      eventType === "subscription.cancelled"
    ) {
      const isCanceling =
        payload.cancel_at_next_billing_date === true ||
        payload.status === "canceled" ||
        payload.status === "cancelled" ||
        eventType === "subscription.canceled" ||
        eventType === "subscription.cancelled";

      const isRevoked =
        payload.cancel_at_next_billing_date === false &&
        payload.status === "active";

      if (isCanceling && !dbUser.cancelAtPeriodEnd) {
        await db
          .update(user)
          .set({
            cancelAtPeriodEnd: true,
            updatedAt: new Date(),
          })
          .where(eq(user.id, dbUser.id));

        if (dbUser.email) {
          const expiryDate = dbUser.subscriptionEndDate
            ? dbUser.subscriptionEndDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "the end of your billing cycle";

          await sendSubscriptionCancelledEmail(dbUser.email, expiryDate);
        }
      } else if (isRevoked && dbUser.cancelAtPeriodEnd) {
        await db
          .update(user)
          .set({
            cancelAtPeriodEnd: false,
            updatedAt: new Date(),
          })
          .where(eq(user.id, dbUser.id));
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
