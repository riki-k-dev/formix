export default function OverviewLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 w-full animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-64 bg-neutral-800 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-neutral-800/50 rounded-md"></div>
        </div>
        <div className="h-10 w-40 bg-neutral-800 rounded-md shrink-0"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-5 w-5 bg-neutral-800 rounded-full"></div>
              <div className="h-4 w-24 bg-neutral-800/50 rounded"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="h-10 w-16 bg-neutral-800 rounded-md"></div>
              <div className="h-4 w-12 bg-neutral-800/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity List */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center gap-2">
          <div className="h-5 w-5 bg-neutral-800 rounded-full"></div>
          <div className="h-5 w-32 bg-neutral-800 rounded"></div>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <div className="h-4 w-40 bg-neutral-800 rounded mb-2"></div>
                <div className="h-3 w-24 bg-neutral-800/50 rounded"></div>
              </div>
              <div className="h-3 w-28 bg-neutral-800/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
