"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Settings,
  LogOut,
  Loader2,
  Menu,
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [plan, setPlan] = useState("starter");
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const checkUnreadAndPlan = async () => {
      try {
        const res = await fetch("/api/user/unread");
        if (res.ok) {
          const data = await res.json();
          setHasUnread(data.hasUnread);
          setPlan(data.plan || "starter");
        }
      } catch {}
    };
    checkUnreadAndPlan();
    const interval = setInterval(checkUnreadAndPlan, 15000);
    return () => clearInterval(interval);
  }, []);

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
      {/* Passing plan and mobile states to Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        plan={plan}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>
          </div>

          {/* Premium User Profile Dropdown */}
          <div className="relative">
            <div className="relative w-8 h-8">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full h-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded-md flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-500 overflow-hidden"
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

              {/* Blue Dot Indicator */}
              {hasUnread && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex h-3 w-3 z-10 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border border-[#0a0a0a]"></span>
                </span>
              )}
            </div>

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
