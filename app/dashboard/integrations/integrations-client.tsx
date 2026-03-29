"use client";

import { useState } from "react";
import { Plus, Check, Pencil } from "lucide-react";
import {
  SiSlack,
  SiDiscord,
  SiNotion,
  SiGooglesheets,
  SiAirtable,
} from "react-icons/si";
import { TbBrandZapier } from "react-icons/tb";

import AddIntegrationModal from "@/components/dashboard/integrations/AddIntegrationModal";
import ManageIntegrationModal from "@/components/dashboard/integrations/ManageIntegrationModal";

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
  const [activeAddModal, setActiveAddModal] = useState<
    (typeof INTEGRATION_APPS)[0] | null
  >(null);
  const [manageModalProvider, setManageModalProvider] = useState<
    (typeof INTEGRATION_APPS)[0] | null
  >(null);

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

      <AddIntegrationModal
        isOpen={!!activeAddModal}
        onClose={() => setActiveAddModal(null)}
        activeApp={activeAddModal}
        availableForms={availableForms}
      />

      <ManageIntegrationModal
        isOpen={!!manageModalProvider}
        onClose={() => setManageModalProvider(null)}
        activeApp={manageModalProvider}
        connectionsByProvider={connectionsByProvider}
      />
    </>
  );
}
