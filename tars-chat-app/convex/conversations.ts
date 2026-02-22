/* ========================================================
   CONVEX CONVERSATIONS - Backend Functions for Chat Management
   
   Handles creating conversations, fetching user's chat list,
   and managing group conversations.
   ======================================================== */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ===== CREATE OR GET CONVERSATION =====
// For 1-on-1 chats: checks if a conversation already exists
// between two users. If yes, returns it. If no, creates one.
export const createOrGetConversation = mutation({
  args: {
    currentUserClerkId: v.string(),
    otherUserClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Search all conversations to find existing DM between these two users
    const allConversations = await ctx.db.query("conversations").collect();

    const existing = allConversations.find(
      (conv) =>
        !conv.isGroup &&
        conv.participantIds.length === 2 &&
        conv.participantIds.includes(args.currentUserClerkId) &&
        conv.participantIds.includes(args.otherUserClerkId)
    );

    if (existing) {
      return existing._id;
    }

    // No existing conversation - create a new one
    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      participantIds: [args.currentUserClerkId, args.otherUserClerkId],
      createdBy: args.currentUserClerkId,
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });

    return conversationId;
  },
});

// ===== GET USER'S CONVERSATIONS =====
// Fetches all conversations the current user is part of,
// along with the other user's info and last message.
export const getUserConversations = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Get all conversations
    const allConversations = await ctx.db
      .query("conversations")
      .withIndex("by_last_message")
      .order("desc")
      .collect();

    // Filter to only conversations this user is part of
    const userConversations = allConversations.filter((conv) =>
      conv.participantIds.includes(args.clerkId)
    );

    // Enrich each conversation with user info and last message
    const enriched = await Promise.all(
      userConversations.map(async (conv) => {
        // Get other participants' info
        let otherUser = null;
        if (!conv.isGroup) {
          const otherClerkId = conv.participantIds.find(
            (id) => id !== args.clerkId
          );
          if (otherClerkId) {
            otherUser = await ctx.db
              .query("users")
              .withIndex("by_clerk_id", (q) => q.eq("clerkId", otherClerkId))
              .unique();
          }
        }

        // Get all participants for group chats
        let participants = null;
        if (conv.isGroup) {
          participants = [];
          for (const participantId of conv.participantIds) {
            const user = await ctx.db
              .query("users")
              .withIndex("by_clerk_id", (q) => q.eq("clerkId", participantId))
              .unique();
            if (user) participants.push(user);
          }
        }

        // Get the last message in this conversation
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conv._id)
          )
          .order("desc")
          .first();

        // Get unread count for this user in this conversation
        const unread = await ctx.db
          .query("unreadCounts")
          .withIndex("by_conversation_and_user", (q) =>
            q.eq("conversationId", conv._id).eq("userId", args.clerkId)
          )
          .unique();

        return {
          ...conv,
          otherUser,
          participants,
          lastMessage,
          unreadCount: unread?.count ?? 0,
        };
      })
    );

    return enriched;
  },
});

// ===== GET CONVERSATION BY ID =====
// Fetches a single conversation with all its details.
export const getConversationById = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    // Get all participants' info
    const participants = [];
    for (const clerkId of conversation.participantIds) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();
      if (user) participants.push(user);
    }

    return { ...conversation, participants };
  },
});

// ===== CREATE GROUP CONVERSATION =====
// Creates a new group chat with multiple participants.
export const createGroupConversation = mutation({
  args: {
    name: v.string(),
    participantIds: v.array(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Ensure creator is included in participant list
    const allParticipants = args.participantIds.includes(args.createdBy)
      ? args.participantIds
      : [args.createdBy, ...args.participantIds];

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
      participantIds: allParticipants,
      createdBy: args.createdBy,
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });

    return conversationId;
  },
});
