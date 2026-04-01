import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();
const utapi = new UTApi();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || !session.user) {
        throw new Error("Unauthorized access");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      const currentUser = await db.query.user.findFirst({
        where: eq(user.id, metadata.userId),
        columns: { image: true },
      });

      if (currentUser?.image) {
        const oldFileKey = currentUser.image.split("/f/")[1];
        if (oldFileKey) {
          await utapi.deleteFiles(oldFileKey);
          console.log("Cleaned up old avatar:", oldFileKey);
        }
      }

      await db
        .update(user)
        .set({ image: file.url })
        .where(eq(user.id, metadata.userId));

      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
