export default function BillingLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 w-full animate-pulse">
      {/* Header */}
      <div className="mb-10">
        <div className="h-8 w-28 bg-neutral-800 rounded-md mb-2"></div>
        <div className="h-4 w-80 bg-neutral-800/50 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Plans */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="h-6 w-32 bg-neutral-800 rounded mb-4"></div>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl h-48"></div>
          </section>
          <section>
            <div className="bg-neutral-900/20 border border-neutral-800 rounded-xl h-40"></div>
          </section>
        </div>

        {/* Right Column: Payment & History */}
        <div className="space-y-8">
          <section>
            <div className="h-6 w-36 bg-neutral-800 rounded mb-4"></div>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl h-32"></div>
          </section>
          <section>
            <div className="h-6 w-32 bg-neutral-800 rounded mb-4"></div>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-neutral-800 last:border-0 flex justify-between items-center"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 bg-neutral-800 rounded"></div>
                    <div className="space-y-1">
                      <div className="h-3 w-12 bg-neutral-800"></div>
                      <div className="h-2 w-16 bg-neutral-800/50"></div>
                    </div>
                  </div>
                  <div className="h-4 w-10 bg-neutral-800 rounded"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
