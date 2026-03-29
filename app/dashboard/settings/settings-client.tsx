"use client";

import { useState, useEffect } from "react";
import { User, Bell, LifeBuoy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileTab from "@/components/dashboard/settings/ProfileTab";
import NotificationsTab from "@/components/dashboard/settings/NotificationsTab";
import HelpTab from "@/components/dashboard/settings/HelpTab";
import DeleteAccountModal from "@/components/dashboard/settings/DeleteAccountModal";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export default function SettingsClient({ user }: { user: SessionUser }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const activeTab =
    tabFromUrl && ["profile", "notifications", "help"].includes(tabFromUrl)
      ? tabFromUrl
      : "profile";

  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await fetch("/api/user/unread");
        if (res.ok) {
          const data = await res.json();
          setHasUnread(data.hasUnread);
        }
      } catch {}
    };
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const changeTab = (tab: string) => {
    router.replace(`/dashboard/settings?tab=${tab}`, { scroll: false });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10 animate-in fade-in duration-300">
        <div className="mb-10">
          <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
            Settings
          </h1>
          <p className="text-neutral-400 text-sm">
            Manage your account settings, preferences, and profile.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => changeTab("profile")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
                }`}
              >
                <User size={18} /> My Profile
              </button>

              <button
                onClick={() => changeTab("notifications")}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "notifications"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} /> Notifications
                </div>
                {hasUnread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                )}
              </button>

              <button
                onClick={() => changeTab("help")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "help"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
                }`}
              >
                <LifeBuoy size={18} /> Help & Support
              </button>
            </nav>
          </aside>

          <div className="flex-1 min-h-125">
            {activeTab === "profile" && (
              <ProfileTab
                user={user}
                onDeleteRequest={() => setIsDeleteModalOpen(true)}
              />
            )}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "help" && <HelpTab />}
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
