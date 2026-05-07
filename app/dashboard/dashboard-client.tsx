"use client";

import { useState } from "react";
import { Sparkles, Activity, FileText, BarChart3, Clock } from "lucide-react";
import GenerateFormModal from "@/components/dashboard/GenerateFormModal";

type DashboardStats = {
  totalForms: number;
  activeForms: number;
  totalSubmissions: number;
  avgConversion: string;
};

type RecentSubmission = {
  id: string;
  formName: string;
  createdAt: string;
};

export default function DashboardClient({
  userName,
  stats,
  recentSubmissions,
}: {
  userName: string;
  stats: DashboardStats;
  recentSubmissions: RecentSubmission[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {stats.totalForms === 0 ? (
        <div className="max-w-6xl mx-auto p-8 md:p-10 animate-in fade-in duration-300">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
              Overview
            </h1>
            <p className="text-neutral-400 text-sm">
              Get a high-level view of your active forms, API usage, and recent
              submissions.
            </p>
          </div>

          <div className="h-px bg-neutral-800 w-full mb-12"></div>

          {/* Content Section */}
          <div className="max-w-2xl">
            <p className="text-neutral-400 text-sm mb-2">Get started</p>
            <h2 className="text-3xl tracking-tight text-white mb-4">
              Welcome to Formix
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-10 max-w-lg">
              AI-powered headless forms. Generate schemas, APIs, and UIs
              <br />
              in seconds—zero backend required
            </p>

            {/* Steps */}
            <div className="space-y-5 mb-10">
              <div className="flex items-start gap-4 text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono text-xs shrink-0">
                  1
                </span>
                <p className="text-neutral-300 pt-0.5">
                  <span className="text-white font-medium">Prompt:</span>{" "}
                  Describe your form requirements.
                </p>
              </div>

              <div className="flex items-start gap-4 text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono text-xs shrink-0">
                  2
                </span>
                <p className="text-neutral-300 pt-0.5">
                  <span className="text-white font-medium">Generate:</span> Get
                  instant JSON schemas and APIs.
                </p>
              </div>

              <div className="flex items-start gap-4 text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono text-xs shrink-0">
                  3
                </span>
                <p className="text-neutral-300 pt-0.5">
                  <span className="text-white font-medium">Ship:</span> Connect
                  the API or share the micro-form.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <Sparkles size={16} />
              Generate New Form
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-5 sm:p-8 md:p-10 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-mono tracking-tight text-white mb-1">
                Welcome back, {userName}
              </h1>
              <p className="text-neutral-400 text-sm">
                Here&apos;s what&apos;s happening with your forms today.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles size={16} />
              Generate New Form
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 text-neutral-400 mb-4">
                <FileText size={18} />
                <span className="text-sm font-medium">Total Forms</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-semibold text-white">
                  {stats.totalForms}
                </h2>
                <span className="text-xs text-neutral-500 font-mono">
                  {stats.activeForms} active
                </span>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 text-neutral-400 mb-4">
                <Activity size={18} />
                <span className="text-sm font-medium">Total Submissions</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-semibold text-white">
                  {stats.totalSubmissions}
                </h2>
                <span className="text-xs text-green-400/80 font-mono bg-green-400/10 px-1.5 py-0.5 rounded">
                  All time
                </span>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 text-neutral-400 mb-4">
                <BarChart3 size={18} />
                <span className="text-sm font-medium">Avg. Conversion</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-semibold text-white">
                  {stats.avgConversion}
                </h2>
                <span className="text-xs text-neutral-500 font-mono">
                  Estimated
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="px-5 sm:px-6 py-5 border-b border-neutral-800 flex items-center gap-2 text-white font-medium">
              <Clock size={18} className="text-neutral-400" />
              Recent Activity
            </div>

            <div className="divide-y divide-neutral-800/50">
              {recentSubmissions.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm">
                  No recent submissions yet. Share your forms to get started!
                </div>
              ) : (
                recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-900/20 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-200 font-medium mb-0.5">
                        New submission received
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        Form:{" "}
                        <span className="text-neutral-400">{sub.formName}</span>
                      </p>
                    </div>
                    <div className="text-[11px] sm:text-xs text-neutral-500 font-mono shrink-0">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <GenerateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
