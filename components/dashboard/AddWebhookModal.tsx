"use client";

import { useState } from "react";
import { X, Webhook } from "lucide-react";

interface AddWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWebhookModal({
  isOpen,
  onClose,
}: AddWebhookModalProps) {
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState({ submitted: true, created: false });

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
            <Webhook size={18} className="text-neutral-400" />
            Add Webhook Endpoint
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
              Endpoint URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-api.com/webhook"
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">
              Events to send
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={events.submitted}
                  onChange={(e) =>
                    setEvents({ ...events, submitted: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-neutral-200 focus:ring-0 focus:ring-offset-0 accent-neutral-200 cursor-pointer"
                />
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                  form.submitted
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={events.created}
                  onChange={(e) =>
                    setEvents({ ...events, created: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-neutral-200 focus:ring-0 focus:ring-offset-0 accent-neutral-200 cursor-pointer"
                />
                <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                  form.created
                </span>
              </label>
            </div>
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
          <button
            disabled={!url}
            className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Endpoint
          </button>
        </div>
      </div>
    </div>
  );
}
