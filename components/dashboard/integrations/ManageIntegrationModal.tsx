"use client";

import { useState } from "react";
import { X, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ActiveApp } from "./AddIntegrationModal";

export type MappingType = {
  id: string;
  formId: string;
  formName: string;
  config: string;
  isActive: boolean;
};

export type ProviderConnection = {
  integrationId: string;
  credentials: string;
  mappings: MappingType[];
};

interface ManageIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeApp: ActiveApp | null;
  connectionsByProvider: Record<string, ProviderConnection>;
}

export default function ManageIntegrationModal({
  isOpen,
  onClose,
  activeApp,
  connectionsByProvider,
}: ManageIntegrationModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMappingId, setEditingMappingId] = useState<string | null>(null);
  const [editConfigValue, setEditConfigValue] = useState("");

  if (!isOpen || !activeApp) return null;

  const handleDeleteMapping = async (mappingId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/integrations/mapping?id=${mappingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete mapping");
      toast.success("Mapping deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete mapping");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startInlineEdit = (mapping: MappingType) => {
    setEditingMappingId(mapping.id);
    try {
      const parsedConfig = JSON.parse(mapping.config);
      const parsedCreds = JSON.parse(
        connectionsByProvider[activeApp.id]?.credentials || "{}",
      );

      if (["slack", "discord", "zapier"].includes(activeApp.id)) {
        setEditConfigValue(
          parsedConfig.webhookUrl || parsedCreds.webhookUrl || "",
        );
      } else if (activeApp.id === "notion") {
        setEditConfigValue(parsedConfig.databaseId || "");
      } else {
        setEditConfigValue(
          parsedConfig.spreadsheetId || parsedConfig.baseId || "",
        );
      }
    } catch {
      setEditConfigValue("");
    }
  };

  const saveInlineEdit = async (
    mappingId: string,
    currentConfigStr: string,
  ) => {
    if (!editConfigValue.trim()) return toast.error("Field cannot be empty.");
    setIsSubmitting(true);

    try {
      const currentConfig = JSON.parse(currentConfigStr);
      let newConfig = {};
      if (["slack", "discord", "zapier"].includes(activeApp.id)) {
        newConfig = { ...currentConfig, webhookUrl: editConfigValue.trim() };
      } else if (activeApp.id === "notion") {
        newConfig = { ...currentConfig, databaseId: editConfigValue.trim() };
      } else if (activeApp.id === "google_sheets") {
        newConfig = { ...currentConfig, spreadsheetId: editConfigValue.trim() };
      } else if (activeApp.id === "airtable") {
        newConfig = { ...currentConfig, baseId: editConfigValue.trim() };
      }

      const res = await fetch("/api/integrations/mapping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappingId, newConfig }),
      });

      if (!res.ok) throw new Error("Failed to update mapping");
      toast.success("Mapping updated");
      setEditingMappingId(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update mapping");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatUrlForDisplay = (url: string) => {
    if (!url || url === "Not configured") return "Not configured";
    if (activeApp.id === "discord" && url.includes("discord.com/api/webhooks/"))
      return "https://discord.com/api/webhooks/...";
    if (url.length > 35) return url.substring(0, 35) + "...";
    return url;
  };

  const mappings = connectionsByProvider[activeApp.id]?.mappings || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex flex-col">
            <span className="text-neutral-200 font-medium text-sm">
              Edit {activeApp.name} Forms
            </span>
            <span className="text-xs text-neutral-500 mt-0.5">
              Manage connected forms and update webhooks.
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              setEditingMappingId(null);
            }}
            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto flex flex-col gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {mappings.map((mapping: MappingType) => {
            const isEditing = editingMappingId === mapping.id;
            let rawUrl = "Not configured";
            try {
              const pConfig = JSON.parse(mapping.config);
              const pCreds = JSON.parse(
                connectionsByProvider[activeApp.id]?.credentials || "{}",
              );
              rawUrl =
                pConfig.webhookUrl ||
                pCreds.webhookUrl ||
                pConfig.databaseId ||
                pConfig.spreadsheetId ||
                pConfig.baseId ||
                "Not configured";
            } catch {}

            return (
              <div
                key={mapping.id}
                className="flex items-start justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg animate-in fade-in duration-200"
              >
                <div className="flex flex-col flex-1 min-w-0 pr-4">
                  {isEditing ? (
                    <>
                      <p className="text-sm font-medium text-neutral-200 truncate mb-2">
                        {mapping.formName}
                      </p>
                      <input
                        type="text"
                        value={editConfigValue}
                        onChange={(e) => setEditConfigValue(e.target.value)}
                        className="w-full bg-black border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500 transition-colors"
                        placeholder="Paste new webhook/ID..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            saveInlineEdit(mapping.id, mapping.config);
                          if (e.key === "Escape") setEditingMappingId(null);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-neutral-200 mb-0.5">
                        {mapping.formName}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {["slack", "discord", "zapier"].includes(activeApp.id)
                          ? "Hook: "
                          : activeApp.id === "notion"
                            ? "DB: "
                            : "Base: "}
                        {formatUrlForDisplay(rawUrl)}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() =>
                          saveInlineEdit(mapping.id, mapping.config)
                        }
                        disabled={isSubmitting}
                        className="text-green-500 hover:text-green-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} strokeWidth={2} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingMappingId(null)}
                        disabled={isSubmitting}
                        className="text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <X size={16} strokeWidth={2} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startInlineEdit(mapping)}
                        disabled={isSubmitting}
                        className="text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteMapping(mapping.id)}
                        disabled={isSubmitting}
                        className="text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {mappings.length === 0 && (
            <p className="text-center text-sm text-neutral-500 py-8">
              No forms connected.
            </p>
          )}
        </div>

        <div className="px-5 py-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={() => {
              onClose();
              setEditingMappingId(null);
            }}
            className="px-5 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
