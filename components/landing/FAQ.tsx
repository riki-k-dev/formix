"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What exactly is a 'headless' form?",
    answer:
      "Unlike traditional builders that force you to use their iframes or drag-and-drop UI, a headless form provides just the backend infrastructure (JSON schema, APIs, validation, webhooks). You build your own custom UI in your app (e.g., using Next.js/React) and simply send data to our API endpoint.",
  },
  {
    question: "Do I need to write any backend code?",
    answer:
      "No! That's the core value of Formix. You prompt the AI, and it instantly generates a ready-to-use API endpoint, validation logic, and database tables for your form. You only focus on the frontend.",
  },
  {
    question: "How does the WhatsApp integration work?",
    answer:
      "Once you connect your Meta WhatsApp Cloud API credentials, Formix reads your form's JSON schema and automatically converts it into a conversational bot flow. Users can fill out the form entirely within WhatsApp, and the data syncs straight to your dashboard.",
  },
  {
    question: "Can I send my form data to other apps?",
    answer:
      "Yes. Formix comes with built-in integrations for Slack, Discord, Google Sheets, Airtable, Notion, and Zapier. We also provide standard Webhooks so you can route real-time submission data to any external service.",
  },
  {
    question: "What happens if I exceed my Starter plan limits?",
    answer:
      "Your API will continue to accept submissions for a short grace period, but you will receive alerts to upgrade. Upgrading to the Pro plan ($12/mo) unlocks unlimited responses, unlimited AI generations, and premium features like WhatsApp distribution.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full flex flex-col items-center relative z-10 bg-[#0a0a0a]">
      <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30">
        {/* FAQ HEADER */}
        <div className="p-10 lg:p-16 border-b border-neutral-700/30 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-mono text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">
            Everything you need to know about Formix, how it integrates with
            your tech stack, and how billing works.
          </p>
        </div>

        {/* FAQ ACCORDION LIST */}
        <div className="flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "border-b border-neutral-700/30 transition-colors",
                  isOpen ? "bg-neutral-900/20" : "hover:bg-neutral-900/10",
                )}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-8 lg:px-12 text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-base font-medium text-neutral-200 pr-8">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200",
                      isOpen
                        ? "bg-white text-black border-white"
                        : "bg-neutral-900 border-neutral-700 text-neutral-400",
                    )}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* Expandable Content */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  <div className="pb-8 px-8 lg:px-12 text-sm text-neutral-400 leading-relaxed max-w-4xl">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* STILL HAVE QUESTIONS SECTION */}
        <div className="p-8 text-center bg-neutral-900/10">
          <p className="text-sm text-neutral-400">
            Still have questions?{" "}
            <a
              href="mailto:support@formix.com"
              className="text-white hover:text-neutral-300 transition-colors"
            >
              support@formix.com
            </a>
          </p>
        </div>
      </div>

      {/* LINE: Bottom of FAQ Section */}
      <div className="w-full h-px bg-neutral-700/30"></div>
    </section>
  );
}
