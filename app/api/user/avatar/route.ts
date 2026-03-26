import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

// Initialize UploadThing server API
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

    // 1. Fetch current user data to get the existing image URL
    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: { image: true },
    });

    // 2. If an image exists, extract the fileKey and delete it from UploadThing
    if (currentUser?.image) {
      const fileKey = currentUser.image.split("/f/")[1];

      if (fileKey) {
        await utapi.deleteFiles(fileKey);
        console.log("Deleted old avatar from UploadThing:", fileKey);
      }
    }

    // 3. Set user image to null in the database
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
