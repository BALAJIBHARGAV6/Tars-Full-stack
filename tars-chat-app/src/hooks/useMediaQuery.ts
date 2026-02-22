/* ========================================================
   useMediaQuery Hook - Responsive Breakpoint Detection
   
   Detects screen size so we can change layout behavior
   between mobile, tablet, and desktop views.
   Returns true if the screen matches the given media query.
   ======================================================== */

"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // window.matchMedia creates a media query listener
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Listen for changes (e.g., user resizes window)
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
