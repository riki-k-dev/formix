"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Terminal, CheckCircle2, Loader2 } from "lucide-react";

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
  "Generating JSON Schema...",
  "Provisioning API endpoints...",
  "Building Micro-UI...",
  "Finalizing WhatsApp integration...",
];

export default function GenerateFormModal({
  isOpen,
  onClose,
}: GenerateFormModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const isDone = currentStep === loadingSteps.length;

  useEffect(() => {
    if (!isGenerating) return;

    if (currentStep < loadingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // router.push('/dashboard/forms/new-id')
        setIsGenerating(false);
        setCurrentStep(0);
        setPrompt("");
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isGenerating, currentStep, onClose]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-200 font-medium">
            <Sparkles size={18} className="text-neutral-400" />
            Generate New Form
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5">
          {!isGenerating ? (
            // Input Mode
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
            // Loading/Terminal Mode
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
                    <span>Done! Redirecting to builder...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isGenerating && (
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
