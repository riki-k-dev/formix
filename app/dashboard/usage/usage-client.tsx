"use client";

import { Activity, Zap, Database } from "lucide-react";
import { useRouter } from "next/navigation";

type UsageData = {
  plan: string;
  aiGenerations: number;
  submissions: number;
  apiRequests: number;
};

export default function UsageClient({ usageData }: { usageData: UsageData }) {
  const router = useRouter();
  const { plan, aiGenerations, submissions, apiRequests } = usageData;

  const isPro = plan === "pro";

  const LIMITS = {
    starter: { ai: 3, submissions: 100, api: 10000 },
    pro: { ai: -1, submissions: -1, api: -1 },
  };

  const currentLimits = isPro ? LIMITS.pro : LIMITS.starter;

  const calcPercent = (current: number, max: number) => {
    if (max === -1) return 0;
    const percent = (current / max) * 100;
    return percent > 100 ? 100 : percent;
  };

  const aiPercent = calcPercent(aiGenerations, currentLimits.ai);
  const subPercent = calcPercent(submissions, currentLimits.submissions);
  const apiPercent = calcPercent(apiRequests, currentLimits.api);

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
          Usage
        </h1>
        <p className="text-neutral-400 text-sm">
          Monitor your API limits, submissions, and AI generation quota.
        </p>
      </div>

      {/* Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* API Requests */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Activity size={16} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-neutral-200">
              API Requests
            </h3>
          </div>
          <div className="mb-2 flex justify-between items-end">
            <span className="text-3xl font-mono text-white tracking-tight">
              {apiRequests.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500 mb-1">
              {isPro ? "Unlimited" : `/ ${currentLimits.api.toLocaleString()}`}
            </span>
          </div>
          <div className="w-full bg-neutral-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${apiPercent > 90 ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${isPro ? 100 : apiPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500">Resets in 12 days</p>
        </div>

        {/* Submissions */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <Database size={16} className="text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-neutral-200">
              Submissions
            </h3>
          </div>
          <div className="mb-2 flex justify-between items-end">
            <span className="text-3xl font-mono text-white tracking-tight">
              {submissions.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500 mb-1">
              {isPro
                ? "Unlimited"
                : `/ ${currentLimits.submissions.toLocaleString()}`}
            </span>
          </div>
          <div className="w-full bg-neutral-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${subPercent > 90 ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${isPro ? 100 : subPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500">Across all active forms</p>
        </div>

        {/* AI Generations */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Zap size={16} className="text-purple-500" />
            </div>
            <h3 className="text-sm font-medium text-neutral-200">
              AI Generations
            </h3>
          </div>
          <div className="mb-2 flex justify-between items-end">
            <span className="text-3xl font-mono text-white tracking-tight">
              {aiGenerations}
            </span>
            <span className="text-xs text-neutral-500 mb-1">
              {isPro ? "Unlimited" : `/ ${currentLimits.ai}`}
            </span>
          </div>
          <div className="w-full bg-neutral-900 rounded-full h-1.5 mb-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${aiPercent >= 100 && !isPro ? "bg-red-500" : "bg-purple-500"}`}
              style={{ width: `${isPro ? 100 : aiPercent}%` }}
            ></div>
          </div>
          <p
            className={`text-xs ${aiPercent >= 100 && !isPro ? "text-red-400" : "text-neutral-500"}`}
          >
            {isPro
              ? "No limits on generation"
              : aiPercent >= 100
                ? "Limit reached. Upgrade for more."
                : `${currentLimits.ai - aiGenerations} remaining this month`}
          </p>
        </div>
      </div>

      {/* Warning/Upgrade Banner (Only show if not Pro) */}
      {!isPro && (
        <div className="bg-gradient-to-r from-neutral-900 to-[#0a0a0a] border border-neutral-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-neutral-200 font-medium mb-1">
              Ready to scale your forms?
            </h4>
            <p className="text-sm text-neutral-500">
              Upgrade to Pro for unlimited AI form generations, higher API rate
              limits, and WhatsApp integration.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/billing")}
            className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors shrink-0"
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </div>
  );
}
