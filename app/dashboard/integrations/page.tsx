import { Plus, Check } from "lucide-react";

const integrations = [
  {
    name: "Slack",
    desc: "Send form submissions to a Slack channel.",
    connected: true,
  },
  {
    name: "Google Sheets",
    desc: "Sync form data directly to a spreadsheet.",
    connected: false,
  },
  {
    name: "Notion",
    desc: "Create a database item for each submission.",
    connected: false,
  },
  {
    name: "Discord",
    desc: "Get notifications in your Discord server.",
    connected: false,
  },
  {
    name: "Airtable",
    desc: "Send structured data to an Airtable base.",
    connected: false,
  },
  {
    name: "Zapier",
    desc: "Connect your forms to 5000+ apps.",
    connected: true,
  },
];

export default function IntegrationsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-mono tracking-tight text-white">
          Integrations
        </h1>
        <span className="text-[10px] uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-neutral-400 px-1.5 py-0.5 rounded-sm">
          Pro
        </span>
      </div>
      <p className="text-neutral-400 text-sm mb-10">
        Connect Formix to your favorite tools and automate your workflow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((app) => (
          <div
            key={app.name}
            className="bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-700 transition-colors rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-300">
                {app.name.charAt(0)}
              </div>
              {app.connected ? (
                <span className="flex items-center gap-1 text-[10px] font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  <Check size={12} /> Connected
                </span>
              ) : (
                <button className="text-neutral-400 hover:text-white transition-colors">
                  <Plus size={18} />
                </button>
              )}
            </div>
            <h3 className="text-sm font-medium text-neutral-200 mb-1">
              {app.name}
            </h3>
            <p className="text-xs text-neutral-500 flex-1">{app.desc}</p>
            {!app.connected && (
              <button className="w-full mt-4 py-2 border border-neutral-800 rounded-md text-xs font-medium text-neutral-300 hover:bg-neutral-900 transition-colors">
                Connect
              </button>
            )}
            {app.connected && (
              <button className="w-full mt-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors">
                Configure
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
