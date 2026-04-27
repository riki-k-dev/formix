"use client";

import { motion } from "framer-motion";
import { Database, Terminal, ShieldCheck, Inbox, Webhook } from "lucide-react";

const problems = [
  { text: "Design the form schema", icon: Database },
  { text: "Write backend APIs", icon: Terminal },
  { text: "Handle validation", icon: ShieldCheck },
  { text: "Manage submissions and analytics", icon: Inbox },
  { text: "Integrate distribution channels", icon: Webhook },
];

export default function Problem() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="problem"
      className="w-full flex flex-col items-center relative -mt-20 z-10 bg-[#0a0a0a]"
    >
      <div className="w-full max-w-300 grid grid-cols-1 lg:grid-cols-2 border-x border-neutral-700/30">
        {/* LEFT COLUMN */}
        <div className="p-10 lg:p-16 lg:border-r border-neutral-700/30 flex flex-col justify-center">
          <h2 className="text-3xl font-mono text-white mb-6 tracking-tight">
            The Problem
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            Most form builders today are still stuck in the past. Tools like
            Typeform and Google Forms focus heavily on drag-and-drop UI. That
            works fine for basic surveys, but it completely breaks down for
            modern apps and developers.
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Developers who want to integrate forms directly into their own
            products are forced to reinvent the wheel every single time. Instead
            of just rendering a UI, you have to build and maintain the entire
            infrastructure pipeline from scratch.
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`flex items-center gap-5 p-8 lg:px-12 ${
                index !== problems.length - 1
                  ? "border-b border-neutral-700/30"
                  : ""
              }`}
            >
              <div className="text-neutral-500">
                <problem.icon size={22} strokeWidth={1.5} />
              </div>
              <span className="text-neutral-300 text-base font-medium">
                {problem.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* LINE 4 */}
      <div className="w-full h-px bg-neutral-700/30"></div>
    </motion.section>
  );
}
