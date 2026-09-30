"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only",
        session_recording: {
          maskAllInputs: true,
          maskInputOptions: {
            password: true,
          },
        },
        // DPDP Compliance: Disable tracking by default until user gives consent via Banner
        opt_out_capturing_by_default: true,
      });
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
