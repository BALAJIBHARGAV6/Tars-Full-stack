/* ========================================================
   MESSAGE INPUT - Instagram-Quality Chat Composition Area
   
   The input area at the bottom of the chat where users type
   and send messages. Features:
   - Working emoji picker (Instagram-style grid)
   - Auto-resizing textarea (grows with content)
   - Send button with keyboard shortcut (Enter)
   - Shift+Enter for new lines
   - Typing indicator integration
   - Premium gradient send button
   ======================================================== */

"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Send, Smile, X } from "lucide-react";
import { useTyping } from "@/hooks/useTyping";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Full emoji grid for the picker
const EMOJI_CATEGORIES = [
  {
    label: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😋", "😛", "😜", "🤪", "😝", "🤗", "🤭", "🤫", "🤔", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷"],
  },
  {
    label: "Gestures",
    emojis: ["👍", "👎", "👊", "✊", "🤛", "🤜", "👏", "🙌", "👐", "🤝", "🙏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤏", "✍️", "💪", "🦾"],
  },
  {
    label: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️"],
  },
  {
    label: "Objects",
    emojis: ["🔥", "⭐", "🌟", "💫", "✨", "💥", "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🎯", "🎮", "🎵", "🎶", "💡", "📌", "📍", "🔑", "💎", "🪄", "🛡️", "⚡", "☀️", "🌈", "🌸", "🍀", "🌺", "🌻"],
  },
];

interface MessageInputProps {
  conversationId: Id<"conversations">;
  currentUserId: string;
}

export default function MessageInput({
  conversationId,
  currentUserId,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useMutation(api.messages.sendMessage);
  const { handleTyping, stopTyping } = useTyping(conversationId, currentUserId);

  // Auto-resize the textarea as user types
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  const handleSend = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || isSending) return;

    setIsSending(true);
    setContent("");
    setShowEmojis(false);
    stopTyping();

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await sendMessage({
        conversationId,
        senderId: currentUserId,
        content: trimmedContent,
      });
    } catch {
      setContent(trimmedContent);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    adjustTextareaHeight();
    handleTyping();
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    textareaRef.current?.focus();
    // Adjust height after emoji insert
    setTimeout(adjustTextareaHeight, 0);
  };

  const hasContent = content.trim().length > 0;

  return (
    <div className="relative border-t border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900">
      {/* Emoji picker panel */}
      {showEmojis && (
        <div className="border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Emojis
            </span>
            <button
              onClick={() => setShowEmojis(false)}
              className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar px-3 pb-3">
            {EMOJI_CATEGORIES.map((cat) => (
              <div key={cat.label} className="mb-2">
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 px-1">
                  {cat.label}
                </p>
                <div className="flex flex-wrap gap-0.5">
                  {cat.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:scale-110 active:scale-95 transition-all duration-100"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 px-3 sm:px-4 py-3">
        {/* Emoji toggle button */}
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
            showEmojis
              ? "text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30"
              : "text-slate-400 dark:text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
          title="Emojis"
        >
          <Smile className="h-5 w-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-300 dark:focus:border-violet-600 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 transition-all duration-200"
          disabled={isSending}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!hasContent || isSending}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
            hasContent
              ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95"
              : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          )}
          title="Send message (Enter)"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="px-4 pb-2 text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
        Press{" "}
        <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px]">
          Enter
        </kbd>{" "}
        to send,{" "}
        <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px]">
          Shift+Enter
        </kbd>{" "}
        for new line
      </p>
    </div>
  );
}
