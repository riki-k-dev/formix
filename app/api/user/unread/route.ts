import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ hasUnread: false }, { status: 401 });
    }

    const unreadRecords = await db
      .select({ id: activities.id })
      .from(activities)
      .where(
        and(eq(activities.userId, session.user.id), eq(activities.read, false)),
      )
      .limit(1);

    return NextResponse.json({ hasUnread: unreadRecords.length > 0 });
  } catch (error) {
    console.error("Failed to fetch unread status:", error);
    return NextResponse.json({ hasUnread: false }, { status: 500 });
  }
}
