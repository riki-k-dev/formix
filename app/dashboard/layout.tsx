"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-200 font-sans overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>

          <div className="w-6 h-6 bg-neutral-200 rounded-sm shrink-0 cursor-pointer"></div>
        </header>

        <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </main>
      </div>
    </div>
  );
}
