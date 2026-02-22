/* ========================================================
   CONVEX PRESENCE - User Online/Offline Status Management
   
   The presence system works by having each client send
   a "heartbeat" every 30 seconds. If a user's heartbeat
   stops (they close the browser), they're marked offline
   after 60 seconds.
   ======================================================== */

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ===== UPDATE PRESENCE (HEARTBEAT) =====
// Called every 30 seconds from the client to say "I'm still here!"
export const heartbeat = mutation({
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

// ===== GET ONLINE USERS =====
// Returns all users who are currently online.
export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const onlineUsers = await ctx.db
      .query("users")
      .withIndex("by_online", (q) => q.eq("isOnline", true))
      .collect();
    return onlineUsers;
  },
});

// ===== SET OFFLINE =====
// Explicitly mark a user as offline (called on browser close/logout).
export const setOffline = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        isOnline: false,
        lastSeen: Date.now(),
      });
    }
  },
});
