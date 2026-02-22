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
      className="group social-card flex w-full items-center gap-3 sm:gap-4 rounded-2xl border border-slate-100/80 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/70 p-4 sm:p-5 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/8 dark:hover:shadow-violet-500/5 hover:border-violet-200/60 dark:hover:border-violet-700/50 hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* Avatar with social media story-ring for online users */}
      <div className="relative shrink-0">
        <div className={cn(
          "rounded-full p-0.5 transition-all duration-300",
          user.isOnline
            ? "bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 group-hover:shadow-md group-hover:shadow-pink-500/20"
            : "bg-slate-200 dark:bg-slate-700"
        )}>
          <div className="rounded-full bg-white dark:bg-slate-900 p-0.5">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 font-semibold text-violet-700 dark:text-violet-300">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <OnlineStatusDot
          isOnline={user.isOnline}
          size="sm"
          className="absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900"
        />
      </div>

      {/* User info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{user.name}</p>
          {user.isOnline && (
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>
        <p className="truncate text-xs sm:text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
      </div>

      {/* Status badge + message icon */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "shrink-0 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold transition-all",
            user.isOnline
              ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm"
              : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
          )}
        >
          {user.isOnline ? "Active" : "Offline"}
        </span>
        <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-500 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:shadow-sm">
          <MessageCircle className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}
