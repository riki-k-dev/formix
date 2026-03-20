import { FileText, ArrowRight } from "lucide-react";

const templates = [
  {
    name: "SaaS Waitlist",
    category: "Marketing",
    desc: "Collect emails and user roles for your upcoming launch.",
  },
  {
    name: "NPS Survey",
    category: "Feedback",
    desc: "Simple 1-10 rating with an optional feedback field.",
  },
  {
    name: "Bug Report",
    category: "Engineering",
    desc: "Capture issues with steps to reproduce and severity levels.",
  },
  {
    name: "Contact Form",
    category: "General",
    desc: "Standard name, email, and message form.",
  },
  {
    name: "Job Application",
    category: "HR",
    desc: "Collect resume links, portfolios, and contact details.",
  },
  {
    name: "Event RSVP",
    category: "Events",
    desc: "Track attendance and dietary preferences.",
  },
];

export default function TemplatesPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
          Templates
        </h1>
        <p className="text-neutral-400 text-sm">
          Skip the prompt. Start with an AI-optimized schema instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.name}
            className="group bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer rounded-xl p-6 flex flex-col h-full relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 bg-neutral-900 px-2 py-1 rounded">
                {tpl.category}
              </span>
              <FileText
                size={16}
                className="text-neutral-600 group-hover:text-neutral-400 transition-colors"
              />
            </div>
            <h3 className="text-base font-medium text-neutral-200 mb-2">
              {tpl.name}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">{tpl.desc}</p>

            <div className="mt-auto flex items-center text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">
              Use Template{" "}
              <ArrowRight
                size={14}
                className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
