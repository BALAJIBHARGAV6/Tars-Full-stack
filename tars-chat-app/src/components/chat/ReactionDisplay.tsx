/* ========================================================
   REACTION DISPLAY - Shows Emoji Reactions Below a Message
   
   Displays reaction badges with counts. User's own reactions
   are highlighted. Click to toggle your reaction.
   ======================================================== */

"use client";

import { EMOJI_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ReactionDisplayProps {
  reactions: Array<{
    emoji: string;
    userIds: string[];
  }>;
  currentUserId: string;
  onToggle: (emoji: string) => void;
}

export default function ReactionDisplay({
  reactions,
  currentUserId,
  onToggle,
}: ReactionDisplayProps) {
  if (reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {reactions.map((reaction) => {
        const hasReacted = reaction.userIds.includes(currentUserId);
        return (
          <button
            key={reaction.emoji}
            onClick={() => onToggle(reaction.emoji)}
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors",
              hasReacted
                ? "bg-violet-100 border border-violet-200 text-violet-700"
                : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"
            )}
          >
            <span className="text-sm">
              {EMOJI_MAP[reaction.emoji] || reaction.emoji}
            </span>
            <span className="font-medium">{reaction.userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
}
