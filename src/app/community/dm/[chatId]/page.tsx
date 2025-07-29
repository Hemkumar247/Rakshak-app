// src/app/community/dm/[chatId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatInterface } from "@/components/community/chat-interface";
import { useAuth, MockUser, mockUsers } from "@/lib/auth";
import { Loader2 } from 'lucide-react';

export default function PrivateChatPage() {
    const { currentUser } = useAuth();
    const params = useParams();
    const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

    const [otherUser, setOtherUser] = useState<MockUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (chatId && currentUser) {
            const userIds = chatId.split('_');
            const otherUserId = userIds.find(id => id !== currentUser.uid);
            
            // In a real app, you would fetch this user's data from Firestore.
            // For this demo, we'll find them in the mock data.
            const foundUser = mockUsers.find(u => u.uid === otherUserId);
            setOtherUser(foundUser || null);
            setLoading(false);
        }
    }, [chatId, currentUser]);

    if (loading || !currentUser || !otherUser) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <ChatInterface
            currentUser={currentUser}
            chatId={chatId}
            chatType="private"
            title={`Chat with ${otherUser.displayName}`}
            description={`This is a private conversation.`}
            otherUser={otherUser}
        />
    );
}
