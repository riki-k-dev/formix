"use client";

import { useState } from "react";
import {
  User,
  Bell,
  LifeBuoy,
  Loader2,
  Mail,
  Shield,
  Check,
  ExternalLink,
  Trash2,
  Inbox,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

const mockNotifications = [
  {
    id: 1,
    title: "New submission received",
    message: "Someone just filled out your 'Job Application' form.",
    time: "2 hours ago",
    icon: Inbox,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    read: false,
  },
  {
    id: 2,
    title: "API Key Generated",
    message: "You successfully generated a new live API key.",
    time: "Yesterday",
    icon: Shield,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    read: true,
  },
  {
    id: 3,
    title: "Welcome to Formix!",
    message: "Thanks for joining. Start by generating your first AI form.",
    time: "3 days ago",
    icon: Sparkles,
    iconColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    read: true,
  },
];

export default function SettingsClient({ user }: { user: SessionUser }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const activeTab =
    tabFromUrl && ["profile", "notifications", "help"].includes(tabFromUrl)
      ? tabFromUrl
      : "profile";

  const changeTab = (tab: string) => {
    router.replace(`/dashboard/settings?tab=${tab}`, { scroll: false });
  };

  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const getInitials = (userName: string) => {
    return userName ? userName.charAt(0).toUpperCase() : "U";
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully!");
    setIsSaving(false);
  };

  return (
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
              }`}
            >
              <Bell size={18} /> Notifications
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
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Profile Details Card */}
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-800">
                  <h2 className="text-lg font-medium text-white">
                    Profile Details
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Update your personal information.
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl font-bold text-white uppercase overflow-hidden">
                      {user.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={user.image}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div>
                      <button className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-medium rounded hover:bg-neutral-800 transition-colors cursor-pointer">
                        Upload new avatar
                      </button>
                      <p className="text-[10px] text-neutral-500 mt-2">
                        JPG, GIF or PNG. Max size of 2MB.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                        />
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full bg-black border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-sm text-neutral-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1.5 flex items-center gap-1">
                        <Shield size={10} /> Email is managed by BetterAuth.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-neutral-900/30 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving || !name}
                    className="px-5 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}{" "}
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Minimal Delete Account Card */}
              <div className="bg-transparent border border-neutral-800 rounded-xl overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                <div>
                  <h3 className="text-base font-medium text-white">
                    Delete account
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Cancels your subscription and removes all data permanently
                  </p>
                </div>
                <button
                  onClick={() =>
                    toast.error(
                      "Delete account functionality will be implemented later!",
                    )
                  }
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-medium shrink-0 cursor-pointer"
                >
                  Delete <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Preferences Card */}
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-800">
                  <h2 className="text-lg font-medium text-white">
                    Email Preferences
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Choose what updates you want to receive.
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Toggle 1 */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-200">
                        New Form Submissions
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Receive an email whenever someone submits your form.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={emailNotifications}
                        onChange={() =>
                          setEmailNotifications(!emailNotifications)
                        }
                      />
                      <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                  <div className="h-px w-full bg-neutral-800"></div>
                  {/* Toggle 2 */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-200">
                        Product Updates
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Get notified about new features and Formix updates.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={marketingEmails}
                        onChange={() => setMarketingEmails(!marketingEmails)}
                      />
                      <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* History / Recent Activity Card */}
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      Recent Activity
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Your latest notifications and account alerts.
                    </p>
                  </div>
                  <button className="text-xs text-neutral-400 hover:text-white transition-colors">
                    Mark all as read
                  </button>
                </div>

                <div className="divide-y divide-neutral-800/50">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-5 flex gap-4 transition-colors hover:bg-neutral-900/30 ${!notif.read ? "bg-neutral-900/10" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bgColor}`}
                      >
                        <notif.icon size={18} className={notif.iconColor} />
                      </div>
                      <div className="flex-1">
                        <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-1">
                          <h3
                            className={`text-sm font-medium ${!notif.read ? "text-white" : "text-neutral-300"}`}
                          >
                            {notif.title}
                          </h3>
                          <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 text-center border-t border-neutral-800">
                  <button className="text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer">
                    View older activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HELP & SUPPORT TAB */}
          {activeTab === "help" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-5">
                  <LifeBuoy size={28} className="text-neutral-400" />
                </div>
                <h2 className="text-xl font-medium text-white mb-2">
                  How can we help?
                </h2>
                <p className="text-sm text-neutral-500 max-w-md mx-auto mb-8">
                  Need help setting up your webhooks? Or have a question about
                  API limits? We&apos;re here to assist you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                  <a
                    href="#"
                    className="flex flex-col items-center p-5 border border-neutral-800 rounded-xl hover:bg-neutral-900/50 transition-colors group"
                  >
                    <ExternalLink
                      size={20}
                      className="text-neutral-500 group-hover:text-white mb-3 transition-colors"
                    />
                    <h3 className="text-sm font-medium text-neutral-200">
                      Documentation
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 text-center">
                      Read our developer guides.
                    </p>
                  </a>
                  <a
                    href="mailto:support@formix.dev"
                    className="flex flex-col items-center p-5 border border-neutral-800 rounded-xl hover:bg-neutral-900/50 transition-colors group"
                  >
                    <Mail
                      size={20}
                      className="text-neutral-500 group-hover:text-white mb-3 transition-colors"
                    />
                    <h3 className="text-sm font-medium text-neutral-200">
                      Contact Support
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 text-center">
                      Email our engineering team.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
