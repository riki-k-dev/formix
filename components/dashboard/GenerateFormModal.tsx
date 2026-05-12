"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  Terminal,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface GenerateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestions = [
  "Startup waitlist with email and role",
  "Customer feedback with 1-5 rating",
  "Bug report form with file upload",
];

const loadingSteps = [
  "Analyzing form requirements...",
  "Prompting Groq AI engine...",
  "Structuring JSON Schema...",
  "Saving to Neon Database...",
  "Provisioning headless API...",
];

export default function GenerateFormModal({
  isOpen,
  onClose,
}: GenerateFormModalProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isGenerating || isDone || error) return;

    if (currentStep < loadingSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, currentStep, isDone, error]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setIsDone(false);
    setCurrentStep(0);

    try {
      const res = await fetch("/api/forms/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate form");
      }

      setCurrentStep(loadingSteps.length);
      setIsDone(true);

      trackEvent("form_generated_ai", {
        form_type: "json_schema",
        source: "modal_prompt",
      });

      setTimeout(() => {
        router.refresh();
        setPrompt("");
        setIsGenerating(false);
        setIsDone(false);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-200 font-medium">
            <Sparkles size={18} className="text-neutral-400" />
            Generate New Form
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating && !error}
            className="text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!isGenerating || error ? (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your form (e.g., 'A waitlist form for a SaaS product asking for Name, Email, and Company Size')..."
                className="w-full h-32 bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600 resize-none transition-all"
                autoFocus
              />

              <div className="space-y-2">
                <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                  Suggestions
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(suggestion)}
                      className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1.5 rounded-md hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-44 bg-neutral-950 border border-neutral-800 rounded-lg p-4 font-mono text-sm overflow-hidden flex flex-col relative">
              <div className="flex items-center gap-2 text-neutral-500 mb-4 border-b border-neutral-800/50 pb-2">
                <Terminal size={14} />
                <span>formix-cli v1.0.0</span>
              </div>

              <div className="flex-1 space-y-2">
                {loadingSteps.slice(0, currentStep).map((step, idx) => (
                  <div
                    key={idx}
                    className="text-green-400/90 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                  >
                    <CheckCircle2 size={14} />
                    <span>{step}</span>
                  </div>
                ))}

                {!isDone && (
                  <div className="text-neutral-400 flex items-center gap-2 animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span>{loadingSteps[currentStep]}</span>
                  </div>
                )}

                {isDone && (
                  <div className="text-white mt-4 flex items-center gap-2 animate-in fade-in duration-300">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span>Done! Schema saved securely.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {(!isGenerating || error) && (
          <div className="px-5 py-4 border-t border-neutral-800 bg-neutral-900/20 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Generate ↵
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
