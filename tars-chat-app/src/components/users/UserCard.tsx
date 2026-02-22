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
      className="group social-card flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800/90 p-4 text-left shadow-sm transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5 hover:border-violet-300 dark:hover:border-violet-600/50 hover:-translate-y-1 active:scale-[0.99]"
    >
      {/* Avatar with social media story-ring for online users */}
      <div className="relative shrink-0">
        <div className={cn(
          "rounded-full p-0.5 transition-all duration-300",
          user.isOnline
            ? "bg-gradient-to-tr from-emerald-400 via-green-500 to-emerald-600 group-hover:shadow-md group-hover:shadow-emerald-500/20"
            : "bg-slate-300 dark:bg-slate-600"
        )}>
          <div className="rounded-full bg-white dark:bg-slate-900 p-0.5">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/60 dark:to-purple-900/60 font-bold text-violet-600 dark:text-violet-300 text-base">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <OnlineStatusDot
          isOnline={user.isOnline}
          size="sm"
          className="absolute -bottom-0.5 -right-0.5 ring-[3px] ring-white dark:ring-slate-800"
        />
      </div>

      {/* User info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {user.name}
        </p>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {user.email}
        </p>
      </div>

      {/* Status badge + message icon */}
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
            user.isOnline
              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50"
              : "bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600/50"
          )}
        >
          {user.isOnline ? "Online" : "Offline"}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:shadow-sm">
          <MessageCircle className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
}
