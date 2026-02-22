/* ========================================================
   GROUP AVATAR - Overlapping Avatar Display for Group Chats
   ======================================================== */

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GroupAvatarProps {
  participants: Array<{
    name: string;
    avatarUrl: string;
  }>;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function GroupAvatar({
  participants,
  size = "md",
  className,
}: GroupAvatarProps) {
  if (participants.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-green-400 font-medium text-white",
          sizeMap[size],
          className
        )}
      >
        G
      </div>
    );
  }

  // Show up to 2 overlapping avatars
  const shown = participants.slice(0, 2);
  const remaining = participants.length - 2;

  return (
    <div className={cn("relative flex items-center", className)}>
      {shown.map((user, index) => (
        <Avatar
          key={index}
          className={cn(
            sizeMap[size],
            "border-2 border-white",
            index > 0 && "-ml-3"
          )}
        >
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="bg-violet-100 text-violet-700">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "flex -ml-3 items-center justify-center rounded-full border-2 border-white bg-slate-200 font-medium text-slate-600",
            size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
