import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { sendRenewalReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 1. Security Check: Validate Vercel Cron Secret
    // Only Vercel's Cron engine should be able to trigger this.
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Calculate the target date (Exactly 7 days from today)
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 7);

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    // 3. Fetch all Pro users who have an active subscription (haven't cancelled)
    const activeProUsers = await db.query.user.findMany({
      where: and(
        eq(user.plan, "pro"),
        eq(user.cancelAtPeriodEnd, false),
        isNotNull(user.subscriptionEndDate),
      ),
      columns: {
        email: true,
        subscriptionEndDate: true,
      },
    });

    let emailsSent = 0;

    // 4. Check if their renewal date matches the target date
    for (const dbUser of activeProUsers) {
      if (!dbUser.subscriptionEndDate) continue;

      const expYear = dbUser.subscriptionEndDate.getFullYear();
      const expMonth = dbUser.subscriptionEndDate.getMonth();
      const expDay = dbUser.subscriptionEndDate.getDate();

      // If the dates match perfectly, send the 7-day reminder
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

    return NextResponse.json({
      success: true,
      processed: activeProUsers.length,
      emailsSent,
    });
  } catch (error) {
    console.error("Cron Job Error (Billing):", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
