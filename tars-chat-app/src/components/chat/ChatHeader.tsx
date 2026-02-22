/* ========================================================
   CHAT HEADER - Clean Top Bar in Chat View
   
   Shows the other user's avatar, name, and online status.
   For group chats, shows group name and member count.
   Includes a back button on mobile. Clean, no call buttons.
   ======================================================== */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OnlineStatusDot from "@/components/shared/OnlineStatusDot";
import GroupAvatar from "@/components/shared/GroupAvatar";
import MobileBackButton from "@/components/shared/MobileBackButton";
import { formatLastSeen } from "@/lib/date-formatters";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  conversation: {
    isGroup: boolean;
    name?: string;
    participants?: Array<{
      _id: string;
      name: string;
      avatarUrl: string;
      isOnline: boolean;
      lastSeen: number;
    }>;
  };
  currentUserClerkId: string;
}

export default function ChatHeader({
  conversation,
  currentUserClerkId,
}: ChatHeaderProps) {
  // For DMs, find the other user (not the current user)
  const otherUser = !conversation.isGroup
    ? conversation.participants?.find(
      (p) => p._id !== currentUserClerkId
    ) ?? conversation.participants?.[0]
    : null;

  const displayName = conversation.isGroup
    ? conversation.name || "Group Chat"
    : otherUser?.name || "Unknown User";

  // Build status text
  const statusText = conversation.isGroup
    ? `${conversation.participants?.length || 0} members`
    : otherUser?.isOnline
      ? "Online"
      : otherUser
        ? `Last seen ${formatLastSeen(otherUser.lastSeen)}`
        : "";

  const isOnline = !conversation.isGroup && otherUser?.isOnline;

  return (
    <div className="flex items-center gap-3 sm:gap-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 px-3 sm:px-5 py-3 sm:py-4 backdrop-blur-lg">
      {/* Back button - visible only on mobile */}
      <MobileBackButton />

      {/* Avatar with social media story ring for online users */}
      {conversation.isGroup ? (
        <GroupAvatar
          participants={
            conversation.participants?.map((p) => ({
              name: p.name,
              avatarUrl: p.avatarUrl,
            })) || []
          }
          size="md"
        />
      ) : (
        <div className="relative shrink-0">
          <div className={cn(
            "rounded-full p-0.5 transition-all duration-300",
            otherUser?.isOnline
              ? "bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600"
              : ""
          )}>
            <div className={cn(
              "rounded-full",
              otherUser?.isOnline && "bg-white dark:bg-slate-900 p-0.5"
            )}>
              <Avatar className="h-10 w-10 sm:h-11 sm:w-11">
                <AvatarImage src={otherUser?.avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          {otherUser && (
            <OnlineStatusDot
              isOnline={otherUser.isOnline}
              size="sm"
              className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900"
            />
          )}
        </div>
      )}

      {/* Name and status */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-display text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
            {displayName}
          </h2>
          {isOnline && (
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>
        <p
          className={cn(
            "text-[11px] sm:text-xs font-medium truncate",
            isOnline
              ? "text-emerald-500 dark:text-emerald-400"
              : "text-slate-400 dark:text-slate-500"
          )}
        >
          {statusText}
        </p>
      </div>
    </div>
  );
}
