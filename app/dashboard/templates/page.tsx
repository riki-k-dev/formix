import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TemplatesClient from "./templates-client";
import { FORM_TEMPLATES } from "@/lib/templates";

export default async function TemplatesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  return <TemplatesClient templates={FORM_TEMPLATES} />;
}
