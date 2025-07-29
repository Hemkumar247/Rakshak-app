// src/app/community/dm/page.tsx
"use client";

import { useState } from "react";
import { MessageSquare, Users } from "lucide-react";
import { UserSelectionDialog } from "@/components/community/user-selection-dialog";
import { useRouter } from "next/navigation";
import { useAuth, MockUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

function generateChatId(uid1: string, uid2: string) {
    return [uid1, uid2].sort().join('_');
}

export default function DirectMessagesPage() {
    const router = useRouter();
    const { currentUser } = useAuth();

    const handleUserSelect = (selectedUser: MockUser) => {
        if (!currentUser) return;
        const chatId = generateChatId(currentUser.uid, selectedUser.uid);
        router.push(`/community/dm/${chatId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-card rounded-xl shadow-inner">
            <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-bold font-headline">Direct Messages</h2>
            <p className="text-muted-foreground mb-6">Select a farmer to start a private conversation.</p>
            <UserSelectionDialog onUserSelect={handleUserSelect}>
                <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start New Chat
                </Button>
            </UserSelectionDialog>
        </div>
    );
}
