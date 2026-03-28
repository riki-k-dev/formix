"use client";

import { useState } from "react";
import { Plus, Check, X, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  SiSlack,
  SiDiscord,
  SiNotion,
  SiGooglesheets,
  SiAirtable,
} from "react-icons/si";
import { TbBrandZapier } from "react-icons/tb";

export type MappingType = {
  id: string;
  formId: string;
  formName: string;
  config: string;
  isActive: boolean;
};

const INTEGRATION_APPS = [
  {
    id: "slack",
    name: "Slack",
    icon: SiSlack,
    color: "text-[#E01E5A]",
    type: "slack_channel_message",
    desc: "Send form submissions to a Slack channel.",
  },
  {
    id: "zapier",
    name: "Zapier",
    icon: TbBrandZapier,
    color: "text-[#FF4A00]",
    type: "webhook",
    desc: "Connect your forms to 5000+ apps via Catch Hook.",
  },
  {
    id: "discord",
    name: "Discord",
    icon: SiDiscord,
    color: "text-[#5865F2]",
    type: "discord_channel_message",
    desc: "Get notifications in your Discord server.",
  },
  {
    id: "notion",
    name: "Notion",
    icon: SiNotion,
    color: "text-white",
    type: "notion_database_add",
    desc: "Create a database item for each submission.",
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    icon: SiGooglesheets,
    color: "text-[#34A853]",
    type: "sheet_row_add",
    desc: "Sync form data directly to a spreadsheet.",
  },
  {
    id: "airtable",
    name: "Airtable",
    icon: SiAirtable,
    color: "text-[#18BFFF]",
    type: "airtable_record_add",
    desc: "Send structured data to an Airtable base.",
  },
];

export default function IntegrationsClient({
  availableForms,
  connectedProviderIds,
  connectionsByProvider,
}: {
  availableForms: { id: string; name: string }[];
  connectedProviderIds: string[];
  connectionsByProvider: Record<
    string,
    { integrationId: string; credentials: string; mappings: MappingType[] }
  >;
}) {
  const router = useRouter();

  const [activeAddModal, setActiveAddModal] = useState<
    (typeof INTEGRATION_APPS)[0] | null
  >(null);
  const [manageModalProvider, setManageModalProvider] = useState<
    (typeof INTEGRATION_APPS)[0] | null
  >(null);

  const [selectedFormId, setSelectedFormId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingMappingId, setEditingMappingId] = useState<string | null>(null);
  const [editConfigValue, setEditConfigValue] = useState("");

  const [webhookUrl, setWebhookUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [targetId, setTargetId] = useState("");
  const [secondaryId, setSecondaryId] = useState("");

  const handleConnect = async () => {
    if (!selectedFormId)
      return toast.error("Please select a form to integrate.");
    setIsSubmitting(true);

    let credentials = {};
    let config = {};

    if (["slack", "discord", "zapier"].includes(activeAddModal!.id)) {
      if (!webhookUrl) {
        setIsSubmitting(false);
        return toast.error("Webhook URL is required.");
      }
      credentials = { connected: true };
      config = { webhookUrl };
    } else if (activeAddModal!.id === "notion") {
      if (!accessToken || !targetId) {
        setIsSubmitting(false);
        return toast.error("Token and Database ID required.");
      }
      credentials = { accessToken };
      config = { databaseId: targetId };
    } else if (activeAddModal!.id === "google_sheets") {
      if (!accessToken || !targetId) {
        setIsSubmitting(false);
        return toast.error("Token and Spreadsheet ID required.");
      }
      credentials = { accessToken };
      config = { spreadsheetId: targetId, sheetName: secondaryId || "Sheet1" };
    } else if (activeAddModal!.id === "airtable") {
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
          provider: activeAddModal!.id,
          type: activeAddModal!.type,
          credentials,
          config,
        }),
      });

      if (!res.ok) throw new Error("Failed to connect");
      toast.success(`${activeAddModal!.name} connected successfully!`);
      closeAddModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save integration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMapping = async (mappingId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/integrations/mapping?id=${mappingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete mapping");
      toast.success("Mapping deleted");
      router.refresh();
    } catch (error) {
      console.error(error);
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
        connectionsByProvider[manageModalProvider!.id]?.credentials || "{}",
      );

      if (["slack", "discord", "zapier"].includes(manageModalProvider!.id)) {
        setEditConfigValue(
          parsedConfig.webhookUrl || parsedCreds.webhookUrl || "",
        );
      } else if (manageModalProvider!.id === "notion") {
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

  const cancelInlineEdit = () => {
    setEditingMappingId(null);
    setEditConfigValue("");
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
      if (["slack", "discord", "zapier"].includes(manageModalProvider!.id)) {
        newConfig = { ...currentConfig, webhookUrl: editConfigValue.trim() };
      } else if (manageModalProvider!.id === "notion") {
        newConfig = { ...currentConfig, databaseId: editConfigValue.trim() };
      } else if (manageModalProvider!.id === "google_sheets") {
        newConfig = { ...currentConfig, spreadsheetId: editConfigValue.trim() };
      } else if (manageModalProvider!.id === "airtable") {
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to update mapping");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAddModal = () => {
    setActiveAddModal(null);
    setSelectedFormId("");
    setWebhookUrl("");
    setAccessToken("");
    setTargetId("");
    setSecondaryId("");
  };

  const closeManageModal = () => {
    setManageModalProvider(null);
    cancelInlineEdit();
  };

  const formatUrlForDisplay = (url: string, providerId: string) => {
    if (!url || url === "Not configured") return "Not configured";
    if (providerId === "discord" && url.includes("discord.com/api/webhooks/")) {
      return "https://discord.com/api/webhooks/...";
    }
    if (url.length > 35) return url.substring(0, 35) + "...";
    return url;
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10 pb-20">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-mono tracking-tight text-white">
            Integrations
          </h1>
          <span className="text-[10px] uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-400 px-1.5 py-0.5 rounded-sm">
            Pro
          </span>
        </div>
        <p className="text-neutral-400 text-sm mb-10 max-w-xl">
          Connect Formix to your favorite tools. Data is sent automatically to
          external services on every form submission.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTEGRATION_APPS.map((app) => {
            const isConnected = connectedProviderIds.includes(app.id);

            return (
              <div
                key={app.id}
                className="bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-700 transition-colors rounded-xl flex flex-col group relative p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    <app.icon className={`text-xl ${app.color}`} />
                  </div>

                  {/* TOP RIGHT GREEN BADGE */}
                  {isConnected && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-green-500/20 bg-green-500/10 text-green-500 text-[10px] font-semibold tracking-wide uppercase animate-in fade-in duration-200">
                      <Check size={12} strokeWidth={3} /> CONNECTED
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-medium text-neutral-200 mb-1 truncate">
                    {app.name}
                  </h3>
                  <p className="text-xs text-neutral-500 flex-1 min-h-10">
                    {app.desc}
                  </p>
                </div>

                <div className="mt-4">
                  {isConnected ? (
                    <div className="flex w-full items-center gap-3">
                      <button
                        onClick={() => setActiveAddModal(app)}
                        className="flex-1 py-2 text-white border border-neutral-700 rounded-md text-xs font-semibold hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus size={14} /> Map Another
                      </button>
                      <button
                        onClick={() => setManageModalProvider(app)}
                        className="flex-1 py-2 text-white rounded-md border border-neutral-700 text-xs font-semibold hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Pencil size={13} /> Edit Form
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveAddModal(app)}
                      className="w-full py-2 bg-white text-black rounded-md text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} /> Add Connection
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD MAPPING MODAL */}
      {activeAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-neutral-200 font-medium text-sm">
                Connect Form to {activeAddModal.name}
              </div>
              <button
                onClick={closeAddModal}
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

              {["slack", "discord", "zapier"].includes(activeAddModal.id) && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    {activeAddModal.name} Webhook URL
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder={
                      activeAddModal.id === "slack"
                        ? "https://hooks.slack.com/services/..."
                        : activeAddModal.id === "zapier"
                          ? "https://hooks.zapier.com/hooks/catch/..."
                          : "https://discord.com/api/webhooks/..."
                    }
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                  />
                </div>
              )}

              {["notion", "google_sheets", "airtable"].includes(
                activeAddModal.id,
              ) && (
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
                      {activeAddModal.id === "notion"
                        ? "Database ID"
                        : activeAddModal.id === "google_sheets"
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

              {["google_sheets", "airtable"].includes(activeAddModal.id) && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    {activeAddModal.id === "google_sheets"
                      ? "Sheet Name (Optional)"
                      : "Table Name or ID"}
                  </label>
                  <input
                    type="text"
                    value={secondaryId}
                    onChange={(e) => setSecondaryId(e.target.value)}
                    placeholder={
                      activeAddModal.id === "google_sheets"
                        ? "Sheet1"
                        : "tblXyZ..."
                    }
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                  />
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={closeAddModal}
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
      )}

      {/* EDIT FORM MODAL */}
      {manageModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
              <div className="flex flex-col">
                <span className="text-neutral-200 font-medium text-sm">
                  Edit {manageModalProvider.name} Forms
                </span>
                <span className="text-xs text-neutral-500 mt-0.5">
                  Manage connected forms and update webhooks.
                </span>
              </div>
              <button
                onClick={closeManageModal}
                className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto flex flex-col gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {connectionsByProvider[manageModalProvider.id]?.mappings.map(
                (mapping: MappingType) => {
                  const isEditing = editingMappingId === mapping.id;

                  let rawUrl = "Not configured";
                  try {
                    const pConfig = JSON.parse(mapping.config);
                    const pCreds = JSON.parse(
                      connectionsByProvider[manageModalProvider.id]
                        ?.credentials || "{}",
                    );
                    rawUrl =
                      pConfig.webhookUrl ||
                      pCreds.webhookUrl ||
                      pConfig.databaseId ||
                      pConfig.spreadsheetId ||
                      pConfig.baseId ||
                      "Not configured";
                  } catch {}

                  const displayUrl = formatUrlForDisplay(
                    rawUrl,
                    manageModalProvider.id,
                  );

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
                              onChange={(e) =>
                                setEditConfigValue(e.target.value)
                              }
                              className="w-full bg-black border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500 transition-colors"
                              placeholder="Paste new webhook/ID..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  saveInlineEdit(mapping.id, mapping.config);
                                if (e.key === "Escape") cancelInlineEdit();
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-neutral-200 mb-0.5">
                              {mapping.formName}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate">
                              {["slack", "discord", "zapier"].includes(
                                manageModalProvider.id,
                              )
                                ? "Hook: "
                                : manageModalProvider.id === "notion"
                                  ? "DB: "
                                  : "Base: "}
                              {displayUrl}
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
                              onClick={cancelInlineEdit}
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
                },
              )}
              {(!connectionsByProvider[manageModalProvider.id]?.mappings ||
                connectionsByProvider[manageModalProvider.id]?.mappings
                  .length === 0) && (
                <p className="text-center text-sm text-neutral-500 py-8">
                  No forms connected.
                </p>
              )}
            </div>

            <div className="px-5 py-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={closeManageModal}
                className="px-5 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
