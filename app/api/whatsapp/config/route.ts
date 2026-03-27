import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { whatsappConfigs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { phoneNumberId, accessToken } = body;

    if (!phoneNumberId || !accessToken) {
      return NextResponse.json(
        { error: "Phone Number ID and Access Token are required" },
        { status: 400 },
      );
    }

    const config = await db.query.whatsappConfigs.findFirst({
      where: eq(whatsappConfigs.userId, session.user.id),
    });

    const verifyToken =
      config?.verifyToken || crypto.randomBytes(16).toString("hex");

    if (config) {
      await db
        .update(whatsappConfigs)
        .set({
          phoneNumberId,
          accessToken,
          updatedAt: new Date(),
        })
        .where(eq(whatsappConfigs.id, config.id));
    } else {
      await db.insert(whatsappConfigs).values({
        userId: session.user.id,
        phoneNumberId,
        accessToken,
        verifyToken,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com";

    return NextResponse.json({
      success: true,
      verifyToken,
      webhookUrl: `${appUrl}/api/whatsapp/webhook`,
      message: "Meta WhatsApp credentials saved!",
    });
  } catch (error) {
    console.error("Save WA Config Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
