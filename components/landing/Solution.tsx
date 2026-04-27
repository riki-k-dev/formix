"use client";

import { motion } from "framer-motion";
import { Sparkles, Code2, MessageSquare } from "lucide-react";

const steps = [
  {
    title: "1. Prompt & Generate",
    description:
      "Simply describe what you need. Our Groq AI engine instantly architects a structured JSON schema, provisions the database, and deploys a live API endpoint.",
    icon: Sparkles,
  },
  {
    title: "2. Headless Integration",
    description:
      "Ditch the bulky iframes. Plug the native API directly into your Next.js or React application for complete 100% control over the styling and user experience.",
    icon: Code2,
  },
  {
    title: "3. Distribute & Automate",
    description:
      "Deploy hyper-sleek mobile micro-forms or native WhatsApp conversational flows. Route your real-time submission data anywhere instantly via Webhooks.",
    icon: MessageSquare,
  },
];

export default function Solution() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="solution"
      className="w-full flex flex-col items-center relative z-10 bg-[#0a0a0a]"
    >
      <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30">
        {/* HEADER AREA */}
        <div className="p-10 lg:p-16 border-b border-neutral-700/30 text-center flex flex-col items-center">
          <div className="mb-4 border border-white/10 flex items-center gap-2 px-3 py-1.5 text-[12px] text-neutral-400 rounded-sm bg-white/5 uppercase tracking-widest font-mono">
            The Solution
          </div>
          <h2 className="text-3xl md:text-4xl font-mono text-white mb-6 tracking-tight">
            How Formix Works
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-135">
            Instead of just generating a rigid form UI, Formix generates the
            entire backend system for your forms. From schema to submission,
            fully automated.
          </p>
        </div>

        {/* 3-COLUMN GRID AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-10 lg:p-12 flex flex-col ${
                index !== steps.length - 1
                  ? "border-b lg:border-b-0 lg:border-r border-neutral-700/30"
                  : ""
              }`}
            >
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center mb-6">
                <step.icon size={20} className="text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-neutral-200 mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed flex-1">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LINE 5: Bottom of Solution Section */}
      <div className="w-full h-px bg-neutral-700/30"></div>
    </motion.section>
  );
}
