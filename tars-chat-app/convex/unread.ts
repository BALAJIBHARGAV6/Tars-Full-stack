/* ========================================================
   CONVEX UNREAD - Unread Message Count Management
   
   Tracks how many unread messages each user has in each
   conversation. Counts are incremented when messages arrive
   and reset when the user opens the conversation.
   ======================================================== */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ===== MARK AS READ =====
// Resets the unread count when a user opens a conversation.
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unreadCounts")
      .withIndex("by_conversation_and_user", (q) =>
        q
          .eq("conversationId", args.conversationId)
          .eq("userId", args.userId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        count: 0,
        lastReadAt: Date.now(),
      });
    }
  },
});

// ===== GET UNREAD COUNTS =====
// Returns all unread counts for a specific user across all conversations.
export const getUnreadCounts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const counts = await ctx.db
      .query("unreadCounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return counts;
  },
});

// ===== GET TOTAL UNREAD =====
// Returns the total number of unread messages across all conversations.
// Used for the browser tab title: "(3) Chat App"
export const getTotalUnread = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const counts = await ctx.db
      .query("unreadCounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return counts.reduce((total, c) => total + c.count, 0);
  },
});
