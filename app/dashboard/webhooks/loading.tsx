export default function ApiWebhooksLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 w-full animate-pulse">
      <div className="mb-10">
        <div className="h-8 w-48 bg-neutral-800 rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-neutral-800/50 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col: API Keys & Integration */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="h-6 w-32 bg-neutral-800 rounded mb-4"></div>
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl h-32"></div>
          </div>
          <div>
            <div className="h-6 w-40 bg-neutral-800 rounded mb-4"></div>
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl h-48"></div>
          </div>
        </div>

        {/* Right Col: Webhooks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-28 bg-neutral-800 rounded"></div>
            <div className="h-8 w-16 bg-neutral-800 rounded"></div>
          </div>
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-900/30 border border-neutral-800 rounded-xl h-24"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
