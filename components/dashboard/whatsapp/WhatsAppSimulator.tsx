"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PreviewMessage = {
  sender: "user" | "bot" | string;
  text: string;
};

type Flow = {
  id: string;
  formName: string;
  status: string;
  previewChat: PreviewMessage[];
};

export default function WhatsAppSimulator({
  activeFlow,
}: {
  activeFlow: Flow | undefined;
}) {
  const [chatMessages, setChatMessages] = useState<PreviewMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [simStep, setSimStep] = useState(0);
  const [simData, setSimData] = useState({});
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeFlow) {
      setChatMessages(activeFlow.previewChat.slice(0, 1));
      setSimStep(0);
      setSimData({});
      setChatInput("");
    }
  }, [activeFlow]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isBotTyping]);

  const handleSendMessage = async () => {
    if (
      !chatInput.trim() ||
      !activeFlow ||
      simStep === -1 ||
      activeFlow.status !== "active"
    )
      return;

    const userText = chatInput;
    setChatInput("");

    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsBotTyping(true);

    try {
      const res = await fetch("/api/whatsapp/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: activeFlow.id,
          currentStep: simStep,
          collectedData: simData,
          incomingText: userText,
        }),
      });

      if (!res.ok) throw new Error("Simulation failed");
      const data = await res.json();

      setTimeout(() => {
        setIsBotTyping(false);
        setChatMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.reply },
        ]);
        setSimStep(data.nextStep);
        setSimData(data.collectedData);
      }, 800);
    } catch {
      setIsBotTyping(false);
      toast.error("Simulator encountered an error");
    }
  };

  if (!activeFlow) {
    return null;
  }

  return (
    <>
      <div
        ref={chatScrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-5 bg-[#0a0a0a] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div className="flex flex-col gap-4 relative z-10 max-w-lg mx-auto pb-4">
          <div className="text-center mb-4">
            <span className="text-[10px] font-medium uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-500 px-2 py-1 rounded-full">
              Simulator Sandbox
            </span>
          </div>

          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-2",
                msg.sender === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap",
                  msg.sender === "user"
                    ? "bg-neutral-200 text-black rounded-tr-sm"
                    : "bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-tl-sm",
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div className="flex w-full justify-start mt-2">
              <div className="bg-neutral-800 border border-neutral-700 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center h-11">
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

      <div className="p-4 border-t border-neutral-800 bg-[#0a0a0a] shrink-0 relative z-20">
        <div className="w-full max-w-lg mx-auto bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 flex items-center justify-between focus-within:border-neutral-600 transition-colors">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={simStep === -1 || activeFlow.status !== "active"}
            placeholder={
              activeFlow.status !== "active"
                ? "Flow is offline. Enable to test."
                : simStep === -1
                  ? "Simulation completed"
                  : "User replies here..."
            }
            className="flex-1 bg-transparent text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed min-w-0 mr-3"
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !chatInput.trim() ||
              simStep === -1 ||
              activeFlow.status !== "active"
            }
            className="w-6 h-6 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <SendHorizontal
              size={14}
              className="text-neutral-400 hover:text-white transition-colors"
            />
          </button>
        </div>
      </div>
    </>
  );
}
