/* ========================================================
   CONVERSATION LIST - Premium Sidebar Chat List
   
   Displays all conversations the current user is part of,
   sorted by most recent message. Includes a button to create
   new group chats and a search filter.
   ======================================================== */

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, Plus, Search, Users } from "lucide-react";
import ConversationItem from "./ConversationItem";
import ConversationListSkeleton from "./ConversationListSkeleton";
import CreateGroupModal from "./CreateGroupModal";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function ConversationList() {
  const { user } = useUser();
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all conversations for the current user
  // This query auto-updates in real-time via Convex subscriptions
  const conversations = useQuery(
    api.conversations.getUserConversations,
    user ? { clerkId: user.id } : "skip"
  );

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    if (!searchQuery) return conversations;
    return conversations.filter((conv) => {
      const name = conv.isGroup
        ? conv.name || "Group Chat"
        : conv.otherUser?.name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery]);

  // Show skeleton while loading
  if (conversations === undefined) {
    return <ConversationListSkeleton />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header with title, count and new group button */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-base font-bold text-slate-800 dark:text-slate-100">
            Messages
          </h2>
          {conversations.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 px-1.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
              {conversations.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGroupModal(true)}
            className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-xl"
            title="Create group chat"
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGroupModal(true)}
            className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-xl"
            title="New message"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {conversations.length > 0 && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 pl-9 pr-3 py-2 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-300 dark:focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/10 dark:focus:ring-violet-500/20 transition-all"
            />
          </div>
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-1">
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Start chatting by selecting a user from the home page"
            action={{ label: "Find Users", href: "/" }}
          />
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
              No results for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredConversations.map((conv) => (
              <ConversationItem
                key={conv._id}
                conversation={{
                  ...conv,
                  _id: conv._id as string,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create group modal */}
      <CreateGroupModal
        open={showGroupModal}
        onOpenChange={setShowGroupModal}
      />
    </div>
  );
}
