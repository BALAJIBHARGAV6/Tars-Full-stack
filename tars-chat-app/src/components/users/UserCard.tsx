/* ========================================================
   USER CARD - Individual User Display Card (Instagram-Vibe)
   
   Shows a user's avatar, name, email, and online status.
   Clicking it creates/opens a conversation with that user.
   Features premium hover effects and social-media styling.
   ======================================================== */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OnlineStatusDot from "@/components/shared/OnlineStatusDot";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface UserCardProps {
  user: {
    clerkId: string;
    name: string;
    email: string;
    avatarUrl: string;
    isOnline: boolean;
  };
}

export default function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const createOrGetConversation = useMutation(
    api.conversations.createOrGetConversation
  );

  // Handle click: create or open a conversation with this user
  const handleClick = async () => {
    if (!currentUser) return;

    try {
      const conversationId = await createOrGetConversation({
        currentUserClerkId: currentUser.id,
        otherUserClerkId: user.clerkId,
      });
      // Navigate to the conversation page
      router.push(`/chat/${conversationId}`);
    } catch {
      toast.error("Failed to start conversation");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-left transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-violet-300 dark:hover:border-violet-600 active:scale-[0.99]"
    >
      {/* Avatar with ring for online users */}
      <div className="relative shrink-0">
        <div className={cn(
          "rounded-full p-0.5",
          user.isOnline
            ? "bg-gradient-to-tr from-emerald-400 to-green-500"
            : "bg-slate-300 dark:bg-slate-600"
        )}>
          <div className="rounded-full bg-white dark:bg-slate-900 p-0.5">
            <Avatar className="h-11 w-11">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-violet-100 dark:bg-violet-900/50 font-semibold text-violet-600 dark:text-violet-300">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <OnlineStatusDot
          isOnline={user.isOnline}
          size="sm"
          className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-800"
        />
      </div>

      {/* User info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {user.email}
        </p>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            user.isOnline
              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
              : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
          )}
        >
          {user.isOnline ? "Online" : "Offline"}
        </span>
        <MessageCircle className="h-4 w-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}
