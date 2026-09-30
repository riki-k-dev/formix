import { Metadata } from "next";
import { Scale } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";

export const metadata: Metadata = {
  title: "Terms of Service | Formix",
  description: "Terms and conditions for using Formix services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative selection:bg-neutral-800 selection:text-white">
      <Grid />
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full pt-20 pb-0">
        <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30 bg-[#0a0a0a] min-h-[calc(100vh-80px)]">
          <div className="px-6 md:px-10 lg:px-24 py-16 lg:py-24 border-b border-neutral-700/30 text-left flex flex-col items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-5 border border-white/10 w-max px-3 py-1 rounded-full bg-white/5">
              <Scale size={14} className="text-neutral-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                Legal
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-mono">
              Last updated: September 30, 2026 | [LEGAL REVIEW REQUIRED]
            </p>
          </div>

          <article className="px-6 md:px-10 lg:px-24 py-16 w-full max-w-4xl prose prose-invert prose-neutral lg:prose-lg prose-headings:font-medium prose-a:text-amber-400 hover:prose-a:text-amber-300 animate-in fade-in duration-1000 delay-150 fill-mode-both">
            <p>
              Welcome to Formix. By accessing or using our website, APIs, and
              headless form infrastructure, you agree to be bound by these Terms
              of Service.
            </p>

            <h2>1. Service Description</h2>
            <p>
              Formix provides a platform for generating JSON schemas,
              provisioning database tables, and exposing API endpoints for data
              collection. The service includes third-party integrations (e.g.,
              Meta WhatsApp Cloud API, Slack, Zapier) which are subject to their
              respective terms of service.
            </p>

            <h2>2. API Usage & Rate Limiting</h2>
            <p>
              You agree to use our APIs responsibly. We employ rate limiting
              (via Upstash Redis) to ensure platform stability.
              <strong>Starter Plan</strong> users are limited to standard API
              quotas. <strong>Pro Plan</strong> users enjoy expanded rate
              limits. Excessive abuse, spamming, or reverse-engineering of our
              API endpoints will result in immediate account termination.
            </p>

            <h2>3. Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              API keys and account credentials. Formix explicitly warns against
              exposing Secret API Keys in client-side code. We are not liable
              for any data breaches resulting from exposed keys on your end.
            </p>

            <h2>4. Prohibited Content</h2>
            <p>
              You may not use Formix to distribute malware, engage in phishing,
              or collect illegal data. Formix reserves the right to terminate
              endpoints violating these terms.
            </p>

            <h2>5. Payments and Refunds</h2>
            <p>
              Paid services (Pro Plan) are billed on a subscription basis via
              Dodo Payments. You may cancel your subscription at any time.
              Refunds are handled on a case-by-case basis within 14 days of the
              latest billing cycle.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              Formix provides the service "as is". We shall not be liable for
              any indirect, incidental, or consequential damages resulting from
              the use or inability to use our API infrastructure.
            </p>

            <h2>7. Data Protection & DPDP Act 2023 Compliance</h2>
            <p>
              By using Formix to collect data from your end-users, you
              acknowledge that{" "}
              <strong>you are the primary Data Fiduciary</strong> under the
              Digital Personal Data Protection (DPDP) Act, 2023. Formix acts
              strictly as a Data Processor on your behalf for the submissions
              you receive.
            </p>
            <p>You agree to:</p>
            <ul>
              <li>
                Obtain valid, verifiable consent from your end-users before
                collecting their personal data via Formix APIs.
              </li>
              <li>
                Provide clear purpose limitations and privacy notices to your
                end-users.
              </li>
              <li>
                Promptly honor data erasure or correction requests from your
                end-users by deleting their submissions from the Formix
                dashboard.
              </li>
              <li>
                Notify Formix immediately if you suspect a personal data breach
                related to your Formix account.
              </li>
            </ul>
            <p>
              For more details on how we protect your personal account data,
              please refer to our Privacy Policy.
            </p>
          </article>
        </div>

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
