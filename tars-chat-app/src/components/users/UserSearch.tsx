/* ========================================================
   USER SEARCH - Search Bar to Filter Users
   
   An input field that filters the user list as you type.
   Uses debouncing (300ms delay) so it doesn't fire on
   every single keystroke - just when you pause typing.
   ======================================================== */

"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";

interface UserSearchProps {
  onSearch: (query: string) => void;
}

export default function UserSearch({ onSearch }: UserSearchProps) {
  const [query, setQuery] = useState("");

  // Debounce: wait 300ms after the user stops typing before filtering
  // This prevents unnecessary work on every keystroke
  const debouncedSearch = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        onSearch(value);
      }, SEARCH_DEBOUNCE_MS);
      return timer;
    },
    [onSearch]
  );

  useEffect(() => {
    const timer = debouncedSearch(query);
    // Cleanup: clear the timer if the user types again before 300ms
    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  return (
    <div className="relative">
      {/* Search icon on the left side of the input */}
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10 bg-white border-slate-200 focus-visible:ring-violet-500"
      />
      {/* Clear button - only shows when there's text */}
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
