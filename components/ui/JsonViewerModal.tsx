"use client";

import { Code, X } from "lucide-react";
import { toast } from "sonner";

interface JsonViewerModalProps {
  isOpen: boolean;
  data: Record<string, unknown> | null;
  onClose: () => void;
}

export default function JsonViewerModal({
  isOpen,
  data,
  onClose,
}: JsonViewerModalProps) {
  if (!isOpen || !data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("JSON copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Code size={16} className="text-neutral-400" />
            Raw JSON Payload
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh] bg-black">
          <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-900/50 flex justify-end">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
