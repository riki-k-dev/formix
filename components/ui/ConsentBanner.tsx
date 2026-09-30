"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";
import { X, ShieldCheck } from "lucide-react";

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("formix_tracking_consent");
    if (!consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBanner(true);
    } else if (consent === "granted") {
      posthog.opt_in_capturing();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("formix_tracking_consent", "granted");
    posthog.opt_in_capturing();
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("formix_tracking_consent", "denied");
    posthog.opt_out_capturing();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-100 p-4 animate-in slide-in-from-bottom-5 duration-500 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-[#111] border border-neutral-800 rounded-xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        <div className="flex gap-4 items-start md:items-center">
          <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 hidden md:flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-1">
              We respect your privacy
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
              We use strictly necessary cookies to run Formix securely.
              We&apos;d also like to use optional analytics cookies (PostHog &
              Google Analytics) to help us improve your experience. You can
              choose to accept or decline these optional trackers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent rounded-md transition-colors"
          >
            Decline All
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-4 py-2 bg-white text-black text-xs font-semibold rounded-md hover:bg-neutral-200 transition-colors"
          >
            Accept Analytics
          </button>
          <button
            onClick={handleDecline}
            className="text-neutral-500 hover:text-white p-1 md:hidden"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
