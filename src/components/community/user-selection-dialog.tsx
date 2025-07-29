// src/components/community/user-selection-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsers } from "@/app/community/actions";
import { useAuth, type MockUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type UserSelectionDialogProps = {
  children: React.ReactNode;
  onUserSelect: (user: MockUser) => void;
};

export function UserSelectionDialog({ children, onUserSelect }: UserSelectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<MockUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      async function fetchUsers() {
        setIsLoading(true);
        try {
          const allUsers = await getUsers();
          // Filter out the current user from the list
          const otherUsers = allUsers.filter(u => u.uid !== currentUser?.uid);
          setUsers(otherUsers);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchUsers();
    }
  }, [isOpen, currentUser]);

  const handleSelect = (user: MockUser) => {
    onUserSelect(user);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new chat</DialogTitle>
          <DialogDescription>Select a farmer to start a private conversation.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] mt-4">
            <div className="space-y-2 pr-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    users.map((user) => (
                    <Button
                        key={user.uid}
                        variant="ghost"
                        className="w-full justify-start h-auto p-2"
                        onClick={() => handleSelect(user)}
                    >
                        <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.displayName}</span>
                    </Button>
                    ))
                )}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
