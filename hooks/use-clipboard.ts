import { useState } from "react";
import { toast } from "sonner";

export function useClipboard({ timeout = 2000 } = {}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (
    text: string,
    key: string,
    successMessage = "Copied to clipboard!",
  ) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(successMessage);

    setTimeout(() => {
      setCopiedKey(null);
    }, timeout);
  };

  return { copiedKey, copyToClipboard };
}
