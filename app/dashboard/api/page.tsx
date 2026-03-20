"use client";

import { useState } from "react";
import {
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Webhook,
  Terminal,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddWebhookModal from "@/components/dashboard/AddWebhookModal";

const mockWebhooks = [
  {
    id: "wh_0987",
    url: "https://myapp.com/api/formix-webhook",
    events: ["form.submitted"],
    status: "active",
    lastFired: "10 mins ago",
  },
  {
    id: "wh_0988",
    url: "https://zapier.com/hooks/catch/12345",
    events: ["form.submitted", "form.created"],
    status: "active",
    lastFired: "2 hours ago",
  },
];

export default function ApiWebhooksPage() {
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
            API & Webhooks
          </h1>
          <p className="text-neutral-400 text-sm">
            Manage your API keys and configure webhooks to receive real-time
            updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* API Keys Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Key size={18} className="text-neutral-400" />
                <h2 className="text-lg font-medium text-neutral-200">
                  API Keys
                </h2>
              </div>

              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">
                      Secret Key
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Used to authenticate API requests from your backend.
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] uppercase tracking-wider rounded border border-green-500/20 font-medium">
                    Live
                  </span>
                </div>
                <div className="p-5 bg-neutral-900/30 flex items-center justify-between gap-4">
                  <div className="font-mono text-sm text-neutral-300 bg-black border border-neutral-800 px-3 py-2 rounded-md flex-1 overflow-x-auto">
                    {showLiveKey
                      ? "fmx_live_8f92j3k4l5m6n7o8p9q0"
                      : "fmx_live_••••••••••••••••••••••••"}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowLiveKey(!showLiveKey)}
                      className="p-2 text-neutral-500 hover:text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
                      title={showLiveKey ? "Hide Key" : "Reveal Key"}
                    >
                      {showLiveKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() =>
                        handleCopy("fmx_live_8f92j3k4l5m6n7o8p9q0", "liveKey")
                      }
                      className="p-2 text-neutral-500 hover:text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
                      title="Copy Key"
                    >
                      {copiedStates["liveKey"] ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                <AlertCircle size={14} className="shrink-0" />
                <p>
                  Do not share your API keys in publicly accessible areas such
                  as GitHub or client-side code.
                </p>
              </div>
            </section>

            {/* Integration Example Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={18} className="text-neutral-400" />
                <h2 className="text-lg font-medium text-neutral-200">
                  Quick Integration
                </h2>
              </div>

              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">
                    cURL - Submit Form
                  </span>
                </div>
                <div className="p-5 overflow-x-auto relative group">
                  <button
                    onClick={() =>
                      handleCopy(
                        'curl -X POST https://api.formix.dev/v1/submit/frm_123 \\\n  -H "Authorization: Bearer fmx_live_..." \\\n  -H "Content-Type: application/json" \\\n  -d \'{"data": {"email": "user@example.com"}}\'',
                        "curl",
                      )
                    }
                    className="absolute top-4 right-4 p-2 text-neutral-500 opacity-0 group-hover:opacity-100 bg-neutral-900 border border-neutral-800 rounded-md transition-all hover:text-neutral-300"
                  >
                    {copiedStates["curl"] ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <pre className="text-sm font-mono text-neutral-300">
                    <span className="text-pink-400">curl</span> -X POST
                    https://api.formix.dev/v1/submit/frm_123 \<br />
                    {"  "}-H{" "}
                    <span className="text-green-400">
                      {'"Authorization: Bearer fmx_live_..."'}
                    </span>{" "}
                    \<br />
                    {"  "}-H{" "}
                    <span className="text-green-400">
                      {'"Content-Type: application/json"'}
                    </span>{" "}
                    \<br />
                    {"  "}-d{" "}
                    <span className="text-yellow-300">
                      {'\'{"data": {"email": "user@example.com"}}\''}
                    </span>
                  </pre>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Webhooks */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Webhook size={18} className="text-neutral-400" />
                <h2 className="text-lg font-medium text-neutral-200">
                  Webhooks
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs bg-white text-black px-2 py-1.5 rounded flex items-center gap-1 font-medium hover:bg-neutral-200 transition-colors"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {mockWebhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          webhook.status === "active"
                            ? "bg-green-500"
                            : "bg-neutral-600",
                        )}
                      ></div>
                      <span className="text-xs text-neutral-400 font-mono">
                        {webhook.id}
                      </span>
                    </div>
                    <button className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs underline underline-offset-2">
                      Edit
                    </button>
                  </div>

                  <div
                    className="font-mono text-xs text-neutral-300 truncate mb-3"
                    title={webhook.url}
                  >
                    {webhook.url}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {webhook.events.map((evt) => (
                      <span
                        key={evt}
                        className="text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700 px-1.5 py-0.5 rounded"
                      >
                        {evt}
                      </span>
                    ))}
                  </div>

                  <div className="text-[10px] text-neutral-600 font-mono uppercase border-t border-neutral-800 pt-2 mt-auto">
                    Last Fired: {webhook.lastFired}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddWebhookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
