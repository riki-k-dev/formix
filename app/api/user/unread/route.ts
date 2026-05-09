import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { activities, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json(
        { hasUnread: false, plan: "starter" },
        { status: 401 },
      );
    }

    // Unread check
    const unreadRecords = await db
      .select({ id: activities.id })
      .from(activities)
      .where(
        and(eq(activities.userId, session.user.id), eq(activities.read, false)),
      )
      .limit(1);

    // Plan check
    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: { plan: true },
    });

    return NextResponse.json({
      hasUnread: unreadRecords.length > 0,
      plan: dbUser?.plan || "starter",
    });
  } catch (error) {
    console.error("Failed to fetch unread status & plan:", error);
    return NextResponse.json(
      { hasUnread: false, plan: "starter" },
      { status: 500 },
    );
  }
}
