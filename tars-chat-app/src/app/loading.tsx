/* ========================================================
   GLOBAL LOADING — Branded pulse splash while app boots
   ======================================================== */

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-5">
        {/* Animated logo */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-emerald-400 opacity-20 blur-lg animate-pulse" />
          {/* Logo box */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-emerald-500 shadow-2xl shadow-violet-500/30">
            {/* Chat bubble icon via CSS */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="h-8 w-8"
            >
              <path d="M4 4h16v12H5.17L4 17.17V4zm0-2a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4z" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
            Tars Chat
          </span>
          {/* Loading dots */}
          <div className="flex items-center gap-1.5 mt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-32 h-0.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
}
