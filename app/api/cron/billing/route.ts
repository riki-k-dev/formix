import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, and, isNotNull, lt, inArray } from "drizzle-orm";
import { sendRenewalReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 1. Security Check: Validate Vercel Cron Secret
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();

    // TASK 1: SEND 7-DAY RENEWAL REMINDERS
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 7);

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const activeProUsers = await db.query.user.findMany({
      where: and(
        eq(user.plan, "pro"),
        eq(user.cancelAtPeriodEnd, false),
        isNotNull(user.subscriptionEndDate),
      ),
      columns: { email: true, subscriptionEndDate: true },
    });

    let emailsSent = 0;

    for (const dbUser of activeProUsers) {
      if (!dbUser.subscriptionEndDate) continue;

      const expYear = dbUser.subscriptionEndDate.getFullYear();
      const expMonth = dbUser.subscriptionEndDate.getMonth();
      const expDay = dbUser.subscriptionEndDate.getDate();

      if (
        expYear === targetYear &&
        expMonth === targetMonth &&
        expDay === targetDay
      ) {
        const formattedDate = dbUser.subscriptionEndDate.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        await sendRenewalReminderEmail(dbUser.email, formattedDate);
        emailsSent++;
      }
    }

    // TASK 2: DOWNGRADE EXPIRED SUBSCRIPTIONS
    // Find users who are Pro, marked to cancel, and their end date has passed
    const expiredUsers = await db.query.user.findMany({
      where: and(
        eq(user.plan, "pro"),
        eq(user.cancelAtPeriodEnd, true),
        isNotNull(user.subscriptionEndDate),
        lt(user.subscriptionEndDate, today), // Date is strictly less than right now
      ),
      columns: { id: true },
    });

    let downgradedCount = 0;

    if (expiredUsers.length > 0) {
      const expiredIds = expiredUsers.map((u) => u.id);

      await db
        .update(user)
        .set({
          plan: "starter",
          cancelAtPeriodEnd: false, // Reset the pending cancellation flag
          updatedAt: new Date(),
        })
        .where(inArray(user.id, expiredIds));

      downgradedCount = expiredIds.length;
      console.log(
        `[CRON] Successfully downgraded ${downgradedCount} users to starter.`,
      );
    }

    return NextResponse.json({
      success: true,
      remindersSent: emailsSent,
      downgradedUsers: downgradedCount,
    });
  } catch (error) {
    console.error("Cron Job Error (Billing):", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
