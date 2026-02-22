/* ========================================================
   CONVERSATION LIST SKELETON - Loading State for Sidebar
   ======================================================== */

import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/shared/SkeletonLoader";

export default function ConversationListSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg p-3">
          <SkeletonCircle className="h-11 w-11 shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonText className="h-4 w-3/4" />
            <SkeletonText className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ========================================================
   MESSAGE LIST SKELETON - Loading State for Chat Messages
   ======================================================== */

export function MessageListSkeleton() {
  const widths = ["w-48", "w-64", "w-40", "w-72", "w-56", "w-44", "w-60", "w-52"];
  const alignments = ["self-end", "self-start", "self-end", "self-start", "self-end", "self-start", "self-end", "self-start"];

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {widths.map((width, i) => (
        <Skeleton
          key={i}
          className={`h-10 rounded-2xl ${width} ${alignments[i]}`}
        />
      ))}
    </div>
  );
}
