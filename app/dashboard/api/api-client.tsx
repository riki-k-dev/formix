"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, Copy, Check, Plus, Webhook, Terminal, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AddWebhookModal from "@/components/dashboard/AddWebhookModal";

type FormWithWebhook = {
  id: string;
  name: string;
  hasWebhook: boolean;
  webhookUrl: string | null;
};

export default function ApiWebhooksClient({ 
  initialForms, 
  apiKey 
}: { 
  initialForms: FormWithWebhook[],
  apiKey: string 
}) {
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [forms, setForms] = useState<FormWithWebhook[]>(initialForms);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleUrlChange = (formId: string, url: string) => {
    setForms(forms.map(f => f.id === formId ? { ...f, webhookUrl: url } : f));
  };

  const handleToggleActive = async (formId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setForms(forms.map(f => f.id === formId ? { ...f, hasWebhook: newStatus } : f));

    try {
      const form = forms.find(f => f.id === formId);
      await fetch("/api/forms/update-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: formId,
          hasWebhook: newStatus,
          webhookUrl: form?.webhookUrl || "",
        }),
      });
    } catch (error) {
      console.error("Toggle failed", error);
    }
  };

  const handleSaveWebhook = async (form: FormWithWebhook) => {
    setSavingId(form.id);
    try {
      const res = await fetch("/api/forms/update-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form.id,
          hasWebhook: form.hasWebhook,
          webhookUrl: form.webhookUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setEditingId(null);
    } catch {
      alert("Failed to save webhook URL");
    } finally {
      setSavingId(null);
    }
  };

  const maskedKey = apiKey ? `fmx_live_${"•".repeat(24)}` : "Generating...";

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
            API & Webhooks
          </h1>
          <p className="text-neutral-400 text-sm">
            Manage your API keys and configure webhooks to receive real-time updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* API Keys Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Key size={18} className="text-neutral-400" />
                <h2 className="text-lg font-medium text-neutral-200">API Keys</h2>
              </div>

              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">Secret Key</p>
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
                    {showLiveKey ? apiKey : maskedKey}
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
                      onClick={() => handleCopy(apiKey, "liveKey")}
                      className="p-2 text-neutral-500 hover:text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
                      title="Copy Key"
                    >
                      {copiedStates["liveKey"] ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                <AlertCircle size={14} className="shrink-0" />
                <p>Do not share your API keys in publicly accessible areas such as GitHub or client-side code.</p>
              </div>
            </section>

            {/* Quick Integration Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={18} className="text-neutral-400" />
                <h2 className="text-lg font-medium text-neutral-200">Quick Integration</h2>
              </div>
              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">cURL - Submit Form</span>
                </div>
                <div className="p-5 overflow-x-auto relative group">
                  <button
                    onClick={() => handleCopy(`curl -X POST http://localhost:3000/api/v1/submit/frm_YOUR_ID \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"data": {"name": "Test"}}'`, "curl")}
                    className="absolute top-4 right-4 p-2 text-neutral-500 opacity-0 group-hover:opacity-100 bg-neutral-900 border border-neutral-800 rounded-md transition-all hover:text-neutral-300"
                  >
                    {copiedStates["curl"] ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                  <pre className="text-sm font-mono text-neutral-300">
                    <span className="text-pink-400">curl</span> -X POST http://localhost:3000/api/v1/submit/frm_YOUR_ID \<br />
                    {"  "}-H <span className="text-green-400">{`"Authorization: Bearer ${showLiveKey ? apiKey : "fmx_live_..."}"`}</span> \<br />
                    {"  "}-H <span className="text-green-400">{'"Content-Type: application/json"'}</span> \<br />
                    {"  "}-d <span className="text-yellow-300">{`'{"data": {"name": "Test"}}'`}</span>
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
                <h2 className="text-lg font-medium text-neutral-200">Webhooks</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs bg-white text-black px-2 py-1.5 rounded flex items-center gap-1 font-medium hover:bg-neutral-200 transition-colors"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {forms.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-sm">
                  No forms created yet.
                </div>
              ) : (
                forms.map((form) => (
                  <div key={form.id} className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                    
                    {/* Header: Title and Edit Button */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                         <div className={cn("w-2 h-2 rounded-full", form.hasWebhook ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-neutral-600")}></div>
                         <span className="text-sm text-neutral-200 font-medium truncate max-w-[180px]" title={form.name}>
                           {form.name}
                         </span>
                      </div>
                      <button 
                        onClick={() => editingId === form.id ? setEditingId(null) : setEditingId(form.id)}
                        className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs underline underline-offset-2"
                      >
                        {editingId === form.id ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    {/* URL Input / Display */}
                    {editingId === form.id ? (
                       <div className="mb-4 flex gap-2">
                          <input 
                            type="url" 
                            placeholder="https://yourapi.com/hook"
                            value={form.webhookUrl || ""}
                            onChange={(e) => handleUrlChange(form.id, e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-2 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600"
                          />
                          <button 
                            onClick={() => handleSaveWebhook(form)}
                            disabled={savingId === form.id}
                            className="bg-white text-black px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center min-w-[60px] hover:bg-neutral-200 transition-colors"
                          >
                            {savingId === form.id ? <Loader2 size={12} className="animate-spin"/> : "Save"}
                          </button>
                       </div>
                    ) : (
                      <div className="font-mono text-[11px] text-neutral-400 truncate mb-4 bg-neutral-900/50 p-2 rounded-md border border-neutral-800/50" title={form.webhookUrl || "No URL set"}>
                        {form.webhookUrl || "No URL configured"}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700 px-1.5 py-0.5 rounded font-medium">
                          form.submitted
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* <span className={cn("text-[10px] uppercase tracking-wider font-semibold", form.hasWebhook ? "text-green-500" : "text-neutral-500")}>
                          {form.hasWebhook ? "Active" : "Off"}
                        </span> */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={form.hasWebhook}
                            onChange={() => handleToggleActive(form.id, form.hasWebhook)}
                          />
                          <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </div>

                    {/* Footer ID */}
                    <div className="text-[10px] text-neutral-600 font-mono uppercase border-t border-neutral-800 pt-3 flex items-center gap-1">
                      ID: {form.id.substring(0, 15)}...
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AddWebhookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}