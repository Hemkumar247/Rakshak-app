// src/lib/auth.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "./firebase";
import { Loader2 } from 'lucide-react';
import { collection, getDocs, writeBatch, serverTimestamp, doc } from 'firebase/firestore';

// Mock user data for the demo
export const mockUsers = [
    { uid: 'user1', displayName: 'Amit Kumar', photoURL: `https://placehold.co/100x100.png` },
    { uid: 'user2', displayName: 'Sunita Sharma', photoURL: `https://placehold.co/100x100.png` },
    { uid: 'user3', displayName: 'Rajesh Patel', photoURL: `https://placehold.co/100x100.png` },
    { uid: 'user4', displayName: 'Priya Singh', photoURL: `https://placehold.co/100x100.png` },
    { uid: 'user5', displayName: 'Vijay Verma', photoURL: `https://placehold.co/100x100.png` },
];

export interface MockUser {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
}

type AuthContextType = {
  currentUser: MockUser | null;
  setCurrentUser: (user: MockUser | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A one-time flag to ensure seeding doesn't happen on every render
let hasSeeded = false;

async function seedInitialMessages() {
    if (hasSeeded) return;
    hasSeeded = true; // Set flag immediately to prevent race conditions

    try {
        const messagesCollectionRef = collection(db, 'community_messages');
        const snapshot = await getDocs(messagesCollectionRef);

        if (snapshot.empty) {
            console.log("Seeding initial community messages...");
            const batch = writeBatch(db);
            const demoMessages = [
                {
                    user: mockUsers[1], // Sunita Sharma
                    text: "The weather forecast looks great for planting this week! Anyone else getting their fields ready?",
                },
                {
                    user: mockUsers[2], // Rajesh Patel
                    text: "I'm having some trouble with pests on my tomato plants. Any advice on organic pesticides?",
                },
                {
                    user: mockUsers[0], // Amit Kumar
                    text: "@Rajesh Patel, have you tried a neem oil spray? It worked well for me last season.",
                },
            ];

            demoMessages.forEach(msg => {
                const newDocRef = doc(messagesCollectionRef); // Correctly create a new doc ref
                batch.set(newDocRef, {
                    text: msg.text,
                    senderId: msg.user.uid,
                    senderName: msg.user.displayName,
                    senderPhotoURL: msg.user.photoURL,
                    timestamp: serverTimestamp(),
                });
            });

            await batch.commit();
            console.log("Demo messages seeded successfully.");
        }
    } catch (error) {
        console.error("Error seeding initial messages:", error);
        hasSeeded = false; // Reset flag on error to allow retry
    }
}


// This is a simplified AuthProvider for demonstration purposes.
// In a real app, you would integrate this with Firebase Auth UI or custom login flows.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For this demo, we'll just set a default mock user.
    // In a real app, you might use onAuthStateChanged(auth, setUser)
    // and fetch profile info from Firestore.
    setTimeout(() => {
        setCurrentUser(mockUsers[0]); // Default to Amit Kumar
        setLoading(false);
        seedInitialMessages();
    }, 1000); // Simulate loading
  }, []);

  const value = { currentUser, setCurrentUser, loading };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
