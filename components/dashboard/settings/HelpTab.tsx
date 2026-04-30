import { LifeBuoy, ExternalLink, Mail } from "lucide-react";

export default function HelpTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-5">
          <LifeBuoy size={28} className="text-neutral-400" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">
          How can we help?
        </h2>
        <p className="text-sm text-neutral-500 max-w-md mx-auto mb-8">
          Need help setting up your webhooks? Or have a question about API
          limits? We&apos;re here to assist you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <a
            href="/docs"
            className="flex flex-col items-center p-5 border border-neutral-800 rounded-xl hover:bg-neutral-900/50 transition-colors group"
          >
            <ExternalLink
              size={20}
              className="text-neutral-500 group-hover:text-white mb-3 transition-colors"
            />
            <h3 className="text-sm font-medium text-neutral-200">
              Documentation
            </h3>
            <p className="text-xs text-neutral-500 mt-1 text-center">
              Read our developer guides.
            </p>
          </a>
          <a
            href="mailto:support@formix.rikikashyap.dev"
            className="flex flex-col items-center p-5 border border-neutral-800 rounded-xl hover:bg-neutral-900/50 transition-colors group"
          >
            <Mail
              size={20}
              className="text-neutral-500 group-hover:text-white mb-3 transition-colors"
            />
            <h3 className="text-sm font-medium text-neutral-200">
              Contact Support
            </h3>
            <p className="text-xs text-neutral-500 mt-1 text-center">
              Email our engineering team.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
