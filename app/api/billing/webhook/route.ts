import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const eventType = body.type;

    if (
      eventType === "payment.succeeded" ||
      eventType === "subscription.active" ||
      eventType === "checkout_session.completed"
    ) {
      const payload = body.data;
      const userId =
        payload.metadata?.userId || payload.customer?.metadata?.userId;
      const customerEmail = payload.customer?.email;

      if (userId) {
        await db
          .update(user)
          .set({
            plan: "pro",
            dodoCustomerId:
              payload.customer_id || payload.customer?.customer_id,
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));
      } else if (customerEmail) {
        await db
          .update(user)
          .set({
            plan: "pro",
            dodoCustomerId:
              payload.customer_id || payload.customer?.customer_id,
            updatedAt: new Date(),
          })
          .where(eq(user.email, customerEmail));
      }
    }

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
          .set({ plan: "starter", updatedAt: new Date() })
          .where(eq(user.id, userId));
      } else if (customerEmail) {
        await db
          .update(user)
          .set({ plan: "starter", updatedAt: new Date() })
          .where(eq(user.email, customerEmail));
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
