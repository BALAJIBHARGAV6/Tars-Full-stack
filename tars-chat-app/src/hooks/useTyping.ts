/* ========================================================
   useTyping Hook - Typing Indicator Detection
   
   Detects when a user is typing and sends that status to
   the Convex backend so other users can see "X is typing..."
   
   How it works:
   1. User starts typing -> sends "isTyping: true" to Convex
   2. Typing continues -> resets the timeout timer
   3. User stops typing for 2 seconds -> sends "isTyping: false"
   4. User sends message -> immediately clears typing status
   ======================================================== */

"use client";

import { useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { TYPING_TIMEOUT_MS } from "@/lib/constants";

export function useTyping(
  conversationId: Id<"conversations"> | undefined,
  userId: string | undefined
) {
  const setTyping = useMutation(api.typing.setTyping);
  // Refs don't cause re-renders, perfect for timeout tracking
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCurrentlyTyping = useRef(false);

  // Called every time the user presses a key in the message input
  const handleTyping = useCallback(() => {
    if (!conversationId || !userId) return;

    // If not already marked as typing, send "typing" status
    if (!isCurrentlyTyping.current) {
      isCurrentlyTyping.current = true;
      setTyping({ conversationId, userId, isTyping: true });
    }

    // Clear previous timeout and start a new one
    // This effectively "debounces" the stop-typing signal
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // After 2 seconds of no typing, send "stopped typing"
    typingTimeoutRef.current = setTimeout(() => {
      isCurrentlyTyping.current = false;
      setTyping({ conversationId, userId, isTyping: false });
    }, TYPING_TIMEOUT_MS);
  }, [conversationId, userId, setTyping]);

  // Explicitly stop typing (called when message is sent)
  const stopTyping = useCallback(() => {
    if (!conversationId || !userId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isCurrentlyTyping.current = false;
    setTyping({ conversationId, userId, isTyping: false });
  }, [conversationId, userId, setTyping]);

  return { handleTyping, stopTyping };
}
