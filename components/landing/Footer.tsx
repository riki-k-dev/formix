"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col items-center relative z-10 bg-[#0a0a0a]"
    >
      <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30">
        {/* TOP SECTION: Grid Links & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info Box */}
          <div className="lg:col-span-2 p-8 md:p-10 lg:p-12 border-b md:border-r border-neutral-700/30 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="border-zinc-800 border rounded-lg p-1 flex items-center justify-center shrink-0 w-8 h-8"
                src="/i2-t4.png"
                alt="logo"
                width={24}
                height={24}
              />
              <span className="text-neutral-200 font-bold text-lg tracking-tight">
                Formix
              </span>
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
              The AI-powered headless form infrastructure for modern developers.
              Skip the backend boilerplate.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://github.com/riki-k-dev/formix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="https://x.com/rikiKDev"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="mailto:support@formix.com"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Product Links Box */}
          <div className="p-8 md:p-10 lg:p-12 border-b lg:border-r border-neutral-700/30 flex flex-col gap-4">
            <h4 className="text-white font-medium text-sm mb-1">Product</h4>
            <Link
              href="/#problem"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Problem
            </Link>
            <Link
              href="/#solution"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Feature
            </Link>
            <Link
              href="/#pricing"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Resources Links Box */}
          <div className="p-8 md:p-10 lg:p-12 border-b md:border-r border-neutral-700/30 flex flex-col gap-4">
            <h4 className="text-white font-medium text-sm mb-1">Resources</h4>
            <Link
              href="/docs"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="#"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/#faq"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* Legal Links Box */}
          <div className="p-8 md:p-10 lg:p-12 border-b border-neutral-700/30 flex flex-col gap-4">
            <h4 className="text-white font-medium text-sm mb-1">Legal</h4>
            <Link
              href="/privacy"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Developer Tag */}
        <div className="px-8 md:px-10 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#050505]">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Formix. All rights reserved.
          </p>
          <div className="text-xs text-neutral-500">
            Designed & Developed by{" "}
            <a
              href="https://rikikashyap.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white transition-colors font-medium"
            >
              Riki Kashyap
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
