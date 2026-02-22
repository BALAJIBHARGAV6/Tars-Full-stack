/* ========================================================
   CONVEX USERS - Backend Functions for User Management
   
   These functions handle creating, reading, and updating
   user data in the Convex database.
   
   Key Concepts:
   - query: Read data (automatically re-runs when data changes)
   - mutation: Write/modify data
   - ctx.db: Access the database
   - ctx.auth: Access authenticated user info
   ======================================================== */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ===== CREATE OR UPDATE USER =====
// Called when a user signs up or logs in via Clerk.
// If the user already exists, updates their info.
// If new, creates a fresh user record.
export const createOrUpdateUser = mutation({
  // Define the arguments this function accepts
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.string(),
  },
  // The handler function that runs on the server
  handler: async (ctx, args) => {
    // Check if this user already exists in our database
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      // User exists - update their profile info
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        avatarUrl: args.avatarUrl,
      });
      return existingUser._id;
    }

    // New user - create a fresh record
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      avatarUrl: args.avatarUrl,
      isOnline: true,
      lastSeen: Date.now(),
      createdAt: Date.now(),
    });

    return userId;
  },
});

// ===== GET ALL USERS =====
// Returns all registered users. Used for the user list page.
// In Convex, queries automatically update in real-time.
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    // Fetch all users from the database
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// ===== GET USER BY CLERK ID =====
// Looks up a specific user by their Clerk authentication ID.
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    return user;
  },
});

// ===== GET USER BY ID =====
// Looks up a user by their Convex document ID.
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// ===== GET MULTIPLE USERS BY CLERK IDs =====
// Fetches multiple users at once. Used for group chats.
export const getUsersByClerkIds = query({
  args: { clerkIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const users = [];
    for (const clerkId of args.clerkIds) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .unique();
      if (user) users.push(user);
    }
    return users;
  },
});

// ===== UPDATE ONLINE STATUS =====
// Sets a user as online or offline. Called by the presence system.
export const updateOnlineStatus = mutation({
  args: {
    clerkId: v.string(),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        isOnline: args.isOnline,
        lastSeen: Date.now(),
      });
    }
  },
});

// ===== UPDATE LAST SEEN =====
// Updates the user's last activity timestamp. Used for presence tracking.
export const updateLastSeen = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        isOnline: true,
        lastSeen: Date.now(),
      });
    }
  },
});

// ===== MARK USERS OFFLINE =====
// Called periodically to set users as offline if they haven't
// been seen for more than 60 seconds. Used by the presence system.
export const markInactiveUsersOffline = mutation({
  args: {},
  handler: async (ctx) => {
    const oneMinuteAgo = Date.now() - 60000;
    const onlineUsers = await ctx.db
      .query("users")
      .withIndex("by_online", (q) => q.eq("isOnline", true))
      .collect();

    for (const user of onlineUsers) {
      if (user.lastSeen < oneMinuteAgo) {
        await ctx.db.patch(user._id, { isOnline: false });
      }
    }
  },
});
