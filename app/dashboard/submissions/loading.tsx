export default function SubmissionsLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 w-full animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-40 bg-neutral-800 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-neutral-800/50 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-800 rounded-md shrink-0"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="h-10 w-full md:w-64 bg-neutral-800/50 rounded-lg"></div>
        <div className="h-10 w-full md:w-80 bg-neutral-800/50 rounded-lg"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-900/40 border-b border-neutral-800">
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-5 py-4">
                    <div className="h-4 w-20 bg-neutral-800 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-4">
                    <div className="h-4 w-24 bg-neutral-800/50 rounded"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-32 bg-neutral-800/50 rounded"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-8 w-full max-w-xs bg-neutral-800/50 rounded border border-neutral-800/50"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-5 w-12 bg-neutral-800 rounded-md"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-16 bg-neutral-800/50 rounded ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
