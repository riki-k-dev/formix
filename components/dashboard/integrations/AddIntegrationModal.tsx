"use client";

import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ActiveApp {
  id: string;
  name: string;
  type: string;
  desc?: string;
}

export interface AvailableForm {
  id: string;
  name: string;
}

interface AddIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeApp: ActiveApp | null;
  availableForms: AvailableForm[];
}

export default function AddIntegrationModal({
  isOpen,
  onClose,
  activeApp,
  availableForms,
}: AddIntegrationModalProps) {
  const router = useRouter();
  const [selectedFormId, setSelectedFormId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [targetId, setTargetId] = useState("");
  const [secondaryId, setSecondaryId] = useState("");

  const handleConnect = async () => {
    if (!selectedFormId || !activeApp)
      return toast.error("Please select a form to integrate.");
    setIsSubmitting(true);

    let credentials = {};
    let config = {};

    if (["slack", "discord", "zapier"].includes(activeApp.id)) {
      if (!webhookUrl) {
        setIsSubmitting(false);
        return toast.error("Webhook URL is required.");
      }
      credentials = { connected: true };
      config = { webhookUrl };
    } else if (activeApp.id === "notion") {
      if (!accessToken || !targetId) {
        setIsSubmitting(false);
        return toast.error("Token and Database ID required.");
      }
      credentials = { accessToken };
      config = { databaseId: targetId };
    } else if (activeApp.id === "google_sheets") {
      if (!accessToken || !targetId) {
        setIsSubmitting(false);
        return toast.error("Token and Spreadsheet ID required.");
      }
      credentials = { accessToken };
      config = { spreadsheetId: targetId, sheetName: secondaryId || "Sheet1" };
    } else if (activeApp.id === "airtable") {
      if (!accessToken || !targetId || !secondaryId) {
        setIsSubmitting(false);
        return toast.error("Token, Base ID, and Table ID required.");
      }
      credentials = { accessToken };
      config = { baseId: targetId, tableId: secondaryId };
    }

    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: selectedFormId,
          provider: activeApp.id,
          type: activeApp.type,
          credentials,
          config,
        }),
      });

      if (!res.ok) throw new Error("Failed to connect");
      toast.success(`${activeApp.name} connected successfully!`);

      setSelectedFormId("");
      setWebhookUrl("");
      setAccessToken("");
      setTargetId("");
      setSecondaryId("");
      onClose();
      router.refresh();
    } catch (err) {
      console.error("[Integration Error]:", err);
      toast.error("Failed to save integration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !activeApp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-200 font-medium text-sm">
            Connect Form to {activeApp.name}
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Select Form to Connect
            </label>
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Choose a form...
              </option>
              {availableForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </select>
          </div>

          {["slack", "discord", "zapier"].includes(activeApp.id) && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                {activeApp.name} Webhook URL
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder={
                  activeApp.id === "slack"
                    ? "https://hooks.slack.com/services/..."
                    : activeApp.id === "zapier"
                      ? "https://hooks.zapier.com/hooks/catch/..."
                      : "https://discord.com/api/webhooks/..."
                }
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            </div>
          )}

          {["notion", "google_sheets", "airtable"].includes(activeApp.id) && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-1">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Access Token / API Key
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="secret_..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  {activeApp.id === "notion"
                    ? "Database ID"
                    : activeApp.id === "google_sheets"
                      ? "Spreadsheet ID"
                      : "Base ID"}
                </label>
                <input
                  type="text"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="abc123def..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                />
              </div>
            </div>
          )}

          {["google_sheets", "airtable"].includes(activeApp.id) && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                {activeApp.id === "google_sheets"
                  ? "Sheet Name (Optional)"
                  : "Table Name or ID"}
              </label>
              <input
                type="text"
                value={secondaryId}
                onChange={(e) => setSecondaryId(e.target.value)}
                placeholder={
                  activeApp.id === "google_sheets" ? "Sheet1" : "tblXyZ..."
                }
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-neutral-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={isSubmitting || !selectedFormId}
            className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Save Mapping
          </button>
        </div>
      </div>
    </div>
  );
}
