/* ========================================================
   CREATE GROUP MODAL - Dialog for Creating Group Chats
   
   Allows users to select multiple participants and give
   the group a name.
   ======================================================== */

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateGroupModal({
  open,
  onOpenChange,
}: CreateGroupModalProps) {
  const { user: currentUser } = useUser();
  const router = useRouter();
  const allUsers = useQuery(api.users.getAllUsers);
  const createGroup = useMutation(api.conversations.createGroupConversation);

  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Filter out current user from selectable users
  const availableUsers =
    allUsers?.filter((u) => u.clerkId !== currentUser?.id) || [];

  const toggleUser = (clerkId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(clerkId)
        ? prev.filter((id) => id !== clerkId)
        : [...prev, clerkId]
    );
  };

  const handleCreate = async () => {
    if (!currentUser || !groupName.trim() || selectedUserIds.length < 2) return;

    setIsCreating(true);
    try {
      const conversationId = await createGroup({
        name: groupName.trim(),
        participantIds: selectedUserIds,
        createdBy: currentUser.id,
      });
      toast.success("Group created!");
      onOpenChange(false);
      setGroupName("");
      setSelectedUserIds([]);
      router.push(`/chat/${conversationId}`);
    } catch {
      toast.error("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Create Group Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group name input */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Group Name
            </label>
            <Input
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="focus-visible:ring-violet-500"
            />
          </div>

          {/* User selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Select Members ({selectedUserIds.length} selected)
            </label>
            <div className="max-h-60 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
              {availableUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.clerkId);
                return (
                  <button
                    key={user._id}
                    onClick={() => toggleUser(user.clerkId)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors",
                      isSelected ? "bg-violet-50" : "hover:bg-slate-50"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-violet-100 text-xs text-violet-700">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-left text-sm text-slate-700">
                      {user.name}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-violet-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={
              !groupName.trim() || selectedUserIds.length < 2 || isCreating
            }
            className="bg-violet-500 hover:bg-violet-600"
          >
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
