"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Terminal,
  Key,
  Webhook,
  MessageSquare,
  Copy,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "introduction", title: "Introduction", icon: BookOpen },
  { id: "authentication", title: "Authentication", icon: Key },
  { id: "api-reference", title: "API Reference", icon: Terminal },
  { id: "webhooks", title: "Webhooks", icon: Webhook },
  { id: "whatsapp", title: "WhatsApp Flows", icon: MessageSquare },
];

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#050505] border border-neutral-800 my-6 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800">
        <span className="text-[11px] font-mono text-neutral-400 font-medium uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="text-neutral-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-neutral-800"
          title="Copy code"
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
      <div className="p-5 overflow-x-auto text-[13px] font-mono text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
        {code}
      </div>
    </div>
  );
};

export default function DocsClient() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -75% 0px" },
    );

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const container = document.getElementById("docs-scroll-container");
      if (container) {
        container.scrollTo({
          top: el.offsetTop - 40,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-200 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 68 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen bg-[#0a0a0a] border-r border-neutral-800 flex flex-col text-sm text-neutral-400 font-medium overflow-hidden shrink-0 z-20"
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center px-4 border-b border-neutral-800 shrink-0 overflow-hidden w-full">
          <div className="flex items-center whitespace-nowrap w-full">
            <Link
              href="/"
              className="border-zinc-800 border rounded-lg p-1 flex items-center justify-center shrink-0 w-9 h-9"
            >
              <Image
                src="/i2-t4.png"
                alt="Formix Logo"
                width={26}
                height={26}
                className="shrink-0 object-contain rounded-md"
                priority
              />
            </Link>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center overflow-hidden"
                >
                  <span className="text-neutral-200 font-bold text-lg tracking-tight mr-14">
                    <Link
                      href="/"
                      className="hover:text-white transition-colors"
                    >
                      Formix
                    </Link>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest bg-neutral-800/80 border border-neutral-700/80 text-neutral-400 px-1.5 py-0.5 rounded-sm shrink-0">
                    Docs
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar px-3 overflow-x-hidden">
          <nav className="flex flex-col gap-1.5 w-full">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  title={isCollapsed ? section.title : undefined}
                  className={cn(
                    "flex items-center rounded-lg px-3 transition-colors group relative overflow-hidden h-10 w-full shrink-0 cursor-pointer",
                    isActive
                      ? "bg-neutral-800/60 text-neutral-200"
                      : "hover:bg-neutral-800/30 hover:text-neutral-300",
                  )}
                >
                  <section.icon
                    size={18}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive
                        ? "text-amber-400"
                        : "text-neutral-500 group-hover:text-neutral-300",
                    )}
                  />
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                        animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                        exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap flex-1 overflow-hidden text-left"
                      >
                        {section.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 shrink-0 bg-[#0a0a0a]/90 backdrop-blur-md">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <div className="h-4 w-px bg-neutral-800"></div>
            <Link
              href="/login"
              className="flex items-center gap-2 text-black bg-white px-4 py-1.5 rounded-md hover:bg-neutral-200 transition-colors"
            >
              Get Started Now ⟶
            </Link>
          </nav>
        </header>

        {/* Scrollable Content */}
        <main
          id="docs-scroll-container"
          className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-24 py-12 lg:py-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          <div className="max-w-3xl mx-auto">
            {/* INTRODUCTION */}
            <section id="introduction" className="mb-24 scroll-mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-5 border border-white/10 w-max px-3 py-1 rounded-full bg-white/5">
                  <BookOpen size={14} className="text-neutral-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                    Overview
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-mono text-white tracking-tight mb-6">
                  Introduction
                </h1>

                <p className="text-neutral-400 leading-relaxed mb-8 text-[15px]">
                  Welcome to the Formix developer documentation. Formix is an
                  AI-powered headless form infrastructure. It allows you to
                  generate backend schemas, databases, and APIs using natural
                  language, and seamlessly integrate them into your own frontend
                  applications.
                </p>

                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 mb-8">
                  <h3 className="text-white font-medium mb-3 text-lg">
                    Why Headless?
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    Traditional form builders force you to use clunky iframes.
                    With Formix, you retain 100% control over your UI. We handle
                    the heavy lifting:
                  </p>
                  <ul className="text-sm text-neutral-400 space-y-2 list-disc list-inside ml-2">
                    <li>Database provisioning and schema structuring</li>
                    <li>Secure data collection and validation</li>
                    <li>Spam prevention and rate limiting</li>
                    <li>
                      Integration routing (WhatsApp, Slack, Webhooks, etc.)
                    </li>
                  </ul>
                </div>
              </motion.div>
            </section>

            {/* AUTHENTICATION */}
            <section id="authentication" className="mb-24 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Key size={18} className="text-neutral-400" />
                </div>
                <h2 className="text-3xl font-mono text-white tracking-tight">
                  Authentication
                </h2>
              </div>

              <p className="text-neutral-400 leading-relaxed mb-6 text-[15px]">
                All API requests to Formix must be authenticated using your
                Secret API Key. You can generate and manage your API keys from
                the{" "}
                <Link
                  href="/dashboard/webhooks"
                  className="text-white underline underline-offset-4 decoration-neutral-700 hover:decoration-white transition-colors"
                >
                  API & Webhooks
                </Link>{" "}
                section of your dashboard.
              </p>

              <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">⚠️</span>
                  <p className="text-amber-400/90 text-sm leading-relaxed">
                    <strong>Security Notice:</strong> Your API key carries high
                    privileges and grants full access to submit data to your
                    forms. <strong>Never expose it in client-side code</strong>{" "}
                    (like browser-side React components or vanilla JS). Always
                    route submissions through a secure server environment, such
                    as Next.js API Routes or Server Actions.
                  </p>
                </div>
              </div>

              <p className="text-neutral-400 leading-relaxed mb-4 text-[15px]">
                Pass your API key in the `Authorization` header of all HTTP
                requests:
              </p>

              <CodeBlock
                language="HTTP Header"
                code={`Authorization: Bearer fmx_live_xxxxxxxxxxxxxxxxxxxxxxxx`}
              />
            </section>

            {/* API REFERENCE */}
            <section id="api-reference" className="mb-24 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Terminal size={18} className="text-neutral-400" />
                </div>
                <h2 className="text-3xl font-mono text-white tracking-tight">
                  API Reference
                </h2>
              </div>

              <p className="text-neutral-400 leading-relaxed mb-8 text-[15px]">
                Submitting data to your Formix backend is straightforward. Send
                a POST request containing a <code>data</code> object to your
                specific form endpoint.
              </p>

              <div className="mb-12">
                <h3 className="text-lg font-medium text-white mb-4">
                  Submit a response
                </h3>

                <div className="flex items-center gap-3 mb-6 p-4 bg-neutral-900/30 border border-neutral-800 rounded-xl overflow-x-auto">
                  <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-xs font-bold font-mono uppercase tracking-wider shrink-0">
                    POST
                  </span>
                  <code className="text-neutral-300 font-mono text-sm whitespace-nowrap">
                    https://formix.dev/api/v1/submit/&#123;form_id&#125;
                  </code>
                </div>

                <h4 className="text-white font-medium mb-3">cURL Example</h4>
                <CodeBlock
                  language="BASH"
                  code={`curl -X POST https://formix.dev/api/v1/submit/frm_abc123 \\
  -H "Authorization: Bearer fmx_live_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": {
      "full_name": "John Doe",
      "email": "john@example.com",
      "company_size": "50-200"
    }
  }'`}
                />

                <h4 className="text-white font-medium mb-3 mt-10">
                  Next.js Server Action Example (Recommended)
                </h4>
                <CodeBlock
                  language="TYPESCRIPT"
                  code={`"use server";

export async function submitToFormix(formData: FormData) {
  // Construct the payload matching your schema
  const payload = {
    data: {
      full_name: formData.get("fullName"),
      email: formData.get("email"),
    }
  };

  try {
    const response = await fetch(\`https://formix.dev/api/v1/submit/\${process.env.FORMIX_FORM_ID}\`, {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.FORMIX_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Submission failed");
    return await response.json();
    
  } catch (error) {
    console.error("Formix error:", error);
    throw new Error("Failed to process form");
  }
}`}
                />
              </div>
            </section>

            {/* WEBHOOKS */}
            <section id="webhooks" className="mb-24 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Webhook size={18} className="text-neutral-400" />
                </div>
                <h2 className="text-3xl font-mono text-white tracking-tight">
                  Webhooks
                </h2>
              </div>

              <p className="text-neutral-400 leading-relaxed mb-6 text-[15px]">
                Webhooks allow you to receive real-time HTTP notifications
                whenever a new submission occurs. You can configure Webhook URLs
                directly in your Formix dashboard.
              </p>

              <p className="text-neutral-400 leading-relaxed mb-4 text-[15px]">
                When an event triggers, Formix will send a <code>POST</code>{" "}
                request to your configured URL with a JSON payload that looks
                like this:
              </p>

              <CodeBlock
                language="JSON PAYLOAD"
                code={`{
  "event": "form.submitted",
  "formId": "frm_abc123",
  "formName": "Startup Waitlist",
  "submissionId": "sub_xyz987",
  "source": "api",
  "timestamp": "2026-04-27T09:35:53.000Z",
  "data": {
    "full_name": "Jane Smith",
    "email": "jane@example.com"
  }
}`}
              />
            </section>

            {/* WHATSAPP FLOWS */}
            <section
              id="whatsapp"
              className="mb-24 scroll-mt-8 border-t border-neutral-800/50 pt-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <MessageSquare size={18} className="text-neutral-400" />
                </div>
                <h2 className="text-3xl font-mono text-white tracking-tight flex items-center gap-3">
                  WhatsApp Flows
                  <span className="text-[10px] font-sans font-bold bg-neutral-800 text-amber-400 px-2 py-1 rounded border border-neutral-700 tracking-widest uppercase">
                    PRO
                  </span>
                </h2>
              </div>

              <p className="text-neutral-400 leading-relaxed mb-6 text-[15px]">
                With the Pro plan, you can convert any headless form into an
                automated WhatsApp conversational bot. Formix uses the official
                Meta Cloud API to orchestrate this directly from your JSON
                schema.
              </p>

              <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-8 mb-8">
                <h3 className="text-white font-medium mb-4 text-lg">
                  Configuration Steps:
                </h3>
                <ol className="list-decimal pl-5 space-y-4 text-neutral-400 text-sm">
                  <li className="pl-2">
                    Navigate to your Meta Developer Dashboard and create a
                    WhatsApp Business App.
                  </li>
                  <li className="pl-2">Generate a Permanent Access Token.</li>
                  <li className="pl-2">
                    In your Formix Dashboard, go to{" "}
                    <strong>WhatsApp Flows</strong> and click{" "}
                    <strong>Configure API</strong>.
                  </li>
                  <li className="pl-2">
                    Paste your Phone Number ID and Access Token into Formix.
                  </li>
                  <li className="pl-2">
                    Formix will instantly generate a{" "}
                    <strong>Webhook URL</strong> and{" "}
                    <strong>Verify Token</strong>. Paste these back into your
                    Meta dashboard configuration to finalize the connection.
                  </li>
                </ol>
              </div>

              <p className="text-neutral-400 leading-relaxed text-[15px]">
                Once connected, simply turn on a Flow for any active form. Users
                can initiate the form by messaging your business number with the
                keyword <code>START [form_id]</code> or via a generated{" "}
                <code>wa.me</code> sharing link provided in your dashboard.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
