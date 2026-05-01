import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Formix",
  description: "Login to Formix",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
