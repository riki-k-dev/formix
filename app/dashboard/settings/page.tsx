import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <div className="p-10 text-neutral-400 font-mono text-sm animate-pulse">
          Loading settings...
        </div>
      }
    >
      <SettingsClient user={session.user} />
    </Suspense>
  );
}
