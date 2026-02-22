/* ========================================================
   REACTION PICKER - Instagram-style Emoji Reaction Selector
   
   Shows a row of emoji buttons that appear on clicking
   the smiley face button on a message.
   Click an emoji to add/remove your reaction.
   ======================================================== */

"use client";

import { REACTION_EMOJIS } from "@/lib/constants";

interface ReactionPickerProps {
  onReact: (emoji: string) => void;
}

export default function ReactionPicker({ onReact }: ReactionPickerProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 px-2 py-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/30 backdrop-blur-sm">
      {REACTION_EMOJIS.map((item) => (
        <button
          key={item.emoji}
          onClick={(e) => {
            e.stopPropagation();
            onReact(item.emoji);
          }}
          className="rounded-full p-1.5 text-base transition-all duration-150 hover:scale-125 hover:bg-violet-50 dark:hover:bg-violet-900/30 active:scale-95"
          title={item.label}
        >
          {item.display}
        </button>
      ))}
    </div>
  );
}
