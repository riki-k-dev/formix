import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import FormsClient from "./forms-client";

export default async function FormsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.createdAt));

  return <FormsClient initialForms={userForms} />;
}
