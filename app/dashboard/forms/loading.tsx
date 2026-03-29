export default function FormsLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 w-full animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-40 bg-neutral-800 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-neutral-800/50 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-800 rounded-md shrink-0"></div>
      </div>

      {/* Utilities Section */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="h-10 w-full max-w-md bg-neutral-800/50 rounded-lg"></div>
        <div className="h-10 w-32 bg-neutral-800/50 rounded-lg"></div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-5 flex flex-col min-h-[180px]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-neutral-800 rounded-full"></div>
                <div className="h-5 w-32 bg-neutral-800 rounded"></div>
              </div>
              <div className="h-6 w-6 bg-neutral-800 rounded"></div>
            </div>

            <div className="space-y-2 mb-6 mt-2">
              <div className="h-3 w-full bg-neutral-800/50 rounded"></div>
              <div className="h-3 w-2/3 bg-neutral-800/50 rounded"></div>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-800/50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-4 w-10 bg-neutral-800/50 rounded"></div>
                <div className="h-4 w-12 bg-neutral-800/50 rounded"></div>
              </div>
              <div className="h-3 w-16 bg-neutral-800/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
