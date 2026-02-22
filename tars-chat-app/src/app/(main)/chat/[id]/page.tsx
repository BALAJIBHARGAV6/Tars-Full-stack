/* ========================================================
   CHAT PAGE - Individual Conversation View
   
   Dynamic route: /chat/[id] where [id] is the conversation ID.
   Shows the chat header, message list, and message input.
   
   Also handles:
   - Marking messages as read when conversation is opened
   - Loading and error states
   ======================================================== */

"use client";

import { useEffect, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useUser();
  const conversationId = id as Id<"conversations">;

  // Fetch conversation details including participants
  const conversation = useQuery(api.conversations.getConversationById, {
    conversationId,
  });

  // Mutation to mark messages as read
  const markAsRead = useMutation(api.unread.markAsRead);

  // Mark messages as read when entering the conversation
  useEffect(() => {
    if (user && conversationId) {
      markAsRead({ conversationId, userId: user.id });
    }
  }, [user, conversationId, markAsRead]);

  // Also mark as read when window gains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user && conversationId) {
        markAsRead({ conversationId, userId: user.id });
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, conversationId, markAsRead]);

  // Loading state
  if (conversation === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  // Conversation not found
  if (conversation === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-lg font-semibold text-slate-800">
            Conversation not found
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            This conversation may have been deleted.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      {/* Chat header with user/group info */}
      <ChatHeader
        conversation={{
          isGroup: conversation.isGroup,
          name: conversation.name,
          participants: conversation.participants?.map((p) => ({
            ...p,
            _id: p.clerkId,
          })),
        }}
        currentUserClerkId={user?.id || ""}
      />

      {/* Message list with auto-scroll and typing indicators */}
      <MessageList
        conversationId={conversationId}
        currentUserId={user?.id || ""}
        isGroup={conversation.isGroup}
        participants={conversation.participants?.map((p) => ({
          ...p,
          _id: p._id as unknown as string,
        }))}
      />

      {/* Message input area */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={user?.id || ""}
      />
    </motion.div>
  );
}
