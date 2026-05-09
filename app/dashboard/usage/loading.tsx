export default function UsageLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-10">
        <div className="h-8 w-32 bg-neutral-800 rounded-md mb-2"></div>
        <div className="h-4 w-80 bg-neutral-800/50 rounded-md"></div>
      </div>

      {/* Usage Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6 h-44 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800"></div>
              <div className="h-4 w-24 bg-neutral-800/50 rounded"></div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="h-8 w-16 bg-neutral-800 rounded"></div>
                <div className="h-3 w-12 bg-neutral-800/30 rounded"></div>
              </div>
              <div className="w-full bg-neutral-900 rounded-full h-1.5 mb-2"></div>
              <div className="h-3 w-28 bg-neutral-800/30 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Banner Skeleton */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2 w-full sm:w-auto">
          <div className="h-5 w-48 bg-neutral-800 rounded"></div>
          <div className="h-4 w-full max-w-md bg-neutral-800/50 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-800 rounded-md shrink-0"></div>
      </div>
    </div>
  );
}
