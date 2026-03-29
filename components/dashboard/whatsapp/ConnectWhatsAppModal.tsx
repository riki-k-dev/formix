"use client";

import { useState, useEffect } from "react";
import { X, QrCode, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type MetaConfig = {
  webhookUrl: string;
  verifyToken: string;
};

interface ConnectWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMetaConfig: MetaConfig | null;
}

export default function ConnectWhatsAppModal({
  isOpen,
  onClose,
  initialMetaConfig,
}: ConnectWhatsAppModalProps) {
  const router = useRouter();
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metaDetails, setMetaDetails] = useState<MetaConfig | null>(
    initialMetaConfig,
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialMetaConfig) {
      setMetaDetails(initialMetaConfig);
    }
  }, [initialMetaConfig]);

  if (!isOpen) return null;

  const handleConnect = async () => {
    if (!phoneNumberId || !accessToken || !phoneNumber) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumberId, accessToken, phoneNumber }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to save configuration");

      toast.success("Credentials saved securely!");
      setMetaDetails({
        webhookUrl: data.webhookUrl,
        verifyToken: data.verifyToken,
      });
      router.refresh();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-200 font-medium">
            <QrCode size={18} className="text-neutral-400" />
            Connect WhatsApp Cloud API
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {!metaDetails ? (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  placeholder="e.g. 1050782748118516"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  WhatsApp Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 15551544229 (Numbers only)"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Permanent Access Token
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="EAA..."
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400">
                Credentials saved! Configure your Webhook in the Meta Dashboard
                using these details:
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Callback URL
                </label>
                <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-2">
                  <code className="text-xs text-neutral-300 truncate max-w-70">
                    {metaDetails.webhookUrl}
                  </code>
                  <button
                    onClick={() => handleCopy(metaDetails.webhookUrl, "url")}
                    className="text-neutral-500 hover:text-white p-1 cursor-pointer"
                  >
                    {copiedKey === "url" ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Verify Token
                </label>
                <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-2">
                  <code className="text-xs text-neutral-300 truncate max-w-70">
                    {metaDetails.verifyToken}
                  </code>
                  <button
                    onClick={() => handleCopy(metaDetails.verifyToken, "token")}
                    className="text-neutral-500 hover:text-white p-1 cursor-pointer"
                  >
                    {copiedKey === "token" ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setMetaDetails(null)}
                  className="text-xs text-neutral-400 underline hover:text-neutral-200 transition-colors"
                >
                  Update Configuration
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-neutral-800 bg-neutral-900/20 flex justify-end gap-3">
          {metaDetails ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors w-full cursor-pointer"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={
                  isSubmitting || !phoneNumberId || !accessToken || !phoneNumber
                }
                className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                Connect API
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
