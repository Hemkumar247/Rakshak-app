// src/app/community/page.tsx
"use client";

import { ChatInterface } from "@/components/community/chat-interface";
import { useAuth } from "@/lib/auth";

export default function CommunityPage() {
    const { currentUser } = useAuth();
    
    if (!currentUser) return null;

    return (
        <ChatInterface
            currentUser={currentUser}
            chatId="community_messages" // A fixed ID for the public wall
            chatType="community"
            title="Community Wall"
            description="Discuss topics with all farmers in the community."
        />
    );
}
