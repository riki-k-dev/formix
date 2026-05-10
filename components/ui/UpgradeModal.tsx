"use client";

import { X, Zap, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  featureName,
}: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#0a0a0a] border border-amber-500/20 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col p-1 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neutral-950 rounded-lg p-6 flex flex-col items-center text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-4">
            <Zap size={20} className="text-amber-500" />
          </div>

          <h3 className="text-xl font-medium text-white mb-2 tracking-tight">
            Unlock {featureName}
          </h3>
          <p className="text-sm text-neutral-400 mb-6">
            Upgrade to the Pro plan to access {featureName}, unlimited AI
            generation, and remove all submission limits.
          </p>

          <ul className="text-sm text-neutral-300 space-y-3 mb-8 w-full text-left bg-neutral-900/30 p-4 rounded-lg border border-neutral-800">
            <li className="flex items-center gap-3">
              <Check size={16} className="text-amber-500 shrink-0" />
              WhatsApp Bot Generation
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-amber-500 shrink-0" />
              External Integrations (Slack, Notion, etc.)
            </li>
            <li className="flex items-center gap-3">
              <LineWebhookIcon />
              <Check size={16} className="text-amber-500 shrink-0" />
              Advanced Webhooks
            </li>
            <li className="flex items-center gap-3">
              <Check size={16} className="text-amber-500 shrink-0" />
              Unlimited Forms & Submissions
            </li>
          </ul>

          <button
            onClick={() => {
              onClose();
              router.push("/dashboard/billing");
            }}
            className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            Upgrade to Pro — $12/mo
          </button>
        </div>
      </div>
    </div>
  );
}

const LineWebhookIcon = () => <span className="hidden"></span>;
