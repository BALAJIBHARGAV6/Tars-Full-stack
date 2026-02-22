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
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <Input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-violet-500 dark:focus-visible:ring-violet-400 focus-visible:border-violet-300 dark:focus-visible:border-violet-600 transition-all"
      />
      {/* Clear button - only shows when there's text */}
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 dark:text-slate-500 transition-colors hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
