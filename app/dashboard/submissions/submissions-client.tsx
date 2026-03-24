"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Code,
  Calendar,
  Trash2,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, unknown>;
  channel: string;
  createdAt: string;
};

export default function SubmissionsClient({
  initialSubmissions,
}: {
  initialSubmissions: Submission[];
}) {
  const router = useRouter();

  const [submissionsList, setSubmissionsList] =
    useState<Submission[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [formFilter, setFormFilter] = useState("All Forms");

  const [viewJsonData, setViewJsonData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<{
    id: string;
    formId: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const uniqueForms = [
    "All Forms",
    ...Array.from(new Set(initialSubmissions.map((s) => s.formName))),
  ];

  const filteredSubmissions = submissionsList.filter((sub) => {
    const matchesSearch =
      sub.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(sub.data)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesForm =
      formFilter === "All Forms" || sub.formName === formFilter;

    return matchesSearch && matchesForm;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, formFilter]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      return toast.error("No data available to export.");
    }

    const allKeys = new Set<string>();
    filteredSubmissions.forEach((sub) => {
      Object.keys(sub.data).forEach((key) => allKeys.add(key));
    });

    const headers = ["Date", "Form Name", "Channel", ...Array.from(allKeys)];
    const csvRows = [headers.join(",")];

    filteredSubmissions.forEach((sub) => {
      const row = [
        `"${sub.createdAt}"`,
        `"${sub.formName}"`,
        `"${sub.channel}"`,
      ];

      Array.from(allKeys).forEach((key) => {
        let val = sub.data[key] || "";
        if (typeof val === "object") val = JSON.stringify(val);
        row.push(`"${String(val).replace(/"/g, '""')}"`);
      });

      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formix_submissions_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("CSV exported successfully!");
  };

  const initiateDelete = (id: string, formId: string) => {
    setSubmissionToDelete({ id, formId });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!submissionToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/submissions/delete?id=${submissionToDelete.id}&formId=${submissionToDelete.formId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) throw new Error("Failed to delete submission");

      setSubmissionsList(
        submissionsList.filter((s) => s.id !== submissionToDelete.id),
      );
      toast.success("Submission deleted successfully");

      if (paginatedSubmissions.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete submission");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSubmissionToDelete(null);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-8 md:p-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-mono tracking-tight text-white mb-1">
              Submissions
            </h1>
            <p className="text-neutral-400 text-sm">
              View, filter, and export incoming data across all your forms.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Utilities Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              className="w-full md:w-64 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 appearance-none cursor-pointer"
            >
              {uniqueForms.map((formName) => (
                <option key={formName} value={formName}>
                  {formName}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data (e.g., email or text)..."
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all cursor-text"
            />
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-900/40 border-b border-neutral-800 text-neutral-400">
                  <th className="px-5 py-3 font-medium flex items-center gap-2">
                    <Calendar size={14} /> Date
                  </th>
                  <th className="px-5 py-3 font-medium">Form</th>
                  <th className="px-5 py-3 font-medium w-1/2">
                    Payload (JSON)
                  </th>
                  <th className="px-5 py-3 font-medium">Channel</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {paginatedSubmissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-20 text-center text-neutral-500"
                    >
                      No submissions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-neutral-900/20 transition-colors group"
                    >
                      <td className="px-5 py-4 text-neutral-400 whitespace-nowrap">
                        {sub.createdAt}
                      </td>
                      <td className="px-5 py-4 text-neutral-200 font-medium whitespace-nowrap">
                        {sub.formName}
                      </td>
                      <td className="px-5 py-4">
                        <div className="bg-neutral-900/50 border border-neutral-800/50 rounded p-2 text-xs font-mono text-neutral-400 truncate max-w-sm">
                          {JSON.stringify(sub.data)}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-neutral-400">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider bg-neutral-800 border border-neutral-700 text-green-400">
                          {sub.channel}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                            title="View Raw JSON"
                            onClick={() => setViewJsonData(sub.data)}
                          >
                            <Code size={16} />
                          </button>

                          <button
                            onClick={() => initiateDelete(sub.id, sub.formId)}
                            className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Submission"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination/Footer */}
          <div className="px-5 py-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <span>
              Page {currentPage} of {Math.max(1, totalPages)} (
              {filteredSubmissions.length} total)
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="hover:text-neutral-300 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="hover:text-neutral-300 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SLEEK RAW JSON MODAL */}
      {viewJsonData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Code size={16} className="text-neutral-400" />
                Raw JSON Payload
              </h3>
              <button
                onClick={() => setViewJsonData(null)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] bg-black">
              <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-words">
                {JSON.stringify(viewJsonData, null, 2)}
              </pre>
            </div>
            <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-900/50 flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(viewJsonData, null, 2),
                  );
                  toast.success("JSON copied to clipboard!");
                }}
                className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4 mx-auto">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-white text-center mb-2">
              Delete Submission
            </h3>
            <p className="text-sm text-neutral-400 text-center mb-6">
              Are you sure you want to delete this response? This action cannot
              be undone and the data will be permanently lost.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-transparent text-white border border-neutral-800 rounded-md text-sm hover:bg-neutral-900 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-transparent text-white border border-neutral-800 rounded-md text-sm hover:bg-neutral-900 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
