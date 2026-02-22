/* ========================================================
   ONLINE STATUS DOT - Animated Online Indicator
   
   A small circle that shows whether a user is online (green
   with pulsing animation) or offline (gray).
   ======================================================== */

"use client";

import { cn } from "@/lib/utils";

interface OnlineStatusDotProps {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export default function OnlineStatusDot({
  isOnline,
  size = "md",
  className,
}: OnlineStatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border-2 border-white",
        sizeMap[size],
        isOnline
          ? "bg-emerald-400 online-glow animate-pulse-dot"
          : "bg-slate-300",
        className
      )}
      aria-label={isOnline ? "Online" : "Offline"}
    />
  );
}
