/* ========================================================
   CONVEX TYPING - Typing Indicator Backend Functions
   
   Manages real-time typing indicators. When a user starts
   typing, this stores the status in the database. Other
   users subscribe to this data to show "User is typing..."
   ======================================================== */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ===== SET TYPING STATUS =====
// Called when a user starts or stops typing in a conversation.
export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Look for existing typing record for this user in this conversation
    const existing = await ctx.db
      .query("typingStatus")
      .withIndex("by_user_conversation", (q) =>
        q
          .eq("userId", args.userId)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (existing) {
      // Update the existing record
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
        lastTypingAt: Date.now(),
      });
    } else {
      // Create a new typing status record
      await ctx.db.insert("typingStatus", {
        conversationId: args.conversationId,
        userId: args.userId,
        isTyping: args.isTyping,
        lastTypingAt: Date.now(),
      });
    }
  },
});

// ===== GET TYPING USERS =====
// Returns who is currently typing in a conversation.
// Excludes the current user and only shows recent typing activity.
export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
    currentUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const typingRecords = await ctx.db
      .query("typingStatus")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Filter: only show users who are typing AND typed recently (within 3 seconds)
    const threeSecondsAgo = Date.now() - 3000;
    const activeTypers = typingRecords.filter(
      (record) =>
        record.isTyping &&
        record.userId !== args.currentUserId &&
        record.lastTypingAt > threeSecondsAgo
    );

    // Get user details for each active typer
    const typingUsers = [];
    for (const typer of activeTypers) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", typer.userId))
        .unique();
      if (user) typingUsers.push(user);
    }

    return typingUsers;
  },
});
