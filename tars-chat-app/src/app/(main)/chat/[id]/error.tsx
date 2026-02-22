/* ========================================================
   CHAT ERROR STATE - Shows when the chat page encounters an error
   ======================================================== */

"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="mb-2 font-display text-lg font-semibold text-slate-800">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          {error.message || "Failed to load the conversation. Please try again."}
        </p>
        <Button onClick={reset} className="bg-violet-500 hover:bg-violet-600">
          Try again
        </Button>
      </div>
    </div>
  );
}
