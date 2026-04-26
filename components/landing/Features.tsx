import { Terminal, MessageSquare } from "lucide-react";

export default function Features() {
  return (
    <section className="w-full flex flex-col items-center relative z-10 bg-[#0a0a0a]">
      <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30">
        {/* FEATURE 1: HEADLESS API (Text Left, Visual Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-neutral-700/30">
          <div className="p-10 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-neutral-700/30">
            <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center mb-6">
              <Terminal size={18} className="text-yellow-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight">
              Developer-First Headless Architecture
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Bring your own UI. Formix generates the complete backend
              infrastructure automatically. You get a structured JSON schema, a
              ready-to-use submission API, built-in validation, and webhook
              triggers out of the box.
            </p>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="text-neutral-600">→</span> Structured JSON
                Schema
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neutral-600">→</span> Secure Submission
                API
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neutral-600">→</span> Built-in Validation
                Layer
              </li>
            </ul>
          </div>
          <div className="p-10 lg:p-16 flex items-center justify-center bg-[#0d0d0d] relative overflow-hidden">
            {/* Faux Code Block */}
            <div className="w-full max-w-md bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2 bg-neutral-950">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                <span className="text-[10px] text-neutral-500 font-mono ml-2">
                  api/submit.ts
                </span>
              </div>
              <div className="p-5 font-mono text-[11px] sm:text-xs text-neutral-400 leading-relaxed overflow-x-auto">
                <p>
                  <span className="text-pink-400">const</span> response ={" "}
                  <span className="text-pink-400">await</span> fetch(
                  <span className="text-green-300">
                    "https://formix.dev/api/v1/submit/frm_123"
                  </span>
                  , {"{"}
                </p>
                <p className="pl-4">
                  method: <span className="text-green-300">"POST"</span>,
                </p>
                <p className="pl-4">headers: {"{"}</p>
                <p className="pl-8">
                  <span className="text-blue-300">"Authorization"</span>:{" "}
                  <span className="text-green-300">
                    `Bearer ${"{"}API_KEY{"}"}`
                  </span>
                  ,
                </p>
                <p className="pl-8">
                  <span className="text-blue-300">"Content-Type"</span>:{" "}
                  <span className="text-green-300">"application/json"</span>
                </p>
                <p className="pl-4">{"}"},</p>
                <p className="pl-4">body: JSON.stringify({"{"}</p>
                <p className="pl-8">data: {"{"}</p>
                <p className="pl-12">
                  name: <span className="text-green-300">"John Doe"</span>,
                </p>
                <p className="pl-12">
                  role: <span className="text-green-300">"Developer"</span>
                </p>
                <p className="pl-8">{"}"}</p>
                <p className="pl-4">{"}"})</p>
                <p>{"}"});</p>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 2: WHATSAPP (Visual Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Order changes on mobile so text is always on top, but visual is left on desktop */}
          <div className="p-10 lg:p-16 flex items-center justify-center bg-[#0d0d0d] border-b lg:border-b-0 lg:border-r border-neutral-700/30 relative overflow-hidden order-2 lg:order-1">
            {/* Faux WhatsApp UI */}
            <div className="w-full max-w-[280px] bg-[#050505] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <MessageSquare size={14} className="text-green-500" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white">
                    Formix Bot
                  </div>
                  <div className="text-[9px] text-neutral-500">Online</div>
                </div>
              </div>
              <div className="p-4 space-y-3 bg-[#0a0a0a]">
                <div className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs p-2.5 rounded-xl rounded-tl-sm w-[85%]">
                  👋 Hi! Welcome to the Startup Waitlist. Let&apos;s get
                  started. What is your full name?
                </div>
                <div className="bg-green-600 text-white text-xs p-2.5 rounded-xl rounded-tr-sm w-[70%] ml-auto">
                  John Doe
                </div>
                <div className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs p-2.5 rounded-xl rounded-tl-sm w-[85%]">
                  Thanks John! What is your email address?
                </div>
              </div>
            </div>
          </div>
          <div className="p-10 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
            <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center mb-6">
              <MessageSquare size={18} className="text-green-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight">
              WhatsApp-First Distribution
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Traditional form links have terrible conversion rates. Meet your
              users where they already are. Formix can instantly convert your
              headless forms into automated conversational flows on WhatsApp.
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Remove friction, dramatically increase response rates, and sync
              data straight to your database in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* LINE: Bottom of Features Section */}
      <div className="w-full h-px bg-neutral-700/30"></div>
    </section>
  );
}
