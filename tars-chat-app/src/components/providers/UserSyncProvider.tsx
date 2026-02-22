/* ========================================================
   USER SYNC PROVIDER - Syncs Clerk User to Convex
   
   When a user logs in with Clerk, their profile data (name,
   email, avatar) needs to be stored in our Convex database too.
   This component runs once on login and syncs the user data.
   
   Also starts the presence heartbeat so the user shows as online.
   ======================================================== */

"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";
import { usePresence } from "@/hooks/usePresence";

export default function UserSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  // Start the presence heartbeat (sends "I'm online" every 30 seconds)
  usePresence(user?.id);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Sync Clerk user data to Convex
    createOrUpdateUser({
      clerkId: user.id,
      name: user.fullName || user.firstName || "Anonymous",
      email: user.primaryEmailAddress?.emailAddress || "",
      avatarUrl: user.imageUrl || "",
    });
  }, [isLoaded, user, createOrUpdateUser]);

  return <>{children}</>;
}
