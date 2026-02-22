/* ========================================================
   USER LIST - Grid of All Registered Users
   
   Fetches all users from Convex, excludes the current user,
   and displays them in a searchable grid of UserCards.
   Includes staggered fade-in animations.
   ======================================================== */

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Users, Search } from "lucide-react";
import UserCard from "./UserCard";
import UserSearch from "./UserSearch";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/SkeletonLoader";

export default function UserList() {
  const { user: currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all users from Convex - this auto-updates in real-time!
  const allUsers = useQuery(api.users.getAllUsers);

  // Filter out current user and apply search
  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];

    return allUsers
      .filter((u) => u.clerkId !== currentUser?.id) // Exclude self
      .filter(
        (u) =>
          !searchQuery ||
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allUsers, currentUser?.id, searchQuery]);

  // Loading skeleton
  if (allUsers === undefined) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <UserSearch onSearch={setSearchQuery} />

      {/* User grid */}
      {filteredUsers.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon={Search}
            title="No users found"
            description={`No users matching "${searchQuery}". Try a different search term.`}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No other users yet"
            description="You're the first one here! Share the app with friends to start chatting."
          />
        )
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <UserCard user={user} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
