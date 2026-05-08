"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const mockInvoices = [
  { id: "INV-2026-001", date: "Mar 01, 2026", amount: "$0.00", status: "Paid" },
  { id: "INV-2026-002", date: "Feb 01, 2026", amount: "$0.00", status: "Paid" },
];

export default function BillingClient({
  currentPlan,
}: {
  currentPlan: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start checkout process.";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
          Billing
        </h1>
        <p className="text-neutral-400 text-sm">
          Manage your subscription plan, payment methods, and billing history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Plans */}
        <div className="lg:col-span-2 space-y-8">
          {/* STARTER PLAN CARD */}
          <section>
            <h2 className="text-lg font-medium text-neutral-200 mb-4">
              Starter Plan
            </h2>
            <div
              className={`bg-[#0a0a0a] border rounded-xl overflow-hidden ${currentPlan === "starter" ? "border-neutral-600" : "border-neutral-800"}`}
            >
              <div className="p-6 border-b border-neutral-800 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-medium text-white">Starter</h3>
                    {currentPlan === "starter" && (
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-[10px] uppercase tracking-wider rounded border border-neutral-700 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    Perfect for personal projects and experiments.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono text-white">$0</span>
                  <span className="text-sm text-neutral-500">/mo</span>
                </div>
              </div>
              <div className="p-6 bg-neutral-900/20">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 text-sm">
                  <ul className="space-y-3 text-neutral-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-neutral-500 shrink-0"
                      />{" "}
                      3 AI generated forms
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-neutral-500 shrink-0"
                      />{" "}
                      Standard micro-form UI
                    </li>
                  </ul>
                  <ul className="space-y-3 text-neutral-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-neutral-500 shrink-0"
                      />{" "}
                      Basic API access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-neutral-500 shrink-0"
                      />{" "}
                      100 responses/month
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* PRO PLAN CARD */}
          <section>
            <h2 className="text-lg font-medium text-neutral-200 mb-4">
              Pro Plan
            </h2>
            <div
              className={`bg-gradient-to-br from-neutral-900/80 to-[#0a0a0a] border hover:border-neutral-600 transition-colors rounded-xl overflow-hidden relative ${currentPlan === "pro" ? "border-amber-500/50" : "border-neutral-700"}`}
            >
              {currentPlan === "starter" && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-white text-black text-[10px] uppercase tracking-wider font-bold rounded-bl-lg">
                  Recommended
                </div>
              )}
              {currentPlan === "pro" && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 border-b border-l border-amber-500/30 text-amber-500 text-[10px] uppercase tracking-wider font-bold rounded-bl-lg">
                  Active Plan
                </div>
              )}
              <div className="p-6 flex justify-between items-start border-b border-neutral-800/50">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Pro</h3>
                  <p className="text-sm text-neutral-500">
                    For developers and teams scaling up.
                  </p>
                </div>
                <div className="text-right mt-1">
                  <span className="text-2xl font-mono text-white">$12</span>
                  <span className="text-sm text-neutral-500">/mo</span>
                </div>
              </div>
              <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-2 text-sm text-neutral-300 w-full sm:w-auto">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-white shrink-0" />{" "}
                    Unlimited AI forms & APIs
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-white shrink-0" />{" "}
                    WhatsApp bot generation
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-white shrink-0" />{" "}
                    Webhooks & integrations
                  </span>
                </div>

                {/* UPGRADE / MANAGE BUTTON */}
                {currentPlan === "starter" ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2.5 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}
                    {isLoading ? "Redirecting..." : "Upgrade to Pro"}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto px-6 py-2.5 bg-neutral-800 text-neutral-400 font-medium text-sm rounded-md shrink-0 flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Payment & Invoices */}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-medium text-neutral-200 mb-4">
              Payment Method
            </h2>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-6 bg-neutral-800 rounded flex items-center justify-center border border-neutral-700">
                  <CreditCard size={14} className="text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-200 font-medium">
                    {currentPlan === "pro" ? "Card on file" : "No card on file"}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  toast.info("Customer portal integration coming soon!")
                }
                className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                Manage in Dodo Portal <ExternalLink size={12} />
              </button>
              <p className="text-[10px] text-neutral-600 mt-4 border-t border-neutral-800 pt-3">
                Secure payments processed by Dodo Payments.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-neutral-200 mb-4">
              Billing History
            </h2>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
              <div className="divide-y divide-neutral-800">
                {currentPlan === "pro" ? (
                  mockInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-4 flex items-center justify-between hover:bg-neutral-900/30 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-neutral-500" />
                        <div>
                          <p className="text-xs text-neutral-300 font-medium">
                            {invoice.amount}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-mono">
                            {invoice.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-neutral-500">
                    No billing history available.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
