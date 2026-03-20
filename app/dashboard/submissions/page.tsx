import {
  Search,
  Download,
  Filter,
  MoreHorizontal,
  Code,
  Calendar,
} from "lucide-react";

const mockSubmissions = [
  {
    id: "sub_109283",
    formName: "Startup Waitlist",
    data: { email: "founder@nextunicorn.com", role: "CEO" },
    channel: "Web",
    createdAt: "Mar 20, 2026, 14:30",
  },
  {
    id: "sub_109282",
    formName: "Startup Waitlist",
    data: { email: "dev@acmecorp.io", role: "CTO" },
    channel: "WhatsApp",
    createdAt: "Mar 20, 2026, 12:15",
  },
  {
    id: "sub_109281",
    formName: "Customer Feedback 2026",
    data: { rating: "5/5", comment: "The API generation is magic!" },
    channel: "Web",
    createdAt: "Mar 19, 2026, 09:45",
  },
  {
    id: "sub_109280",
    formName: "Internal Bug Tracker",
    data: { issue: "Login modal overflow on mobile", severity: "High" },
    channel: "API",
    createdAt: "Mar 18, 2026, 16:20",
  },
  {
    id: "sub_109279",
    formName: "Startup Waitlist",
    data: { email: "investor@vc.fund", role: "Partner" },
    channel: "Web",
    createdAt: "Mar 18, 2026, 11:10",
  },
];

export default function SubmissionsPage() {
  return (
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
          <button className="px-4 py-2 bg-transparent text-neutral-300 border border-neutral-800 rounded-md text-sm hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Utilities Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="w-full md:w-64 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600 appearance-none cursor-pointer">
            <option>All Forms</option>
            <option>Startup Waitlist</option>
            <option>Customer Feedback 2026</option>
            <option>Internal Bug Tracker</option>
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
            placeholder="Search data (e.g., email or text)..."
            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-900/40 border-b border-neutral-800 text-neutral-400">
                <th className="px-5 py-3 font-medium flex items-center gap-2">
                  <Calendar size={14} /> Date
                </th>
                <th className="px-5 py-3 font-medium">Form</th>
                <th className="px-5 py-3 font-medium w-1/2">Payload (JSON)</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {mockSubmissions.map((sub) => (
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
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider bg-neutral-800 border border-neutral-700">
                      {sub.channel}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="text-neutral-500 hover:text-neutral-300 transition-colors"
                        title="View Raw JSON"
                      >
                        <Code size={16} />
                      </button>
                      <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination/Footer */}
        <div className="px-5 py-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Showing 5 of 1,329 results</span>
          <div className="flex gap-4">
            <button
              className="hover:text-neutral-300 disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="hover:text-neutral-300 text-neutral-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
