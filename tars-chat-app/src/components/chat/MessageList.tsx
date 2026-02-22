/* ========================================================
   MESSAGE LIST - Smooth Scrollable Chat Messages
   
   Displays all messages in a conversation with:
   - Date separators between different days
   - Different styles for sent vs received messages
   - Auto-scrolling when new messages arrive
   - "New messages" button when scrolled up
   - Typing indicator at the bottom
   - Sender names in group chats
   - GPU-accelerated smooth scrolling
   ======================================================== */

"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Inbox } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "@/components/shared/EmptyState";
import { MessageListSkeleton } from "@/components/conversations/ConversationListSkeleton";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { formatDateSeparator } from "@/lib/date-formatters";
import { isSameDay } from "date-fns";

interface MessageListProps {
  conversationId: Id<"conversations">;
  currentUserId: string;
  isGroup: boolean;
  participants?: Array<{
    _id: string;
    clerkId: string;
    name: string;
    avatarUrl: string;
  }>;
}

export default function MessageList({
  conversationId,
  currentUserId,
  isGroup,
  participants,
}: MessageListProps) {
  // Subscribe to messages - auto-updates in real-time
  const messages = useQuery(api.messages.getMessagesByConversation, {
    conversationId,
  });

  // Subscribe to typing status for this conversation
  const typingUsers = useQuery(api.typing.getTypingUsers, {
    conversationId,
    currentUserId,
  });

  // Smart auto-scroll behavior
  const { scrollRef, showScrollButton, scrollToBottom } = useAutoScroll(
    messages?.length ?? 0
  );

  // Loading state
  if (messages === undefined) {
    return <MessageListSkeleton />;
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={Inbox}
          title="No messages yet"
          description="Send a message to start the conversation!"
        />
      </div>
    );
  }

  // Helper to find sender name for group messages
  const getSenderName = (senderId: string) => {
    return participants?.find((p) => p.clerkId === senderId)?.name || "Unknown";
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Scrollable message container with smooth scrolling */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-5 py-4"
      >
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {messages.map((message, index) => {
            // Show date separator when the day changes
            const showDateSeparator =
              index === 0 ||
              !isSameDay(
                new Date(message.createdAt),
                new Date(messages[index - 1].createdAt)
              );

            return (
              <div key={message._id}>
                {/* Date separator */}
                {showDateSeparator && (
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-700/60" />
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {formatDateSeparator(message.createdAt)}
                    </span>
                    <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-700/60" />
                  </div>
                )}

                {/* Message bubble */}
                <MessageBubble
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  currentUserId={currentUserId}
                  showSenderName={isGroup}
                  senderName={
                    isGroup ? getSenderName(message.senderId) : undefined
                  }
                />
              </div>
            );
          })}
        </div>

        {/* Typing indicator */}
        <TypingIndicator typingUsers={typingUsers ?? []} />
      </div>

      {/* "Scroll to new messages" floating button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-colors hover:bg-violet-600"
          >
            <ArrowDown className="h-4 w-4" />
            New messages
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
