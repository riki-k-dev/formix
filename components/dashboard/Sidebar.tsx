"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Files,
  Inbox,
  Webhook,
  MessageSquare,
  Blocks,
  LayoutTemplate,
  Activity,
  CreditCard,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import GenerateFormModal from "./GenerateFormModal";

const navLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Forms", href: "/dashboard/forms", icon: Files },
  { name: "Submissions", href: "/dashboard/submissions", icon: Inbox },
  { name: "API & Webhooks", href: "/dashboard/api-webhooks", icon: Webhook },
  {
    name: "WhatsApp Flows",
    href: "/dashboard/whatsapp",
    pro: true,
    icon: MessageSquare,
  },
];

const bottomLinks = [
  {
    name: "Integrations",
    href: "/dashboard/integrations",
    pro: true,
    icon: Blocks,
  },
  { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
];

const accountLinks = [
  { name: "Usage", href: "/dashboard/usage", icon: Activity },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "h-screen bg-[#0a0a0a] border-r border-neutral-800 flex flex-col text-sm text-neutral-400 font-medium transition-all duration-300 ease-in-out overflow-hidden shrink-0",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-neutral-800 shrink-0",
            isCollapsed ? "justify-center" : "px-4",
          )}
        >
          <div className="flex items-center gap-1 overflow-hidden">
            <div className="border-zinc-800 border rounded-lg p-px overflow-hidden flex items-center justify-center">
              <Image
                src="/i2-t3.png"
                alt="Formix Logo"
                width={38}
                height={38}
                className="shrink-0 object-contain rounded-md"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="flex items-center ml-0.5">
                <span className="text-neutral-200 font-bold text-lg whitespace-nowrap tracking-tight mr-14">
                  Formix
                </span>
                <span className="text-[9px] uppercase tracking-widest bg-neutral-800/80 border border-neutral-700/80 text-neutral-400 px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5">
                  Starter
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar">
          {/* Top Links */}
          <nav className="flex flex-col gap-1 px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center rounded-md transition-colors group",
                  isCollapsed
                    ? "justify-center py-2.5 px-0"
                    : "justify-between px-3 py-2",
                  pathname === link.href
                    ? "bg-neutral-800/60 text-neutral-200"
                    : "hover:bg-neutral-800/30 hover:text-neutral-300",
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon
                    size={16}
                    className={cn(
                      "shrink-0",
                      pathname === link.href
                        ? "text-neutral-200"
                        : "text-neutral-500 group-hover:text-neutral-300",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{link.name}</span>
                  )}
                </div>
                {!isCollapsed && link.pro && (
                  <span className="text-[9px] uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-400 px-1 rounded-sm shrink-0">
                    Pro
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="h-px bg-neutral-800/50 mx-6"></div>

          {/* Middle Links */}
          <nav className="flex flex-col gap-1 px-3">
            {bottomLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center rounded-md transition-colors group",
                  isCollapsed
                    ? "justify-center py-2.5 px-0"
                    : "justify-between px-3 py-2",
                  pathname === link.href
                    ? "bg-neutral-800/60 text-neutral-200"
                    : "hover:bg-neutral-800/30 hover:text-neutral-300",
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon
                    size={16}
                    className={cn(
                      "shrink-0",
                      pathname === link.href
                        ? "text-neutral-200"
                        : "text-neutral-500 group-hover:text-neutral-300",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{link.name}</span>
                  )}
                </div>
                {!isCollapsed && link.pro && (
                  <span className="text-[9px] uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-400 px-1 rounded-sm shrink-0">
                    Pro
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="h-px bg-neutral-800/50 mx-6"></div>

          {/* Bottom Links */}
          <nav className="flex flex-col gap-1 px-3">
            {accountLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center rounded-md transition-colors group",
                  isCollapsed ? "justify-center py-2.5 px-0" : "px-3 py-2",
                  pathname === link.href
                    ? "bg-neutral-800/60 text-neutral-200"
                    : "hover:bg-neutral-800/30 hover:text-neutral-300",
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon
                    size={16}
                    className={cn(
                      "shrink-0",
                      pathname === link.href
                        ? "text-neutral-200"
                        : "text-neutral-500 group-hover:text-neutral-300",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{link.name}</span>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer / Smart CTA Card */}
        <div
          className={cn(
            "border-t border-neutral-800 shrink-0",
            isCollapsed ? "p-3" : "p-4",
          )}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            title={isCollapsed ? "Generate Form" : undefined}
            className={cn(
              "bg-transparent border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all group overflow-hidden relative",
              isCollapsed
                ? "w-10 h-10 mx-auto flex items-center justify-center hover:bg-neutral-900/50"
                : "w-full p-4 hover:bg-neutral-900/40 text-left",
            )}
          >
            {/* The Ray / Shine Effect */}
            {!isCollapsed && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
            )}

            <div
              className={cn(
                "relative z-10",
                isCollapsed
                  ? "flex items-center justify-center"
                  : "flex items-start gap-3",
              )}
            >
              <div className={cn("shrink-0", !isCollapsed && "mt-0.5")}>
                <Sparkles
                  size={16}
                  className="text-amber-400 group-hover:text-amber-300 transition-colors"
                />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                      Generate with AI
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-neutral-500 group-hover:text-neutral-300 transition-colors group-hover:translate-x-0.5"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500 transition-colors pr-2">
                    Create forms from a prompt
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>
      </aside>

      <GenerateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
