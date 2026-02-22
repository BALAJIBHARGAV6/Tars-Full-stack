/* ========================================================
   CONVEX SCHEMA - Database Table Definitions
   
   This file defines the structure of all tables in our
   Convex database. Think of it like a SQL schema but for
   a NoSQL real-time database.
   
   Key Concepts:
   - defineTable: Creates a new table with typed fields
   - v.string(), v.number(), etc.: Type validators
   - .index(): Creates database indexes for fast queries
   ======================================================== */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ===== USERS TABLE =====
  // Stores user profiles synced from Clerk authentication
  users: defineTable({
    clerkId: v.string(),       // Unique ID from Clerk (links auth to our DB)
    name: v.string(),          // User's display name
    email: v.string(),         // User's email address
    avatarUrl: v.string(),     // URL to profile picture
    isOnline: v.boolean(),     // Whether user is currently active
    lastSeen: v.number(),      // Unix timestamp of last activity
    createdAt: v.number(),     // When user account was created
  })
    // Indexes make queries faster by pre-sorting data
    .index("by_clerk_id", ["clerkId"])   // Look up users by Clerk ID
    .index("by_online", ["isOnline"]),   // Filter online/offline users

  // ===== CONVERSATIONS TABLE =====
  // Stores chat conversations (both 1-on-1 and group chats)
  conversations: defineTable({
    isGroup: v.boolean(),                      // true = group, false = DM
    name: v.optional(v.string()),              // Group name (optional, only for groups)
    participantIds: v.array(v.string()),       // Array of Clerk user IDs in this chat
    createdBy: v.string(),                     // Clerk ID of who created the conversation
    lastMessageAt: v.number(),                 // Timestamp of most recent message
    createdAt: v.number(),                     // When conversation was created
  })
    .index("by_last_message", ["lastMessageAt"]),  // Sort conversations by recent activity

  // ===== MESSAGES TABLE =====
  // Stores all chat messages across all conversations
  messages: defineTable({
    conversationId: v.id("conversations"),  // Which conversation this message belongs to
    senderId: v.string(),                   // Clerk ID of the sender
    content: v.string(),                    // The message text content
    isDeleted: v.boolean(),                 // Soft delete flag (message hidden but not removed)
    createdAt: v.number(),                  // When message was sent
    reactions: v.array(                     // Emoji reactions on this message
      v.object({
        emoji: v.string(),                  // Emoji identifier (e.g., "thumbsUp")
        userIds: v.array(v.string()),       // Who reacted with this emoji
      })
    ),
  })
    .index("by_conversation", ["conversationId"])   // Get all messages in a conversation
    .index("by_created_at", ["createdAt"]),          // Sort messages by time

  // ===== TYPING STATUS TABLE =====
  // Tracks who is currently typing in which conversation
  typingStatus: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),           // Clerk ID of the typing user
    isTyping: v.boolean(),        // Whether they're currently typing
    lastTypingAt: v.number(),     // Timestamp of last typing activity
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user_conversation", ["userId", "conversationId"]),

  // ===== UNREAD COUNTS TABLE =====
  // Tracks unread message counts per user per conversation
  unreadCounts: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),           // The user who hasn't read messages
    count: v.number(),            // Number of unread messages
    lastReadAt: v.number(),       // Timestamp when user last read this conversation
  })
    .index("by_conversation_and_user", ["conversationId", "userId"])
    .index("by_user", ["userId"]),
});
