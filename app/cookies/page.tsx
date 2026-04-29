import { Metadata } from "next";
import { Cookie } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";

export const metadata: Metadata = {
  title: "Cookie Policy | Formix",
  description:
    "Information about how Formix uses cookies to improve your experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative selection:bg-neutral-800 selection:text-white">
      <Grid />
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full pt-20 pb-0">
        <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30 bg-[#0a0a0a] min-h-[calc(100vh-80px)]">
          <div className="px-6 md:px-10 lg:px-24 py-16 lg:py-24 border-b border-neutral-700/30 text-left flex flex-col items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-5 border border-white/10 w-max px-3 py-1 rounded-full bg-white/5">
              <Cookie size={14} className="text-neutral-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                Legal
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-mono">
              Last updated: April 28, 2026
            </p>
          </div>

          <article className="px-6 md:px-10 lg:px-24 py-16 w-full max-w-4xl prose prose-invert prose-neutral lg:prose-lg prose-headings:font-medium prose-a:text-amber-400 hover:prose-a:text-amber-300 animate-in fade-in duration-1000 delay-150 fill-mode-both">
            <p>
              This Cookie Policy explains how Formix uses cookies and similar
              technologies to recognize you when you visit our website and use
              our dashboard.
            </p>

            <h2>What are cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. They are widely used by
              website owners to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </p>

            <h2>Why do we use cookies?</h2>
            <p>
              We use first-party and third-party cookies for several reasons:
            </p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Some cookies are required
                for technical reasons in order for our Dashboard to operate. For
                example, our authentication provider (BetterAuth) uses secure
                HTTP-only cookies to maintain your login session.
              </li>
              <li>
                <strong>Performance & Functionality:</strong> These cookies are
                used to enhance the performance and functionality of our APIs
                and dashboard but are non-essential to their use.
              </li>
              <li>
                <strong>Analytics:</strong> We use minimal analytics to
                understand how our site is being used, helping us improve the
                developer experience.
              </li>
            </ul>

            <h2>What about the APIs I generate?</h2>
            <p>
              <strong>Formix APIs are strictly headless and stateless.</strong>{" "}
              When your end-users submit data to a Formix API endpoint, we do
              not set any tracking cookies on their browsers. You have full
              control over the cookie policy of the frontend application where
              you integrate our API.
            </p>

            <h2>How can I control cookies?</h2>
            <p>
              You have the right to decide whether to accept or reject
              non-essential cookies. You can set or amend your web browser
              controls to accept or refuse cookies. If you choose to reject
              cookies, you may still use our website though your access to some
              functionality and areas (like the authenticated dashboard) may be
              restricted.
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
