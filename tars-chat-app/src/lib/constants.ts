/* ========================================================
   CONSTANTS - App-wide Configuration Values
   
   Keep magic numbers and strings in one place so they're
   easy to find and change.
   ======================================================== */

// How often the client sends a "heartbeat" to say "I'm still online"
export const PRESENCE_INTERVAL_MS = 30000; // 30 seconds

// After this much inactivity, a user is considered offline
export const OFFLINE_THRESHOLD_MS = 60000; // 60 seconds

// How long to wait before sending "stopped typing" status
export const TYPING_TIMEOUT_MS = 2000; // 2 seconds

// Debounce delay for search input
export const SEARCH_DEBOUNCE_MS = 300;

// Maximum character length for message preview in conversation list
export const MESSAGE_PREVIEW_LENGTH = 40;

// Available emoji reactions
export const REACTION_EMOJIS = [
  { emoji: "thumbsUp", label: "Thumbs Up", display: "\u{1F44D}" },
  { emoji: "heart", label: "Heart", display: "\u{2764}\u{FE0F}" },
  { emoji: "laugh", label: "Laugh", display: "\u{1F602}" },
  { emoji: "surprised", label: "Surprised", display: "\u{1F62E}" },
  { emoji: "sad", label: "Sad", display: "\u{1F622}" },
];

// Map emoji IDs to their display characters
export const EMOJI_MAP: Record<string, string> = {
  thumbsUp: "\u{1F44D}",
  heart: "\u{2764}\u{FE0F}",
  laugh: "\u{1F602}",
  surprised: "\u{1F62E}",
  sad: "\u{1F622}",
};
