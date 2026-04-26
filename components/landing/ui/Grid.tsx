export default function Grid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top line - Fixed under Navbar */}
      <div className="absolute top-20 left-0 w-full h-px border-t border-neutral-700/30"></div>

      <div className="absolute left-1/2 top-0 h-full w-full max-w-300 -translate-x-1/2">
        {/* Left line */}
        <div className="absolute left-0 w-px h-full border-l border-neutral-700/30"></div>
        {/* Right line */}
        <div className="absolute right-0 w-px h-full border-r border-neutral-700/30"></div>
      </div>
    </div>
  );
}
