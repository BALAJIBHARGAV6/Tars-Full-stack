/* ========================================================
   CONVEX MESSAGES - Backend Functions for Message Handling
   
   Handles sending, reading, deleting messages, and reactions.
   Messages use real-time subscriptions so all participants
   see new messages instantly.
   ======================================================== */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ===== SEND MESSAGE =====
// Creates a new message in a conversation and updates related data.
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Create the message record
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      isDeleted: false,
      createdAt: Date.now(),
      reactions: [],
    });

    // Update the conversation's lastMessageAt timestamp
    // This keeps the conversation list sorted by most recent activity
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });

    // Increment unread count for all other participants
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation) {
      for (const participantId of conversation.participantIds) {
        // Skip the sender - they don't have unread messages from themselves
        if (participantId === args.senderId) continue;

        // Find or create unread count record for this participant
        const existing = await ctx.db
          .query("unreadCounts")
          .withIndex("by_conversation_and_user", (q) =>
            q
              .eq("conversationId", args.conversationId)
              .eq("userId", participantId)
          )
          .unique();

        if (existing) {
          await ctx.db.patch(existing._id, {
            count: existing.count + 1,
          });
        } else {
          await ctx.db.insert("unreadCounts", {
            conversationId: args.conversationId,
            userId: participantId,
            count: 1,
            lastReadAt: 0,
          });
        }
      }
    }

    // Clear typing status for the sender
    const typingRecord = await ctx.db
      .query("typingStatus")
      .withIndex("by_user_conversation", (q) =>
        q
          .eq("userId", args.senderId)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (typingRecord) {
      await ctx.db.patch(typingRecord._id, {
        isTyping: false,
      });
    }

    return messageId;
  },
});

// ===== GET MESSAGES BY CONVERSATION =====
// Fetches all messages for a conversation, ordered by time.
// This is a query, so it auto-updates when new messages arrive.
export const getMessagesByConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();

    return messages;
  },
});

// ===== DELETE MESSAGE =====
// Soft-deletes a message (marks it as deleted but keeps the record).
// Only the message sender can delete their own messages.
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    // Security check: only the sender can delete their message
    if (message.senderId !== args.clerkId) {
      throw new Error("You can only delete your own messages");
    }

    // Soft delete - mark as deleted instead of removing
    await ctx.db.patch(args.messageId, {
      isDeleted: true,
    });
  },
});

// ===== TOGGLE REACTION =====
// Adds or removes an emoji reaction on a message.
// If the user already reacted with the same emoji, removes it.
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    // Get current reactions array
    const reactions = [...message.reactions];

    // Find existing reaction for this emoji
    const existingIndex = reactions.findIndex((r) => r.emoji === args.emoji);

    if (existingIndex >= 0) {
      const reaction = reactions[existingIndex];
      const userIndex = reaction.userIds.indexOf(args.clerkId);

      if (userIndex >= 0) {
        // User already reacted with this emoji - remove their reaction
        reaction.userIds.splice(userIndex, 1);
        if (reaction.userIds.length === 0) {
          // No more users with this emoji - remove the whole reaction
          reactions.splice(existingIndex, 1);
        }
      } else {
        // User hasn't reacted with this emoji yet - add them
        reaction.userIds.push(args.clerkId);
      }
    } else {
      // This emoji hasn't been used yet - create new reaction
      reactions.push({
        emoji: args.emoji,
        userIds: [args.clerkId],
      });
    }

    // Update the message with new reactions
    await ctx.db.patch(args.messageId, { reactions });
  },
});
