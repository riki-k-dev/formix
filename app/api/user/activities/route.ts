import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, id } = body;
    const userId = session.user.id;

    if (action === "mark_all") {
      await db
        .update(activities)
        .set({ read: true })
        .where(eq(activities.userId, userId));
    } else if (id) {
      await db
        .update(activities)
        .set({ read: true })
        .where(and(eq(activities.id, id), eq(activities.userId, userId)));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update activities:", error);
    return NextResponse.json(
      { error: "Failed to update activities" },
      { status: 500 },
    );
  }
}
