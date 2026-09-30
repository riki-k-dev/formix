"use client";

import { useState } from "react";
import { Shield, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function DataRightsTab() {
  const [requestType, setRequestType] = useState("Right to Access");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return toast.error("Please provide some details.");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/data-rights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType, details }),
      });

      if (!res.ok) throw new Error("Failed to send request");

      setIsSuccess(true);
      toast.success(
        "Your request has been submitted to our Grievance Officer.",
      );
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Shield size={18} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">
              Data Privacy & Rights
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Exercise your rights under the DPDP Act 2023.
            </p>
          </div>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Request Submitted
              </h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                Our Legal & Compliance team has received your request. We will
                acknowledge receipt within 24 hours and process it within the
                legally mandated timeframe.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setDetails("");
                }}
                className="mt-6 text-xs text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-4 cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-lg text-sm text-neutral-400 mb-6">
                Use this form to request a summary of your data, ask for
                corrections, or request erasure of specific data points outside
                of full account deletion.
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">
                  Request Type
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="Right to Access">
                    Right to Access (Copy of my data)
                  </option>
                  <option value="Right to Correction">
                    Right to Correction (Fix inaccurate data)
                  </option>
                  <option value="Right to Erasure">
                    Right to Erasure (Delete specific data)
                  </option>
                  <option value="Right to Withdraw Consent">
                    Right to Withdraw Consent
                  </option>
                  <option value="Grievance / Complaint">
                    File a Grievance / Complaint
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-widest font-mono">
                  Request Details
                </label>
                <textarea
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide specifics about your request so our team can assist you efficiently..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all min-h-[150px] resize-y placeholder:text-neutral-600"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Submit Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
