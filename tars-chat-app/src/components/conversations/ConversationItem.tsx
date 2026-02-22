/* ========================================================
   CONVERSATION ITEM - Premium Sidebar Chat Row
   
   Shows: avatar with story ring, name, last message preview,
   time, unread badge with gradient. Active conversation gets
   a violet highlight with subtle glow.
   ======================================================== */

"use client";

import { useRouter, useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OnlineStatusDot from "@/components/shared/OnlineStatusDot";
import GroupAvatar from "@/components/shared/GroupAvatar";
import { formatMessageTimestamp } from "@/lib/date-formatters";
import { MESSAGE_PREVIEW_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store";

interface ConversationItemProps {
  conversation: {
    _id: string;
    isGroup: boolean;
    name?: string;
    lastMessage?: {
      content: string;
      createdAt: number;
      isDeleted: boolean;
    } | null;
    otherUser?: {
      name: string;
      avatarUrl: string;
      isOnline: boolean;
    } | null;
    participants?: Array<{
      name: string;
      avatarUrl: string;
    }> | null;
    unreadCount: number;
    lastMessageAt: number;
  };
}

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  const router = useRouter();
  const params = useParams();
  const closeSidebar = useSidebarStore((s) => s.close);

  // Check if this conversation is currently active/selected
  const isActive = params?.id === conversation._id;

  // Determine display name
  const displayName = conversation.isGroup
    ? conversation.name || "Group Chat"
    : conversation.otherUser?.name || "Unknown User";

  // Format the last message preview
  const lastMessagePreview = conversation.lastMessage
    ? conversation.lastMessage.isDeleted
      ? "Message deleted"
      : conversation.lastMessage.content.length > MESSAGE_PREVIEW_LENGTH
        ? conversation.lastMessage.content.substring(0, MESSAGE_PREVIEW_LENGTH) + "..."
        : conversation.lastMessage.content
    : "No messages yet";

  const handleClick = () => {
    router.push(`/chat/${conversation._id}`);
    closeSidebar(); // Close sidebar on mobile after selecting
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-violet-50 via-purple-50/80 to-violet-50 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-violet-900/30 border border-violet-200/60 dark:border-violet-700/50 shadow-sm shadow-violet-500/5"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/40"
      )}
    >
      {/* Avatar section with social media style */}
      <div className="relative shrink-0">
        {conversation.isGroup ? (
          <GroupAvatar
            participants={conversation.participants || []}
            size="md"
          />
        ) : (
          <>
            {/* Instagram-style gradient ring for online users */}
            <div className={cn(
              "rounded-full p-0.5 transition-all duration-300",
              conversation.otherUser?.isOnline
                ? "bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600"
                : ""
            )}>
              <div className={cn(
                "rounded-full",
                conversation.otherUser?.isOnline && "bg-white dark:bg-slate-900 p-0.5"
              )}>
                <Avatar className={cn(
                  "h-11 w-11 transition-all duration-200",
                  isActive && "ring-2 ring-violet-300 dark:ring-violet-600 shadow-sm"
                )}>
                  <AvatarImage
                    src={conversation.otherUser?.avatarUrl}
                    alt={displayName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            {conversation.otherUser && (
              <OnlineStatusDot
                isOnline={conversation.otherUser.isOnline}
                size="sm"
                className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900"
              />
            )}
          </>
        )}
      </div>

      {/* Content section */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              conversation.unreadCount > 0
                ? "font-bold text-slate-900 dark:text-white"
                : isActive
                  ? "font-semibold text-violet-700 dark:text-violet-300"
                  : "font-medium text-slate-700 dark:text-slate-300"
            )}
          >
            {displayName}
          </p>
          {/* Timestamp */}
          {conversation.lastMessage && (
            <span className={cn(
              "shrink-0 text-[10px] font-medium",
              conversation.unreadCount > 0
                ? "text-violet-500 dark:text-violet-400"
                : "text-slate-400 dark:text-slate-500"
            )}>
              {formatMessageTimestamp(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={cn(
              "truncate text-xs leading-relaxed",
              conversation.unreadCount > 0
                ? "font-semibold text-slate-700 dark:text-slate-300"
                : "text-slate-400 dark:text-slate-500"
            )}
          >
            {lastMessagePreview}
          </p>
          {/* Unread badge with gradient */}
          {conversation.unreadCount > 0 && (
            <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-violet-500/30 animate-in fade-in zoom-in">
              {conversation.unreadCount > 99
                ? "99+"
                : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
