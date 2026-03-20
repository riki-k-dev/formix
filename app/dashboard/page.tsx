"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import GenerateFormModal from "@/components/dashboard/GenerateFormModal";

export default function DashboardOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-mono tracking-tight text-white mb-2">Overview</h1>
        <p className="text-neutral-400 text-sm">
          Get a high-level view of your active forms, API usage, and recent submissions.
        </p>
      </div>

      <div className="h-px bg-neutral-800 w-full mb-12"></div>

      {/* Content Section */}
      <div className="max-w-2xl">
        <p className="text-neutral-400 text-sm mb-2">Get started</p>
        <h2 className="text-3xl tracking-tight text-white mb-4">Welcome to Formix</h2>
        <p className="text-neutral-400 text-sm leading-relaxed mb-10 max-w-lg">
          AI-powered headless forms. Generate schemas, APIs, and UIs<br/>
          in seconds—zero backend required
        </p>

        {/* Steps */}
        <div className="space-y-5 mb-10">
          <div className="flex items-start gap-4 text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono text-xs shrink-0">
              1
            </span>
            <p className="text-neutral-300 pt-0.5">
              <span className="text-white font-medium">Prompt:</span> Describe your form requirements.
            </p>
          </div>

          <div className="flex items-start gap-4 text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono text-xs shrink-0">
              2
            </span>
            <p className="text-neutral-300 pt-0.5">
              <span className="text-white font-medium">Generate:</span> Get instant JSON schemas and APIs.
            </p>
          </div>

          <div className="flex items-start gap-4 text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono text-xs shrink-0">
              3
            </span>
            <p className="text-neutral-300 pt-0.5">
              <span className="text-white font-medium">Ship:</span> Connect the API or share the micro-form.
            </p>
          </div>
        </div>

        {/* Action Button that opens the modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Sparkles size={16} />
          Generate New Form
        </button>
      </div>

      {/* The Modal Component */}
      <GenerateFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}