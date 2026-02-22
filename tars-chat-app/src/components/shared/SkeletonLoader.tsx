/* ========================================================
   SKELETON LOADER - Animated Loading Placeholder
   
   Shows pulsing gray shapes while data is loading.
   This prevents layout shift and gives users feedback
   that content is on its way.
   ======================================================== */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("shimmer rounded-md", className)} />
  );
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return (
    <div className={cn("shimmer rounded-full", className)} />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return (
    <div className={cn("shimmer h-4 rounded", className)} />
  );
}
