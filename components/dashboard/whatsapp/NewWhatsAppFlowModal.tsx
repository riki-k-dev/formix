"use client";

import { useState } from "react";
import { X, MessageSquare, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type AvailableForm = {
  id: string;
  name: string;
};

interface NewWhatsAppFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableForms: AvailableForm[];
}

export default function NewWhatsAppFlowModal({
  isOpen,
  onClose,
  availableForms = [],
}: NewWhatsAppFlowModalProps) {
  const router = useRouter();
  const [selectedFormId, setSelectedFormId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateFlow = async () => {
    if (!selectedFormId) {
      toast.error("Please select a form first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/whatsapp/flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: selectedFormId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create flow");

      toast.success("WhatsApp flow connected successfully!");

      trackEvent("whatsapp_bot_deployed", {
        status: "success",
        form_id: selectedFormId,
      });

      router.refresh();
      onClose();
      setSelectedFormId("");
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-200 font-medium">
            <MessageSquare size={18} className="text-neutral-400" />
            Create WhatsApp Flow
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Select Form
            </label>
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 appearance-none cursor-pointer"
            >
              <option value="" disabled>
                {availableForms.length === 0
                  ? "No eligible forms available..."
                  : "Choose a form..."}
              </option>
              {availableForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Sending Number
            </label>
            <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200">
              <Smartphone size={16} className="text-neutral-500" />
              <span>+1 (555) 019-2834 (Default)</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-neutral-800 bg-neutral-900/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateFlow}
            disabled={isSubmitting || !selectedFormId}
            className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Create Flow
          </button>
        </div>
      </div>
    </div>
  );
}
