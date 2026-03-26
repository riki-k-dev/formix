"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.push("/login");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Error signing out");
            setIsSigningOut(false);
          },
        },
      });
    } catch (error) {
      console.error(error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-200 font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>

          {/* Premium User Profile Dropdown */}
          <div className="relative">
            {/* Trigger Button - NOW DYNAMIC */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded-md flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-500 overflow-hidden"
            >
              {user?.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : user?.name ? (
                <span className="text-xs font-bold text-neutral-300 uppercase">
                  {user.name.charAt(0)}
                </span>
              ) : (
                <User size={16} className="text-neutral-300" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                ></div>

                <div className="absolute right-0 mt-2 w-52 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-neutral-800/80 mb-1">
                    <p className="text-sm font-medium text-neutral-200 truncate">
                      {user?.name || "My Account"}
                    </p>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">
                      {user?.email || "Manage preferences"}
                    </p>
                  </div>

                  {/* Settings Link */}
                  <div className="px-1.5 py-0.5">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
                    >
                      <Settings size={15} /> Settings
                    </Link>
                  </div>

                  <div className="h-px bg-neutral-800/80 my-1 mx-3"></div>

                  {/* Sign Out Button */}
                  <div className="px-1.5 pb-1 pt-0.5">
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSigningOut ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <LogOut size={15} />
                      )}
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </main>
      </div>
    </div>
  );
}
