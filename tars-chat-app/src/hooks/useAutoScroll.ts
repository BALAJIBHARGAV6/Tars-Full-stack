/* ========================================================
   useAutoScroll Hook - Optimized Scroll Management
   
   Manages auto-scrolling in the message list:
   - If user is at the bottom -> auto-scroll when new messages arrive
   - If user scrolled up (reading old messages) -> don't auto-scroll
   - Show a "New messages" button when not at bottom + new messages
   - Throttled scroll handler for smooth performance
   ======================================================== */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useAutoScroll(messageCount: number) {
  // Ref to the scrollable message container element
  const scrollRef = useRef<HTMLDivElement>(null);
  // Whether to show the "scroll to new messages" button
  const [showScrollButton, setShowScrollButton] = useState(false);
  // Track if user was at the bottom before new messages
  const wasAtBottomRef = useRef(true);
  // Throttle ref for scroll events
  const scrollThrottleRef = useRef(false);

  // Check if the user is currently scrolled to the bottom
  // (within 150px threshold to account for small differences)
  const isAtBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return true;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < 150;
  }, []);

  // Smoothly scroll to the bottom of the message list
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
      setShowScrollButton(false);
    }
  }, []);

  // Listen for scroll events with throttling for performance
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Throttle to ~60fps for buttery smooth scrolling
      if (scrollThrottleRef.current) return;
      scrollThrottleRef.current = true;

      requestAnimationFrame(() => {
        const atBottom = isAtBottom();
        wasAtBottomRef.current = atBottom;
        if (atBottom) {
          setShowScrollButton(false);
        }
        scrollThrottleRef.current = false;
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isAtBottom]);

  // When message count changes, decide whether to auto-scroll
  useEffect(() => {
    if (messageCount === 0) return;

    if (wasAtBottomRef.current) {
      // User was at the bottom -> scroll to show new message
      scrollToBottom("smooth");
    } else {
      // User was reading older messages -> show button instead
      setShowScrollButton(true);
    }
  }, [messageCount, scrollToBottom]);

  // Instant scroll to bottom on initial load
  useEffect(() => {
    if (messageCount > 0) {
      scrollToBottom("instant");
    }
    // Only run once on mount with initial messages
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scrollRef, showScrollButton, scrollToBottom };
}
