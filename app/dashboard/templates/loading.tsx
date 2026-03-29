export default function TemplatesLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 pb-20 w-full animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-neutral-800 rounded-md mb-2"></div>
        <div className="h-4 w-full max-w-xl bg-neutral-800/50 rounded-md"></div>
      </div>

      {/* Utilities Section */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="h-10 w-full max-w-md bg-neutral-800/50 rounded-lg"></div>
        <div className="h-10 w-40 bg-neutral-800/50 rounded-lg"></div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 flex flex-col min-h-[220px]"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-lg bg-neutral-800"></div>
              <div className="h-6 w-20 bg-neutral-900 rounded-md border border-neutral-800"></div>
            </div>

            <div className="flex flex-col flex-1 mb-6">
              <div className="h-5 w-40 bg-neutral-800 rounded mb-2.5"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-neutral-800/50 rounded"></div>
                <div className="h-3 w-5/6 bg-neutral-800/50 rounded"></div>
              </div>
            </div>

            <div className="h-10 w-full bg-neutral-900 rounded-lg border border-neutral-800"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
