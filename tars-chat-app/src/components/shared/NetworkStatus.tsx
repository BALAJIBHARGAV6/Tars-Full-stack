/* ========================================================
   NETWORK STATUS - Offline Banner
   
   Shows a red banner at the top when the user loses internet.
   Automatically hides when connection is restored.
   ======================================================== */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Check initial status
    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex items-center justify-center gap-2 bg-red-500 px-4 py-2 text-sm font-medium text-white"
        >
          <WifiOff className="h-4 w-4" />
          You are offline. Messages will sync when you reconnect.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
