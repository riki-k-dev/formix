import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    console.log("🔔 Dodo Webhook Received. Event:", body.event);

    if (
      body.event === "payment.succeeded" ||
      body.event === "subscription.active" ||
      body.event === "checkout_session.completed"
    ) {
      const payload = body.data;

      const userId = payload.metadata?.userId;

      if (userId) {
        await db
          .update(user)
          .set({
            plan: "pro",
            dodoCustomerId:
              payload.customer_id || payload.customer?.customer_id,
            subscriptionStatus: "active",
            // updated at
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));

        console.log(`✅ User ${userId} successfully upgraded to PRO!`);
      } else {
        console.error("❌ Webhook Error: No userId found in metadata");
      }
    }

    if (body.event === "subscription.canceled") {
      const payload = body.data;
      const userId = payload.metadata?.userId;

      if (userId) {
        await db
          .update(user)
          .set({
            plan: "starter",
            subscriptionStatus: "canceled",
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));

        console.log(`⚠️ User ${userId} downgraded to STARTER.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
