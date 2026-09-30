import { Metadata } from "next";
import { Shield } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";

export const metadata: Metadata = {
  title: "Privacy Policy | Formix",
  description:
    "How we handle, protect, and process your data at Formix in compliance with the DPDP Act.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative selection:bg-neutral-800 selection:text-white">
      <Grid />
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full pt-20 pb-0">
        <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30 bg-[#0a0a0a] min-h-[calc(100vh-80px)]">
          {/* Header */}
          <div className="px-6 md:px-10 lg:px-24 py-16 lg:py-24 border-b border-neutral-700/30 text-left flex flex-col items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-5 border border-white/10 w-max px-3 py-1 rounded-full bg-white/5">
              <Shield size={14} className="text-neutral-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                Legal Compliance
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
              Privacy Notice
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-mono">
              Last updated: September 30, 2026 | [LEGAL REVIEW REQUIRED]
            </p>
          </div>

          {/* Content */}
          <article className="px-6 md:px-10 lg:px-24 py-16 w-full max-w-4xl prose prose-invert prose-neutral lg:prose-lg prose-headings:font-medium prose-a:text-amber-400 hover:prose-a:text-amber-300 animate-in fade-in duration-1000 delay-150 fill-mode-both">
            <p>
              At Formix (the "Data Fiduciary"), we respect your privacy and are
              committed to protecting your personal data in accordance with the
              Digital Personal Data Protection (DPDP) Act, 2023 of India. This
              notice explains what data we collect, why we collect it, how long
              we retain it, and your rights as a Data Principal.
            </p>

            <h2>1. Personal Data We Collect</h2>
            <p>
              We collect personal data only when strictly necessary for
              providing our services. This includes:
            </p>
            <ul>
              <li>
                <strong>Account Data:</strong> Name, email address, profile
                image, and authentication logs (via BetterAuth).
              </li>
              <li>
                <strong>Contact Data:</strong> Information provided when
                submitting support or inquiry forms.
              </li>
              <li>
                <strong>Service Data:</strong> API tokens, Webhook URLs, and
                configuration data needed to integrate third-party services
                (e.g., Slack, Zapier, Meta).
              </li>
              <li>
                <strong>Form Submissions:</strong> We process and store data
                submitted via your Formix forms on your behalf. Note: You remain
                the primary Data Fiduciary for your end-users' data.
              </li>
            </ul>

            <h2>2. Purpose of Collection</h2>
            <p>
              Your data is processed strictly for the following purposes based
              on your explicit consent:
            </p>
            <ul>
              <li>
                To provide, secure, and maintain the Formix headless API
                infrastructure.
              </li>
              <li>
                To route form submissions to your designated integrations.
              </li>
              <li>To process billing and subscriptions (via Dodo Payments).</li>
              <li>
                To communicate service updates, security alerts, and promotional
                offers (only if explicitly opted-in).
              </li>
            </ul>

            <h2>3. Third-Party Data Processors</h2>
            <p>
              We share minimal necessary data with verified third-party
              processors to run Formix. These include:
            </p>
            <ul>
              <li>
                <strong>Database & Storage:</strong> Neon PostgreSQL,
                UploadThing.
              </li>
              <li>
                <strong>Authentication & Payments:</strong> BetterAuth, Dodo
                Payments.
              </li>
              <li>
                <strong>Analytics & Security:</strong> Upstash Redis (rate
                limiting), PostHog, Vercel Analytics (only with your cookie
                consent).
              </li>
              <li>
                <strong>Communication:</strong> Resend (transactional emails).
              </li>
              <li>
                <strong>AI Processing:</strong> Groq AI (Only form schemas are
                sent; end-user submission data is NEVER sent to AI models).
              </li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill
              the purpose for which it was collected. If you request account
              deletion, your Account Data and Form Submissions are permanently
              erased from our active databases within 30 days. Backup logs are
              purged within 90 days.
            </p>

            <h2>5. Your Rights as a Data Principal</h2>
            <p>
              Under the DPDP Act, 2023, you have the following rights regarding
              your personal data:
            </p>
            <ul>
              <li>
                <strong>Right to Access:</strong> Request a summary of personal
                data we process about you.
              </li>
              <li>
                <strong>Right to Correction & Erasure:</strong> Request
                correction of inaccurate data or deletion of your data when it
                is no longer required. (Account deletion can be done directly
                from the dashboard).
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Withdraw your
                consent for non-essential processing (e.g., marketing emails,
                analytics trackers) at any time via your dashboard settings.
              </li>
              <li>
                <strong>Right to Nominate:</strong> Nominate an individual to
                exercise your rights in the event of death or incapacity.
              </li>
            </ul>

            <h2>6. Grievance Redressal</h2>
            <p>
              If you have any concerns regarding how your data is handled, wish
              to exercise your rights, or want to report a data breach, please
              contact our designated Grievance Officer:
            </p>
            <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl mt-4 not-prose">
              <p className="text-white font-medium mb-1">
                Grievance Officer: Legal & Compliance Team
              </p>
              <p className="text-neutral-400 text-sm mb-1">
                Email:{" "}
                <a
                  href="mailto:support@formix.rikikashyap.dev"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  support@formix.rikikashyap.dev
                </a>
              </p>
              <p className="text-neutral-400 text-sm">
                Response Time: We aim to acknowledge your request within 24
                hours and resolve it within the legally mandated timeframe.
              </p>
            </div>
          </article>
        </div>

        {/* Separator */}
        <div className="w-full flex flex-col items-center relative z-10 bg-[#0a0a0a]">
          <div className="w-full h-px bg-neutral-700/30"></div>
          <div className="w-full max-w-300">
            <Separator />
          </div>
          <div className="w-full h-px bg-neutral-700/30"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
