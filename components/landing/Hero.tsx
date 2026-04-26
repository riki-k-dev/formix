"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col justify-center items-center text-center px-6 pt-40 pb-20 min-h-[85vh]">
      <div className="max-w-200 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border border-white/10 flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-neutral-400 rounded-sm bg-white/2"
        >
          <span className="relative flex w-1.5 h-1.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-neutral-400 opacity-50"></span>
            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-neutral-300"></span>
          </span>
          AI-Driven Headless Infrastructure
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[54px] font-mono leading-[1.15] tracking-tight mb-6"
        >
          Generate Better Forms,
          <br />
          Skip The Backend
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-neutral-300 text-[16px] leading-relaxed max-w-135"
        >
          Create AI-powered headless forms. Generate Schemas, APIs and UIs in
          seconds—zero backend required
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <Link
            href="/login"
            className="bg-white text-black px-6 py-2.5 text-sm font-medium rounded-md hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Try It Now ⟶
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-neutral-900/30 backdrop-blur-md border border-neutral-800 text-neutral-300 px-5 py-2.5 text-sm font-medium rounded-md hover:bg-neutral-800/80 hover:text-white hover:border-neutral-700 transition-all flex items-center gap-2.5"
          >
            <Github
              size={16}
              className="text-neutral-500 group-hover:text-white transition-colors"
            />
            Star On GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
