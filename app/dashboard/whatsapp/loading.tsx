export default function WhatsAppLoading() {
  return (
    <div className="max-w-6xl mx-auto p-8 md:p-10 w-full animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-56 bg-neutral-800 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-neutral-800/50 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-800 rounded-md shrink-0"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Flow List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-24 bg-neutral-800 rounded"></div>
            <div className="h-6 w-6 bg-neutral-800 rounded"></div>
          </div>
          <div className="flex flex-col gap-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-900/30 border border-neutral-800 rounded-xl h-32"
              ></div>
            ))}
          </div>
          <div className="mt-6 bg-neutral-900/30 border border-dashed border-neutral-800 rounded-xl h-40"></div>
        </div>

        {/* Chat Simulator */}
        <div className="lg:col-span-2 h-[520px] bg-neutral-900/30 border border-neutral-800 rounded-xl flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800"></div>
              <div>
                <div className="h-4 w-32 bg-neutral-800 rounded mb-1"></div>
                <div className="h-3 w-16 bg-neutral-800/50 rounded"></div>
              </div>
            </div>
            <div className="h-8 w-24 bg-neutral-800 rounded"></div>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-4">
            <div className="h-10 w-3/4 max-w-sm bg-neutral-800 rounded-2xl rounded-tl-sm"></div>
            <div className="h-10 w-1/2 max-w-sm bg-neutral-800/50 rounded-2xl rounded-tr-sm ml-auto"></div>
            <div className="h-12 w-2/3 max-w-sm bg-neutral-800 rounded-2xl rounded-tl-sm"></div>
          </div>
          <div className="p-4 border-t border-neutral-800">
            <div className="h-12 w-full max-w-lg mx-auto bg-neutral-800 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
