"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  { name: "API & Webhooks", href: "/dashboard/webhooks", icon: Webhook },
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
  plan?: string;
}

export default function Sidebar({
  isCollapsed,
  plan = "starter",
}: SidebarProps) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 68 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen bg-[#0a0a0a] border-r border-neutral-800 flex flex-col text-sm text-neutral-400 font-medium overflow-hidden shrink-0 z-20"
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-neutral-800 shrink-0 overflow-hidden w-full">
          <div className="flex items-center whitespace-nowrap w-full">
            <div className="border-zinc-800 border rounded-lg p-1 flex items-center justify-center shrink-0 w-9 h-9">
              <Image
                src="/i2-t4.png"
                alt="Formix Logo"
                width={26}
                height={26}
                className="shrink-0 object-contain rounded-md"
                priority
              />
            </div>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center overflow-hidden"
                >
                  <span className="text-neutral-200 font-bold text-lg tracking-tight mr-14">
                    Formix
                  </span>
                  {/* Dynamic Plan Badge */}
                  <span
                    className={cn(
                      "text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm shrink-0 font-bold transition-colors",
                      plan === "pro"
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-500"
                        : "bg-neutral-800/80 border border-neutral-700/80 text-neutral-400",
                    )}
                  >
                    {plan}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar px-3 overflow-x-hidden">
          {/* Top Links */}
          <nav className="flex flex-col gap-1.5 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center rounded-lg px-3 transition-colors group relative overflow-hidden h-10 w-full shrink-0",
                  pathname === link.href
                    ? "bg-neutral-800/60 text-neutral-200"
                    : "hover:bg-neutral-800/30 hover:text-neutral-300",
                )}
              >
                <link.icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    pathname === link.href
                      ? "text-neutral-200"
                      : "text-neutral-500 group-hover:text-neutral-300",
                  )}
                />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap flex-1 overflow-hidden"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {!isCollapsed && link.pro && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-3 text-[9px] uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1 rounded-sm shrink-0"
                    >
                      Pro
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>

          <div className="h-px w-full bg-neutral-800/50"></div>

          {/* Middle Links */}
          <nav className="flex flex-col gap-1.5 w-full">
            {bottomLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center rounded-lg px-3 transition-colors group relative overflow-hidden h-10 w-full shrink-0",
                  pathname === link.href
                    ? "bg-neutral-800/60 text-neutral-200"
                    : "hover:bg-neutral-800/30 hover:text-neutral-300",
                )}
              >
                <link.icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    pathname === link.href
                      ? "text-neutral-200"
                      : "text-neutral-500 group-hover:text-neutral-300",
                  )}
                />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap flex-1 overflow-hidden"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {!isCollapsed && link.pro && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-3 text-[9px] uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1 rounded-sm shrink-0"
                    >
                      Pro
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>

          <div className="h-px w-full bg-neutral-800/50"></div>

          {/* Bottom Links */}
          <nav className="flex flex-col gap-1.5 w-full">
            {accountLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center rounded-lg px-3 transition-colors group relative overflow-hidden h-10 w-full shrink-0",
                  pathname === link.href
                    ? "bg-neutral-800/60 text-neutral-200"
                    : "hover:bg-neutral-800/30 hover:text-neutral-300",
                )}
              >
                <link.icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    pathname === link.href
                      ? "text-neutral-200"
                      : "text-neutral-500 group-hover:text-neutral-300",
                  )}
                />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer / Smart CTA Card */}
        <div className="border-t border-neutral-800 shrink-0 p-3 w-full">
          <button
            onClick={() => setIsModalOpen(true)}
            title={isCollapsed ? "Generate Form" : undefined}
            className="w-full py-3 bg-transparent border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all group overflow-hidden relative flex items-center px-3 hover:bg-neutral-900/40 cursor-pointer"
          >
            {!isCollapsed && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0"></div>
            )}

            <div className="relative z-10 flex items-center shrink-0">
              <Sparkles
                size={18}
                className="text-amber-400 group-hover:text-amber-300 transition-colors"
              />
            </div>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 flex flex-col text-left overflow-hidden whitespace-nowrap flex-1"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                      Generate with AI
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-neutral-500 group-hover:text-neutral-300 transition-colors group-hover:translate-x-0.5 shrink-0"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500 transition-colors pr-2">
                    Create forms from a prompt
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      <GenerateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
