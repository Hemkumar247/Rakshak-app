// src/app/community/actions.ts
"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where, limit } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export interface Message {
    id?: string;
    text: string;
    senderId: string;
    senderName: string;
    senderPhotoURL: string;
    timestamp: any;
}

export interface SendMessageInput {
    chatId: string;
    chatType: 'community' | 'private';
    message: Omit<Message, 'timestamp' | 'id'>;
}

export async function sendMessage(input: SendMessageInput) {
    const { chatId, chatType, message } = input;
    
    if (!chatId || !message.text) {
        throw new Error("Missing chat ID or message text.");
    }
    
    const collectionPath = chatType === 'community' ? 'community_messages' : `private_chats/${chatId}/messages`;

    try {
        await addDoc(collection(db, collectionPath), {
            ...message,
            timestamp: serverTimestamp(),
        });
        
        // Revalidate the path to help with caching, though real-time updates are handled client-side.
        if (chatType === 'community') {
            revalidatePath('/community');
        } else {
            revalidatePath(`/community/dm/${chatId}`);
        }

    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message.");
    }
}

// In a real app, you might have more robust user management.
// This is a simple function to get users for the selection dialog.
export async function getUsers() {
    // This is mocked for the demo. In a real app, you would query a 'users' collection.
    const { mockUsers } = await import('@/lib/auth');
    return mockUsers;
}
