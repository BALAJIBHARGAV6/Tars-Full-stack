/* ========================================================
   usePresence Hook - Online/Offline Status Tracking
   
   This hook sends a "heartbeat" to the Convex server every
   30 seconds, telling it "I'm still here!" When the user
   closes the browser or navigates away, the heartbeat stops
   and they're marked offline after 60 seconds.
   
   Also handles:
   - Window focus/blur events (mark online when tab is active)
   - Cleanup on component unmount
   ======================================================== */

"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PRESENCE_INTERVAL_MS } from "@/lib/constants";

export function usePresence(clerkId: string | undefined) {
  // useMutation returns a function we can call to run a Convex mutation
  const heartbeat = useMutation(api.presence.heartbeat);
  const setOffline = useMutation(api.presence.setOffline);
  // useRef keeps a value that persists across renders without causing re-renders
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!clerkId) return;

    // Send initial heartbeat immediately when component mounts
    heartbeat({ clerkId });

    // Set up interval to send heartbeat every 30 seconds
    intervalRef.current = setInterval(() => {
      heartbeat({ clerkId });
    }, PRESENCE_INTERVAL_MS);

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab became active - send heartbeat immediately
        heartbeat({ clerkId });
      }
    };

    // Handle page unload (browser close, navigate away)
    const handleBeforeUnload = () => {
      setOffline({ clerkId });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function - runs when component unmounts
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setOffline({ clerkId });
    };
  }, [clerkId, heartbeat, setOffline]);
}
