import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  sendWelcomeProEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentFailedEmail,
} from "@/lib/email";

type DodoWebhookEvent = {
  type: string;
  data: {
    metadata?: { userId?: string };
    customer?: {
      email?: string;
      customer_id?: string;
      metadata?: { userId?: string };
    };
    email?: string;
    customer_id?: string;
    status?: string;
    next_billing_date?: string;
    cancel_at_next_billing_date?: boolean;
    [key: string]: unknown;
  };
};

export async function POST(req: Request) {
  try {
    // 1. Get raw body and headers
    const rawBody = await req.text();
    const headersList = await headers();

    // 2. Fetch headers (Checking both 'svix-' and Dodo's 'webhook-' prefixes)
    const svix_id = headersList.get("svix-id") || headersList.get("webhook-id");
    const svix_timestamp =
      headersList.get("svix-timestamp") || headersList.get("webhook-timestamp");
    const svix_signature =
      headersList.get("svix-signature") || headersList.get("webhook-signature");

    // 3. Initial header check
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("🚨 Webhook Error: Missing Svix/Webhook headers");
      return NextResponse.json(
        { error: "Missing signatures" },
        { status: 400 },
      );
    }

    // 4. Verify using official Svix package
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("🚨 Webhook Error: DODO_WEBHOOK_SECRET is not set in env");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }

    const wh = new Webhook(webhookSecret);
    let body: DodoWebhookEvent;

    try {
      body = wh.verify(rawBody, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as DodoWebhookEvent;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      console.error("🚨 Webhook Signature Verification Failed:", errorMessage);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Verification Successful! Now process the data.
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
