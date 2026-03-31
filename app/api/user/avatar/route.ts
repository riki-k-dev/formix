import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function DELETE() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: { image: true },
    });

    if (currentUser?.image) {
      const fileKey = currentUser.image.split("/f/")[1];

      if (fileKey) {
        await utapi.deleteFiles(fileKey);
        console.log("Deleted old avatar from UploadThing:", fileKey);
      }
    }

    await db.update(user).set({ image: null }).where(eq(user.id, userId));

    return NextResponse.json({
      success: true,
      message: "Avatar removed completely",
    });
  } catch (error) {
    console.error("Avatar Deletion Error:", error);
    return NextResponse.json(
      { error: "Failed to remove avatar" },
      { status: 500 },
    );
  }
}
