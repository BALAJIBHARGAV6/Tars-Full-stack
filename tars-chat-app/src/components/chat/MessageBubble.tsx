/* ========================================================
   MESSAGE BUBBLE - Instagram-Quality Chat Message
   
   - Double-tap to ❤️ react
   - Click smiley to open reaction picker
   - Click ANYWHERE outside closes the picker (overlay approach)
   - No tooltip — timestamp always visible
   ======================================================== */

"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Trash2, Copy, SmilePlus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { formatMessageTimestamp } from "@/lib/date-formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactionPicker from "./ReactionPicker";
import ReactionDisplay from "./ReactionDisplay";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessageBubbleProps {
  message: {
    _id: Id<"messages">;
    senderId: string;
    content: string;
    isDeleted: boolean;
    createdAt: number;
    reactions: Array<{
      emoji: string;
      userIds: string[];
    }>;
  };
  isOwn: boolean;
  currentUserId: string;
  showSenderName?: boolean;
  senderName?: string;
}

export default function MessageBubble({
  message,
  isOwn,
  currentUserId,
  showSenderName = false,
  senderName,
}: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTapRef = useRef(0);

  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.messages.toggleReaction);

  const handleDelete = async () => {
    try {
      await deleteMessage({ messageId: message._id, clerkId: currentUserId });
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleReaction = async (emoji: string) => {
    setShowReactions(false);
    try {
      await toggleReaction({
        messageId: message._id,
        emoji,
        clerkId: currentUserId,
      });
    } catch {
      toast.error("Failed to add reaction");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      setShowHeart(true);
      handleReaction("❤️");
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTapRef.current = now;
  };

  if (message.isDeleted) {
    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 py-2.5">
          <p className="text-sm italic text-slate-400 dark:text-slate-500">
            This message was deleted
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* INVISIBLE OVERLAY — clicking anywhere closes the reaction picker */}
      {showReactions && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowReactions(false)}
        />
      )}

      <div className={cn("group flex", isOwn ? "justify-end" : "justify-start")}>
        <div className={cn("relative max-w-[80%] sm:max-w-[70%]", isOwn ? "items-end" : "items-start")}>
          {showSenderName && !isOwn && senderName && (
            <p className="mb-0.5 ml-1 text-xs font-medium text-violet-600 dark:text-violet-400">
              {senderName}
            </p>
          )}

          <div className="relative">
            {/* Message bubble */}
            <div
              onClick={handleDoubleTap}
              className={cn(
                "relative rounded-2xl px-4 py-2.5 cursor-pointer select-none",
                isOwn
                  ? "rounded-br-md bubble-sent text-white"
                  : "rounded-bl-md bubble-received text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60"
              )}
            >
              <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">
                {message.content}
              </p>

              <AnimatePresence>
                {showHeart && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-4xl">❤️</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons — hover only */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                isOwn ? "-left-16" : "-right-16"
              )}
            >
              <button
                onClick={() => setShowReactions(!showReactions)}
                className={cn(
                  "rounded-full p-1.5 transition-colors shadow-sm border",
                  showReactions
                    ? "text-violet-500 bg-violet-50 dark:bg-violet-900/40 border-violet-200 dark:border-violet-700"
                    : "text-slate-400 dark:text-slate-500 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30 bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80"
                )}
              >
                <SmilePlus className="h-3.5 w-3.5" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isOwn ? "end" : "start"} className="w-40">
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy text
                  </DropdownMenuItem>
                  {isOwn && (
                    <DropdownMenuItem
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reaction picker — above message */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "absolute z-40",
                    isOwn ? "right-0 -top-12" : "left-0 -top-12"
                  )}
                >
                  <ReactionPicker onReact={handleReaction} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reactions display */}
          {message.reactions.length > 0 && (
            <div className={cn("mt-1", isOwn ? "flex justify-end" : "flex justify-start")}>
              <ReactionDisplay
                reactions={message.reactions}
                currentUserId={currentUserId}
                onToggle={handleReaction}
              />
            </div>
          )}

          {/* Timestamp */}
          <p
            className={cn(
              "mt-0.5 text-[10px] leading-tight",
              isOwn ? "text-right text-slate-400 dark:text-slate-500" : "text-left text-slate-400 dark:text-slate-500"
            )}
          >
            {formatMessageTimestamp(message.createdAt)}
          </p>
        </div>

        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete message?"
          description="This message will be deleted for everyone. This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
}
