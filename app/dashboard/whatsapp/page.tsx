"use client";

import { useState } from "react";
import {
  MessageSquare,
  Smartphone,
  Plus,
  Power,
  Settings2,
  CheckCircle2,
  MoreVertical,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NewWhatsAppFlowModal from "@/components/dashboard/NewWhatsAppFlowModal";

const mockFlows = [
  {
    id: "wf_1",
    formName: "Startup Waitlist",
    phone: "+1 (555) 019-2834",
    status: "active",
    messagesSent: 1240,
    previewChat: [
      {
        sender: "bot",
        text: "Hey! 👋 Welcome to the Startup Waitlist. To get started, what's your work email?",
      },
      { sender: "user", text: "founder@nextunicorn.com" },
      { sender: "bot", text: "Awesome. And what's your current role?" },
      { sender: "user", text: "CEO" },
      {
        sender: "bot",
        text: "Got it! You're on the list. We'll notify you when we launch. 🚀",
      },
    ],
  },
  {
    id: "wf_2",
    formName: "Customer Feedback 2026",
    phone: "Unassigned",
    status: "draft",
    messagesSent: 0,
    previewChat: [
      {
        sender: "bot",
        text: "Hi there! How would you rate your recent experience out of 5?",
      },
      { sender: "user", text: "5" },
      {
        sender: "bot",
        text: "Thanks! Any additional feedback or feature requests?",
      },
      { sender: "user", text: "The API generation is magic! Keep it up." },
      {
        sender: "bot",
        text: "Thank you for the kind words! Have a great day.",
      },
    ],
  },
];

export default function WhatsAppFlowsPage() {
  const [activeFlowId, setActiveFlowId] = useState(mockFlows[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeFlow =
    mockFlows.find((f) => f.id === activeFlowId) || mockFlows[0];

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-mono tracking-tight text-white">
                WhatsApp Flows
              </h1>
              <span className="text-[10px] uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-400 px-1.5 py-0.5 rounded-sm">
                Pro
              </span>
            </div>
            <p className="text-neutral-400 text-sm">
              Convert your headless forms into automated WhatsApp conversational
              bots.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} />
            <span>New Flow</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Flow List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-neutral-300">
                Your Flows
              </h2>
              <button
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Settings"
              >
                <Settings2 size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {mockFlows.map((flow) => (
                <div
                  key={flow.id}
                  onClick={() => setActiveFlowId(flow.id)}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all duration-200",
                    activeFlowId === flow.id
                      ? "bg-neutral-900/60 border-neutral-600 shadow-sm"
                      : "bg-[#0a0a0a] border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/30",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare
                        size={16}
                        className={
                          flow.status === "active"
                            ? "text-green-500"
                            : "text-neutral-500"
                        }
                      />
                      <h3 className="text-neutral-200 font-medium text-sm truncate max-w-[140px]">
                        {flow.formName}
                      </h3>
                    </div>
                    {flow.status === "active" ? (
                      <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-4">
                    <Smartphone size={12} />
                    <span>{flow.phone}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60">
                    <div className="text-xs text-neutral-400">
                      <span className="text-neutral-300">
                        {flow.messagesSent}
                      </span>{" "}
                      msgs
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      {flow.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connect Number Card */}
            <div className="mt-6 bg-gradient-to-br from-neutral-900/50 to-neutral-900/20 border border-dashed border-neutral-700 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode size={18} className="text-neutral-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1">
                Connect WhatsApp
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Scan QR to connect a new business number to Formix.
              </p>
              <button className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-md transition-colors">
                Link Device
              </button>
            </div>
          </div>

          {/* Right Column: Preview & Config */}
          <div className="lg:col-span-2 flex flex-col h-[600px]">
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl flex-1 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-900/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                    <MessageSquare size={14} className="text-neutral-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-200">
                      {activeFlow.formName} Bot
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-green-500" />
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800">
                    <Power
                      size={12}
                      className={
                        activeFlow.status === "active"
                          ? "text-red-400"
                          : "text-green-400"
                      }
                    />
                    {activeFlow.status === "active"
                      ? "Disable Flow"
                      : "Enable Flow"}
                  </button>
                  <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Chat Preview Area */}
              <div className="flex-1 overflow-y-auto p-5 bg-[#0a0a0a] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div
                  className="absolute inset-0 opacity-[0.02] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                <div className="flex flex-col gap-4 relative z-10 max-w-lg mx-auto">
                  <div className="text-center mb-4">
                    <span className="text-[10px] font-medium uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-500 px-2 py-1 rounded-full">
                      Flow Preview
                    </span>
                  </div>

                  {activeFlow.previewChat.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex w-full",
                        msg.sender === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                          msg.sender === "user"
                            ? "bg-neutral-200 text-black rounded-tr-sm"
                            : "bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-tl-sm",
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator simulation */}
                  {activeFlow.status === "active" && (
                    <div className="flex w-full justify-start mt-2">
                      <div className="bg-neutral-800 border border-neutral-700 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                        <div
                          className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input Mockup */}
              <div className="p-4 border-t border-neutral-800 bg-[#0a0a0a] shrink-0">
                <div className="w-full max-w-lg mx-auto bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 flex items-center justify-between text-neutral-500 cursor-not-allowed">
                  <span className="text-sm">User replies here...</span>
                  <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
                    <MessageSquare size={12} className="text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewWhatsAppFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
