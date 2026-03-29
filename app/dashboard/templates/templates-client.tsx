"use client";

import { useState, useMemo } from "react";
import { Search, FileText, ArrowRight, Clock, Loader2 } from "lucide-react";
import { Template } from "@/lib/templates";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TemplatesClient({
  templates,
}: {
  templates: Template[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const categories = [
    "All Categories",
    ...Array.from(new Set(templates.map((t) => t.category))),
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const handleUseTemplate = async (templateId: string) => {
    setCreatingId(templateId);
    try {
      const res = await fetch("/api/templates/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Template applied successfully!");

      router.push(`/dashboard/forms/${data.formId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to use template.");
      setCreatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
          Templates Library
        </h1>
        <p className="text-neutral-400 text-sm max-w-xl">
          Start with a pre-built template to launch your form in seconds.
          Customize it later to fit your exact needs.
        </p>
      </div>

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
            placeholder="Search templates..."
            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-600 appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TEMPLATE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-700 transition-colors rounded-xl p-5 flex flex-col group relative"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="text-neutral-400" size={18} />
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-1 rounded-md font-medium">
                {template.category}
              </span>
            </div>

            <div className="flex flex-col flex-1 mb-6">
              <h3 className="text-base font-medium text-neutral-200 mb-1.5">
                {template.name}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 min-h-[32px]">
                {template.description}
              </p>
            </div>

            <button
              onClick={() => handleUseTemplate(template.id)}
              disabled={creatingId === template.id}
              className="w-full py-2.5 bg-neutral-900 text-neutral-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-neutral-800 hover:border-neutral-600 hover:text-white cursor-pointer disabled:opacity-50"
            >
              {creatingId === template.id ? (
                <>
                  Creating...{" "}
                  <Loader2 size={14} className="animate-spin opacity-50" />
                </>
              ) : (
                <>
                  Use Template <ArrowRight size={14} className="opacity-50" />
                </>
              )}
            </button>
          </div>
        ))}

        {/* COMING SOON CARD */}
        <div className="border border-dashed border-neutral-800 hover:border-neutral-600 rounded-xl p-5 flex flex-col justify-center items-center text-center group bg-[#0a0a0a] min-h-[22rem]">
          <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="text-neutral-600" size={20} />
          </div>
          <h3 className="text-base font-medium text-neutral-400 mb-2 truncate">
            More templates coming soon
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed max-w-[200px]">
            We&apos;re building new templates for feedback, lead gen, and
            internal HR needs. Stay tuned!
          </p>
          <div className="w-full py-2.5 bg-neutral-950 text-neutral-600 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-neutral-800 mt-8">
            Stay tuned
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl bg-[#050505] mt-10">
          <p className="text-neutral-400 text-sm">
            No templates found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Categories");
            }}
            className="mt-4 text-xs text-neutral-300 hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
