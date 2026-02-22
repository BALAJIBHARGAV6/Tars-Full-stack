/* ========================================================
   LOADING SPINNER - Simple Animated Loading Indicator
   ======================================================== */

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export default function LoadingSpinner({
  className,
  size = 24,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2
        size={size}
        className="animate-spin text-violet-500"
      />
    </div>
  );
}
