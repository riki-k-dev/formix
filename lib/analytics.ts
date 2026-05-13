// lib/analytics.ts
import posthog from "posthog-js";

type EventProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export const trackEvent = (eventName: string, properties?: EventProperties) => {
  if (typeof window !== "undefined" && posthog) {
    posthog.capture(eventName, properties);
  }
};
