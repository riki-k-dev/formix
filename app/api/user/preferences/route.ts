import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user, activities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: {
        emailNotifications: true,
        marketingEmails: true,
      },
    });

    const recentActivities = await db.query.activities.findMany({
      where: eq(activities.userId, userId),
      orderBy: [desc(activities.createdAt)],
      limit: 4,
    });

    return NextResponse.json({
      preferences: {
        emailNotifications: userData?.emailNotifications ?? true,
        marketingEmails: userData?.marketingEmails ?? false,
      },
      activities: recentActivities,
    });
  } catch (error) {
    console.error("Failed to fetch preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { emailNotifications, marketingEmails } = body;

    await db
      .update(user)
      .set({
        emailNotifications: emailNotifications,
        marketingEmails: marketingEmails,
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}
