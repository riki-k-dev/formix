"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setError("You must consent to data processing to contact us.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
        consent: false,
      });
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative selection:bg-neutral-800 selection:text-white">
      <Grid />
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full pt-20 pb-0">
        <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30 bg-[#0a0a0a] min-h-[calc(100vh-80px)]">
          {/* HEADER SECTION */}
          <div className="p-10 lg:p-16 lg:pt-24 border-b border-neutral-700/30 text-left flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-5 border border-white/10 w-max px-3 py-1 rounded-full bg-white/5"
            >
              <MessageSquare size={14} className="text-neutral-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">
                Contact Us
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-4xl md:text-5xl font-mono text-white mb-4 tracking-tight"
            >
              Let&apos;s build something great.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl"
            >
              Have a question about Formix, need help setting up your headless
              architecture, or want to discuss enterprise plans? We&apos;re here
              to help.
            </motion.p>
          </div>

          {/* TWO COLUMN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
            {/* LEFT COLUMN: Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-neutral-700/30 flex flex-col gap-12"
            >
              <div>
                <h3 className="text-xl font-medium text-white mb-6">
                  Reach out directly
                </h3>

                <a
                  href="mailto:support@formix.rikikashyap.dev"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-white transition-all duration-300">
                    <Mail
                      size={20}
                      className="text-neutral-400 group-hover:text-black transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                      Support
                    </p>
                    <p className="text-xs text-neutral-500 font-mono mt-1">
                      support@formix.rikikashyap.dev
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: The Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="p-10 lg:p-16 flex items-center justify-center bg-[#0d0d0d] border-b border-neutral-700/30 lg:border-b-0"
            >
              {isSuccess ? (
                <div className="bg-[#050505] border border-neutral-800 p-10 rounded-2xl w-full max-w-md text-center shadow-2xl animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                    Thanks for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-md space-y-5"
                >
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-400">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="John"
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all placeholder:text-neutral-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-400">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Doe"
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all placeholder:text-neutral-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-400">
                      Work Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@company.com"
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-400">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a topic...
                      </option>
                      <option value="support">General Support</option>
                      <option value="sales">Sales & Enterprise</option>
                      <option value="bug">Report a Bug</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-400">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all min-h-[120px] resize-y placeholder:text-neutral-600"
                    />
                  </div>

                  {/* DPDP Compliance Checkbox */}
                  <div className="space-y-1.5 pb-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white shrink-0"
                      />
                      <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors leading-relaxed">
                        I consent to Formix processing my personal data to
                        respond to my inquiry, in accordance with the{" "}
                        <a
                          href="/privacy"
                          className="text-white hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.consent}
                    className="w-full bg-white text-black font-medium py-3 rounded-lg mt-2 hover:bg-neutral-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Send Message <Send size={16} className="ml-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* SEPARATOR SECTION */}
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
