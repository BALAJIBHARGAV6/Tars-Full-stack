/* ========================================================
   DATE FORMATTERS - Smart Timestamp Formatting
   
   Formats message timestamps intelligently:
   - Today: "2:34 PM"
   - This week: "Mon, 2:34 PM"
   - This year: "Feb 15, 2:34 PM"
   - Older: "Feb 15, 2024, 2:34 PM"
   
   Uses the date-fns library for reliable date manipulation.
   ======================================================== */

import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
  formatDistanceToNow,
} from "date-fns";

// Format a message timestamp with smart relative formatting
export function formatMessageTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  if (isToday(date)) {
    // Same day: just show time like "2:34 PM"
    return format(date, "h:mm a");
  }

  if (isYesterday(date)) {
    // Yesterday: "Yesterday, 2:34 PM"
    return `Yesterday, ${format(date, "h:mm a")}`;
  }

  if (isThisWeek(date)) {
    // Within this week: "Mon, 2:34 PM"
    return format(date, "EEE, h:mm a");
  }

  if (isThisYear(date)) {
    // Same year: "Feb 15, 2:34 PM"
    return format(date, "MMM d, h:mm a");
  }

  // Older messages: "Feb 15, 2024, 2:34 PM"
  return format(date, "MMM d, yyyy, h:mm a");
}

// Format the full date/time for tooltip on hover
export function formatFullTimestamp(timestamp: number): string {
  return format(new Date(timestamp), "EEEE, MMMM d, yyyy 'at' h:mm:ss a");
}

// Format "last seen" as relative time: "5 minutes ago", "2 hours ago"
export function formatLastSeen(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

// Format a date separator for messages (e.g., "Today", "Yesterday", "February 15")
export function formatDateSeparator(timestamp: number): string {
  const date = new Date(timestamp);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisYear(date)) return format(date, "MMMM d");
  return format(date, "MMMM d, yyyy");
}
