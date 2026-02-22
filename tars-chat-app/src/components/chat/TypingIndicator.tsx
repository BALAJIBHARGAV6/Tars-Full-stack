/* ========================================================
   TYPING INDICATOR - Shows "User is typing..." Animation
   
   Displays at the bottom of the message list when another
   user is typing. Features animated bouncing dots.
   ======================================================== */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TypingIndicatorProps {
  typingUsers: Array<{
    _id: string;
    name: string;
    avatarUrl: string;
  }>;
}

export default function TypingIndicator({
  typingUsers,
}: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  // Build the "who is typing" text
  const typingText =
    typingUsers.length === 1
      ? `${typingUsers[0].name} is typing`
      : typingUsers.length === 2
        ? `${typingUsers[0].name} and ${typingUsers[1].name} are typing`
        : `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.15 }}
        className="flex items-center gap-2 px-1 py-2"
      >
        {/* Small avatar of the typing user with story ring */}
        <div className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 p-0.5 shrink-0">
          <div className="rounded-full bg-white p-0.5">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={typingUsers[0].avatarUrl}
                alt={typingUsers[0].name}
              />
              <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-[10px] font-semibold text-violet-700">
                {typingUsers[0].name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Typing bubble with animated dots */}
        <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 px-3 sm:px-4 py-2 shadow-sm">
          <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-32 sm:max-w-none">{typingText}</span>
          <div className="flex items-center gap-1 ml-1 shrink-0">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
