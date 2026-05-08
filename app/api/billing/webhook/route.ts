import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const eventType = body.type;

    console.log("🔔 Dodo Webhook Received. Type:", eventType);

    // 1. Upgrade Logic
    if (
      eventType === "payment.succeeded" ||
      eventType === "subscription.active" ||
      eventType === "checkout_session.completed"
    ) {
      const payload = body.data;

      const userId =
        payload.metadata?.userId || payload.customer?.metadata?.userId;
      const customerEmail = payload.customer?.email;

      console.log(
        "🔍 Webhook Extracted -> UserID:",
        userId,
        "| Email:",
        customerEmail,
      );

      if (userId) {
        await db
          .update(user)
          .set({
            plan: "pro",
            dodoCustomerId:
              payload.customer_id || payload.customer?.customer_id,
            subscriptionStatus: "active",
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));
        console.log(`✅ DB Update Success (by ID) for: ${userId}`);
      } else if (customerEmail) {
        await db
          .update(user)
          .set({
            plan: "pro",
            dodoCustomerId:
              payload.customer_id || payload.customer?.customer_id,
            subscriptionStatus: "active",
            updatedAt: new Date(),
          })
          .where(eq(user.email, customerEmail));
        console.log(`✅ DB Update Success (by EMAIL) for: ${customerEmail}`);
      } else {
        console.error("❌ Webhook Error: Neither userId nor email found!");
      }
    }

    // 2. Cancellation Logic
    if (
      eventType === "subscription.canceled" ||
      eventType === "subscription.cancelled"
    ) {
      const payload = body.data;
      const userId =
        payload.metadata?.userId || payload.customer?.metadata?.userId;
      const customerEmail = payload.customer?.email;

      if (userId) {
        await db
          .update(user)
          .set({
            plan: "starter",
            subscriptionStatus: "canceled",
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));
      } else if (customerEmail) {
        await db
          .update(user)
          .set({
            plan: "starter",
            subscriptionStatus: "canceled",
            updatedAt: new Date(),
          })
          .where(eq(user.email, customerEmail));
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
