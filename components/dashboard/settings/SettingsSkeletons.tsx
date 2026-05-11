"use client";

export function ProfileTabSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800">
          <div className="h-5 w-32 bg-neutral-800 rounded mb-2"></div>
          <div className="h-3 w-48 bg-neutral-800/50 rounded"></div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-neutral-800 shrink-0"></div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-8 w-32 bg-neutral-800 rounded"></div>
                <div className="h-8 w-20 bg-neutral-800/50 rounded"></div>
              </div>
              <div className="h-3 w-40 bg-neutral-800/50 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-3 w-20 bg-neutral-800 rounded mb-2"></div>
              <div className="h-10 w-full bg-neutral-900/50 border border-neutral-800 rounded-md"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-neutral-800 rounded mb-2"></div>
              <div className="h-10 w-full bg-neutral-900/50 border border-neutral-800 rounded-md"></div>
              <div className="h-3 w-40 bg-neutral-800/50 rounded mt-2"></div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-neutral-900/30 border-t border-neutral-800 flex justify-end">
          <div className="h-9 w-32 bg-neutral-800 rounded-md"></div>
        </div>
      </div>

      <div className="bg-transparent border border-neutral-800 rounded-xl overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
        <div>
          <div className="h-5 w-32 bg-neutral-800 rounded mb-2"></div>
          <div className="h-3 w-64 max-w-full bg-neutral-800/50 rounded"></div>
        </div>
        <div className="h-9 w-24 bg-neutral-800/50 rounded-md shrink-0 border border-neutral-800"></div>
      </div>
    </div>
  );
}

export function NotificationsTabSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800">
          <div className="h-5 w-40 bg-neutral-800 rounded mb-2"></div>
          <div className="h-3 w-56 bg-neutral-800/50 rounded"></div>
        </div>
        <div className="p-6 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="h-4 w-40 bg-neutral-800 rounded mb-2"></div>
                  <div className="h-3 w-64 max-w-full bg-neutral-800/50 rounded"></div>
                </div>
                <div className="w-9 h-5 bg-neutral-800 rounded-full shrink-0"></div>
              </div>
              {i === 0 && (
                <div className="h-px w-full bg-neutral-800 mt-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="h-5 w-32 bg-neutral-800 rounded mb-2"></div>
            <div className="h-3 w-56 max-w-full bg-neutral-800/50 rounded"></div>
          </div>
          <div className="h-4 w-24 bg-neutral-800/50 rounded"></div>
        </div>
        <div className="divide-y divide-neutral-800/50">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-800 shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="flex justify-between items-center gap-4">
                  <div className="h-4 w-48 bg-neutral-800 rounded"></div>
                  <div className="h-3 w-16 bg-neutral-800/50 rounded"></div>
                </div>
                <div className="h-3 w-3/4 bg-neutral-800/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HelpTabSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-neutral-800 rounded-full mb-5"></div>
        <div className="h-6 w-48 bg-neutral-800 rounded mb-3"></div>
        <div className="h-4 w-72 max-w-full bg-neutral-800/50 rounded mb-8"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-5 border border-neutral-800 rounded-xl"
            >
              <div className="w-5 h-5 bg-neutral-800 rounded mb-3"></div>
              <div className="h-4 w-24 bg-neutral-800 rounded mb-2"></div>
              <div className="h-3 w-32 bg-neutral-800/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
