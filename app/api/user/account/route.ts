import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  forms,
  submissions,
  apiKeys,
  user,
  session,
  account,
  activities,
  whatsappConfigs,
  whatsappSessions,
  userIntegrations,
  formIntegrations,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function DELETE() {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData || !sessionData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionData.user.id;

    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: { image: true },
    });

    if (currentUser?.image) {
      const fileKey = currentUser.image.split("/f/")[1];
      if (fileKey) {
        await utapi.deleteFiles(fileKey);
        console.log("Deleted user avatar from UploadThing:", fileKey);
      }
    }

    const userForms = await db
      .select({ id: forms.id })
      .from(forms)
      .where(eq(forms.userId, userId));

    const formIds = userForms.map((f) => f.id);

    if (formIds.length > 0) {
      await db
        .delete(whatsappSessions)
        .where(inArray(whatsappSessions.formId, formIds));
      await db
        .delete(formIntegrations)
        .where(inArray(formIntegrations.formId, formIds));
      await db.delete(submissions).where(inArray(submissions.formId, formIds));
    }

    await db.delete(whatsappConfigs).where(eq(whatsappConfigs.userId, userId));
    await db
      .delete(userIntegrations)
      .where(eq(userIntegrations.userId, userId));
    await db.delete(activities).where(eq(activities.userId, userId));
    await db.delete(apiKeys).where(eq(apiKeys.userId, userId));

    await db.delete(forms).where(eq(forms.userId, userId));

    await db.delete(session).where(eq(session.userId, userId));
    await db.delete(account).where(eq(account.userId, userId));

    await db.delete(user).where(eq(user.id, userId));

    return NextResponse.json({
      success: true,
      message: "Account, avatar, and all associated data deleted permanently",
    });
  } catch (error: unknown) {
    console.error("Account Deletion Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete account";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
