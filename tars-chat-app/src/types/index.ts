/* ========================================================
   TARS CHAT APP - Type Definitions
   
   This file contains all TypeScript interfaces and types
   used across the application. Having types in a central
   file makes the code more maintainable and self-documenting.
   ======================================================== */

import { Id } from "../../convex/_generated/dataModel";

// ===== USER TYPES =====
// Represents a user stored in Convex database
export interface User {
  _id: Id<"users">;
  _creationTime: number;
  clerkId: string;       // Unique ID from Clerk auth
  name: string;          // Full display name
  email: string;         // Email address
  avatarUrl: string;     // Profile picture URL
  isOnline: boolean;     // Whether user is currently active
  lastSeen: number;      // Unix timestamp of last activity
  createdAt: number;     // Unix timestamp of account creation
}

// ===== CONVERSATION TYPES =====
// Represents a chat conversation (1-on-1 or group)
export interface Conversation {
  _id: Id<"conversations">;
  _creationTime: number;
  isGroup: boolean;                // true = group chat, false = DM
  name?: string;                   // Group name (only for group chats)
  participantIds: string[];        // Array of Clerk user IDs
  createdBy: string;               // Clerk ID of conversation creator
  lastMessageAt: number;           // Timestamp of most recent message
  createdAt: number;               // When conversation was created
}

// Extended conversation with additional display data
export interface ConversationWithDetails extends Conversation {
  otherUser?: User;                // For DMs: the other participant
  lastMessage?: Message;           // Most recent message in the conversation
  unreadCount: number;             // Number of unread messages
  participants?: User[];           // For groups: all participants
}

// ===== MESSAGE TYPES =====
// A single emoji reaction on a message
export interface Reaction {
  emoji: string;                   // The emoji character (e.g., "thumbsUp")
  userIds: string[];               // Clerk IDs of users who reacted
}

// Represents a chat message
export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  conversationId: Id<"conversations">;
  senderId: string;                // Clerk ID of sender
  content: string;                 // Message text content
  isDeleted: boolean;              // Soft delete flag
  createdAt: number;               // When message was sent
  reactions: Reaction[];           // Emoji reactions on this message
}

// ===== TYPING STATUS =====
export interface TypingStatus {
  _id: Id<"typingStatus">;
  conversationId: Id<"conversations">;
  userId: string;
  isTyping: boolean;
  lastTypingAt: number;
}

// ===== UNREAD COUNT =====
export interface UnreadCount {
  _id: Id<"unreadCounts">;
  conversationId: Id<"conversations">;
  userId: string;
  count: number;
  lastReadAt: number;
}

// ===== COMPONENT PROP TYPES =====
export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}
