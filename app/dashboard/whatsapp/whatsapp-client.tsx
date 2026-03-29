"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Smartphone,
  Plus,
  Power,
  Settings2,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Loader2,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import NewWhatsAppFlowModal from "@/components/dashboard/whatsapp/NewWhatsAppFlowModal";
import ConnectWhatsAppModal from "@/components/dashboard/whatsapp/ConnectWhatsAppModal";
import WhatsAppSimulator from "@/components/dashboard/whatsapp/WhatsAppSimulator";
import ConfirmModal from "@/components/ui/ConfirmModal";

type PreviewMessage = { sender: "user" | "bot" | string; text: string };

type Flow = {
  id: string;
  formName: string;
  phone: string;
  status: string;
  messagesSent: number;
  previewChat: PreviewMessage[];
};

type AvailableForm = { id: string; name: string };
type MetaConfig = { webhookUrl: string; verifyToken: string };

export default function WhatsAppFlowsClient({
  initialFlows,
  availableForms,
  initialMetaConfig,
}: {
  initialFlows: Flow[];
  availableForms: AvailableForm[];
  initialMetaConfig: MetaConfig | null;
}) {
  const router = useRouter();
  const [flows, setFlows] = useState<Flow[]>(initialFlows);

  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft">(
    "all",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredFlows = flows.filter((f) =>
    filterStatus === "all" ? true : f.status === filterStatus,
  );

  const [activeFlowId, setActiveFlowId] = useState<string | null>(
    filteredFlows.length > 0 ? filteredFlows[0].id : null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<string | null>(null);

  const activeFlow = flows.find((f) => f.id === activeFlowId) || flows[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      )
        setIsFilterOpen(false);
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      )
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterSelect = (status: "all" | "active" | "draft") => {
    setFilterStatus(status);
    setIsFilterOpen(false);
    const newFilteredList = flows.filter((f) =>
      status === "all" ? true : f.status === status,
    );
    if (
      newFilteredList.length > 0 &&
      !newFilteredList.find((f) => f.id === activeFlowId)
    ) {
      setActiveFlowId(newFilteredList[0].id);
    } else if (newFilteredList.length === 0) {
      setActiveFlowId(null);
    }
  };

  const handleToggleStatus = async (flowId: string, currentStatus: string) => {
    setIsProcessing(true);
    const newStatus = currentStatus === "active" ? "draft" : "active";
    setFlows(
      flows.map((f) => (f.id === flowId ? { ...f, status: newStatus } : f)),
    );

    try {
      const res = await fetch("/api/whatsapp/flow/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: flowId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Flow ${newStatus === "active" ? "enabled" : "disabled"}!`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
      setFlows(
        flows.map((f) =>
          f.id === flowId ? { ...f, status: currentStatus } : f,
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDeleteFlow = async () => {
    if (!flowToDelete) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/whatsapp/flow?formId=${flowToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete flow");
      toast.success("Flow deleted successfully");
      const updatedFlows = flows.filter((f) => f.id !== flowToDelete);
      setFlows(updatedFlows);
      if (activeFlowId === flowToDelete)
        setActiveFlowId(updatedFlows.length > 0 ? updatedFlows[0].id : null);
      router.refresh();
    } catch {
      toast.error("Failed to delete flow");
    } finally {
      setIsProcessing(false);
      setFlowToDelete(null);
    }
  };

  const handleShareFlow = () => {
    if (!activeFlow || activeFlow.status !== "active")
      return toast.error("You can only share active flows.");
    const cleanPhone = activeFlow.phone.replace(/\D/g, "") || "15550192834";
    const message = `Hi! I want to fill out: ${activeFlow.formName} [ref:${activeFlow.id}]`;
    navigator.clipboard.writeText(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
    );
    toast.success("Flow link copied! Includes automatic routing.");
    setActiveDropdown(null);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-mono tracking-tight text-white">
                WhatsApp Flows
              </h1>
              <span className="text-[10px] uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-400 px-1.5 py-0.5 rounded-sm">
                Pro
              </span>
            </div>
            <p className="text-neutral-400 text-sm">
              Convert your headless forms into automated WhatsApp conversational
              bots.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus size={16} /> <span>New Flow</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-4 relative z-20">
              <h2 className="text-sm font-medium text-neutral-300">
                Your Flows
              </h2>
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer",
                    isFilterOpen && "text-white",
                  )}
                >
                  <Settings2 size={16} />
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 top-6 w-40 bg-[#111] border border-neutral-800 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {(["all", "active", "draft"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleFilterSelect(status)}
                        className="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="capitalize whitespace-nowrap">
                          {status} Flows
                        </span>
                        {filterStatus === status && (
                          <CheckCircle2
                            size={14}
                            className="text-neutral-500 shrink-0"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredFlows.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-sm">
                  No {filterStatus !== "all" ? filterStatus : ""} flows found.
                </div>
              ) : (
                filteredFlows.map((flow) => (
                  <div
                    key={flow.id}
                    onClick={() => setActiveFlowId(flow.id)}
                    className={cn(
                      "border rounded-xl p-4 cursor-pointer transition-all duration-200",
                      activeFlowId === flow.id
                        ? "bg-neutral-900/60 border-neutral-600 shadow-sm"
                        : "bg-[#0a0a0a] border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/30",
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare
                          size={16}
                          className={
                            flow.status === "active"
                              ? "text-green-500"
                              : "text-neutral-500"
                          }
                        />
                        <h3 className="text-neutral-200 font-medium text-sm truncate max-w-35">
                          {flow.formName}
                        </h3>
                      </div>
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          flow.status === "active"
                            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                            : "bg-neutral-600",
                        )}
                      ></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-4">
                      <Smartphone size={12} />
                      <span>{flow.phone}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60">
                      <div className="text-xs text-neutral-400">
                        <span className="text-neutral-300">
                          {flow.messagesSent}
                        </span>{" "}
                        msgs
                      </div>
                      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                        {flow.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 bg-neutral-900/40 border border-dashed border-neutral-700 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings2 size={18} className="text-neutral-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1">
                WhatsApp Cloud API
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Connect your WhatsApp Business account to automate your forms.
              </p>
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Configure API
              </button>
            </div>
          </div>

          <div className="lg:col-span-2" style={{ height: "520px" }}>
            {activeFlow ? (
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl h-full flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-900/40 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                      <MessageSquare size={14} className="text-neutral-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-200">
                        {activeFlow.formName} Bot
                      </h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <CheckCircle2
                          size={10}
                          className={
                            activeFlow.status === "active"
                              ? "text-green-500"
                              : "text-neutral-500"
                          }
                        />
                        {activeFlow.status === "active" ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleToggleStatus(activeFlow.id, activeFlow.status)
                      }
                      disabled={isProcessing}
                      className="text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing && !flowToDelete ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Power
                          size={12}
                          className={
                            activeFlow.status === "active"
                              ? "text-red-400"
                              : "text-green-400"
                          }
                        />
                      )}
                      {activeFlow.status === "active"
                        ? "Disable Flow"
                        : "Enable Flow"}
                    </button>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === activeFlow.id
                              ? null
                              : activeFlow.id,
                          )
                        }
                        className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer p-1 rounded hover:bg-neutral-800"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeDropdown === activeFlow.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-neutral-800 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={handleShareFlow}
                            className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Share2 size={14} /> Share Flow Link
                          </button>
                          <div className="h-px bg-neutral-800 my-1 w-full"></div>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              setFlowToDelete(activeFlow.id);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} /> Delete Flow
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <WhatsAppSimulator activeFlow={activeFlow} />
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-neutral-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center text-neutral-500">
                <MessageSquare size={32} className="mb-4 opacity-50" />
                <p>Select a flow to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewWhatsAppFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableForms={availableForms}
      />
      <ConnectWhatsAppModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        initialMetaConfig={initialMetaConfig}
      />

      <ConfirmModal
        isOpen={!!flowToDelete}
        title="Delete WhatsApp Flow"
        description="Are you sure you want to delete this flow? This won't delete your form data, but the automated bot will stop responding."
        confirmText="Delete Flow"
        onCancel={() => setFlowToDelete(null)}
        onConfirm={confirmDeleteFlow}
        isLoading={isProcessing}
      />
    </>
  );
}
