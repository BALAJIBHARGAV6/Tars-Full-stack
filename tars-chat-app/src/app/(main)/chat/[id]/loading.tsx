/* ========================================================
   CHAT LOADING — Messaging skeleton that mimics real bubbles
   ======================================================== */

export default function ChatLoading() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header skeleton */}
      <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-4">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 w-32 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-2.5 w-20 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>

      {/* Message bubbles skeleton */}
      <div className="flex flex-1 flex-col gap-4 px-4 sm:px-6 py-5 overflow-hidden">

        {/* Received bubble — left */}
        <div className="flex items-end gap-2 max-w-[75%] sm:max-w-[60%]">
          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="h-10 w-48 sm:w-64 rounded-2xl rounded-bl-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-2 w-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse ml-1" />
          </div>
        </div>

        {/* Sent bubble — right */}
        <div className="flex items-end gap-2 max-w-[75%] sm:max-w-[60%] self-end flex-row-reverse">
          <div className="flex flex-col gap-1 items-end">
            <div className="h-10 w-56 sm:w-72 rounded-2xl rounded-br-md bg-violet-200 dark:bg-violet-900/50 animate-pulse" />
            <div className="h-2 w-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse mr-1" />
          </div>
        </div>

        {/* Received bubble — left, short */}
        <div className="flex items-end gap-2 max-w-[55%] sm:max-w-[45%]">
          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="h-10 w-36 sm:w-48 rounded-2xl rounded-bl-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-2 w-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse ml-1" />
          </div>
        </div>

        {/* Sent bubble — right, long */}
        <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[65%] self-end flex-row-reverse">
          <div className="flex flex-col gap-1 items-end">
            <div className="h-16 w-64 sm:w-80 rounded-2xl rounded-br-md bg-violet-200 dark:bg-violet-900/50 animate-pulse" />
            <div className="h-2 w-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse mr-1" />
          </div>
        </div>

        {/* Received bubble — left, medium */}
        <div className="flex items-end gap-2 max-w-[65%] sm:max-w-[50%]">
          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="h-14 w-44 sm:w-56 rounded-2xl rounded-bl-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-2 w-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse ml-1" />
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex items-end gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
          <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-slate-200 dark:bg-slate-700 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>

      {/* Input bar skeleton */}
      <div className="border-t border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/40 px-4 py-3">
          <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse shrink-0" />
          <div className="flex-1 h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse shrink-0" />
          <div className="h-8 w-8 rounded-xl bg-violet-200 dark:bg-violet-900/50 animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );
}
