"use client";

import { X, MessageSquare, Smartphone } from "lucide-react";

interface NewWhatsAppFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewWhatsAppFlowModal({
  isOpen,
  onClose,
}: NewWhatsAppFlowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-200 font-medium">
            <MessageSquare size={18} className="text-neutral-400" />
            Create WhatsApp Flow
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Select Form
            </label>
            <select
              defaultValue=""
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Choose a form...
              </option>
              <option value="startup-waitlist">Startup Waitlist</option>
              <option value="customer-feedback">Customer Feedback 2026</option>
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
            <p className="text-[10px] text-neutral-500 mt-2">
              You can connect a custom business number from the WhatsApp
              settings.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-neutral-800 bg-neutral-900/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors">
            Create Flow
          </button>
        </div>
      </div>
    </div>
  );
}
