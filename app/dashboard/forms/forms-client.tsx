"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Activity,
  Globe,
  Lock,
  MessageSquare,
  Webhook,
  Copy,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import GenerateFormModal from "@/components/dashboard/GenerateFormModal";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Form = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  submissionsCount: number;
  hasWhatsapp: boolean;
  hasWebhook: boolean;
  createdAt: Date;
};

export default function FormsClient({
  initialForms,
}: {
  initialForms: Form[];
}) {
  const router = useRouter();

  const [formsList, setFormsList] = useState<Form[]>(initialForms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredForms = formsList.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (form.description &&
        form.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "All Status" ||
      form.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = (formId: string) => {
    const url = `${window.location.origin}/to/${formId}`;
    navigator.clipboard.writeText(url);
    toast.success("Public link copied to clipboard!");
    setActiveDropdown(null);
  };

  const handleDelete = async (formId: string, formName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${formName}"? This will delete all its data.`,
      )
    ) {
      setActiveDropdown(null);
      return;
    }

    setDeletingId(formId);
    try {
      const res = await fetch(`/api/forms/delete?formId=${formId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete form");

      setFormsList(formsList.filter((f) => f.id !== formId));
      toast.success("Form deleted successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete form");
    } finally {
      setDeletingId(null);
      setActiveDropdown(null);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-mono tracking-tight text-white mb-1">
              My Forms
            </h1>
            <p className="text-neutral-400 text-sm">
              Manage your generated form schemas, APIs, and micro-UIs.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} />
            <span>New Form</span>
          </button>
        </div>

        {/* Utilities Section */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms..."
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-600 appearance-none cursor-pointer"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="group bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 rounded-xl p-5 transition-all duration-200 flex flex-col"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {form.status === "active" ? (
                    <Globe size={14} className="text-green-500" />
                  ) : (
                    <Lock size={14} className="text-neutral-500" />
                  )}
                  <h3
                    className="text-neutral-200 font-medium truncate max-w-[160px]"
                    title={form.name}
                  >
                    {form.name}
                  </h3>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === form.id ? null : form.id,
                      )
                    }
                    className="text-neutral-500 hover:text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-neutral-800"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {activeDropdown === form.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveDropdown(null)}
                      ></div>

                      <div className="absolute right-0 mt-1 w-40 bg-[#111] border border-neutral-800 rounded-lg shadow-xl py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => handleCopyLink(form.id)}
                          className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                        >
                          <Copy size={14} /> Copy Public Link
                        </button>

                        <Link
                          href={`/dashboard/forms/${form.id}`}
                          className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                        >
                          <Edit2 size={14} /> Edit Schema
                        </Link>

                        <div className="h-px bg-neutral-800 my-1 w-full"></div>

                        <button
                          onClick={() => handleDelete(form.id, form.name)}
                          disabled={deletingId === form.id}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          {deletingId === form.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Delete Form
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-neutral-500 text-xs mb-6 line-clamp-2 min-h-8">
                {form.description || "No description provided."}
              </p>

              {/* Stats & Integrations */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800/50">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Activity size={14} />
                    <span>{form.submissionsCount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {form.hasWhatsapp && (
                      <div
                        className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20"
                        title="WhatsApp Flow Enabled"
                      >
                        <MessageSquare size={10} className="text-green-500" />
                      </div>
                    )}
                    {form.hasWebhook && (
                      <div
                        className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20"
                        title="Webhooks Enabled"
                      >
                        <Webhook size={10} className="text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-neutral-600 font-mono uppercase">
                  {new Date(form.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Create New Card */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="group bg-transparent border border-dashed border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900/20 rounded-xl p-5 transition-all flex flex-col items-center justify-center text-center h-full min-h-[180px] gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-neutral-800 transition-colors">
              <Plus size={20} />
            </div>
            <div>
              <p className="text-neutral-300 text-sm font-medium group-hover:text-white transition-colors">
                Create New Form
              </p>
              <p className="text-neutral-500 text-xs mt-1">
                Generate a schema with AI
              </p>
            </div>
          </button>
        </div>
      </div>

      <GenerateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
