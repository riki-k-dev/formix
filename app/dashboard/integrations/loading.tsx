export default function IntegrationsLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 pb-20 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-48 bg-neutral-800 rounded-md"></div>
        <div className="h-5 w-10 bg-neutral-800/50 rounded-sm"></div>
      </div>
      <div className="h-4 w-full max-w-xl bg-neutral-800/50 rounded-md mb-2"></div>
      <div className="h-4 w-3/4 max-w-lg bg-neutral-800/50 rounded-md mb-10"></div>

      {/* Integrations Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 flex flex-col"
          >
            {/* Card Header (Icon & Status) */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-800"></div>
              {i % 3 === 0 && (
                <div className="w-20 h-6 bg-neutral-800/50 rounded-md"></div>
              )}
            </div>

            {/* Card Body (Title & Description) */}
            <div className="flex flex-col flex-1">
              <div className="h-5 w-32 bg-neutral-800 rounded mb-2.5"></div>
              <div className="space-y-2 flex-1 min-h-10">
                <div className="h-3 w-full bg-neutral-800/50 rounded"></div>
                <div className="h-3 w-4/5 bg-neutral-800/50 rounded"></div>
              </div>
            </div>

            {/* Card Footer (Button) */}
            <div className="mt-4 flex gap-3">
              {i % 3 === 0 ? (
                <>
                  <div className="h-9 flex-1 bg-neutral-800 rounded-md"></div>
                  <div className="h-9 flex-1 bg-neutral-800 rounded-md"></div>
                </>
              ) : (
                <div className="h-9 w-full bg-neutral-800 rounded-md"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
