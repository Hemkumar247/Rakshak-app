// src/components/community/chat-interface.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Loader2, MessageSquare, CornerDownLeft } from "lucide-react";
import { format } from 'date-fns';

import { sendMessage, type Message } from "@/app/community/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useFirestoreQuery } from "@/hooks/use-firestore-query";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MockUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  text: z.string().min(1, "Message cannot be empty."),
});

type ChatInterfaceProps = {
  currentUser: MockUser;
  chatId: string;
  chatType: 'community' | 'private';
  title: string;
  description: string;
  otherUser?: MockUser; // For private chats
};

export function ChatInterface({ currentUser, chatId, chatType, title, description }: ChatInterfaceProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  const collectionPath = chatType === 'community' ? 'community_messages' : `private_chats/${chatId}/messages`;
  const messagesQuery = query(collection(db, collectionPath), orderBy("timestamp", "asc"), limit(50));
  const { data: messages, status } = useFirestoreQuery<Message>(messagesQuery);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) return;
    setIsSending(true);

    try {
      await sendMessage({
        chatId,
        chatType,
        message: {
          text: values.text,
          senderId: currentUser.uid,
          senderName: currentUser.displayName || "Anonymous",
          senderPhotoURL: currentUser.photoURL || "",
        },
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card className="flex flex-col h-full w-full shadow-lg border-white/40">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <MessageSquare /> {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {status === 'loading' && <Loader2 className="mx-auto h-8 w-8 animate-spin" />}
        {status === 'success' && messages.map((msg, index) => {
            const isCurrentUser = msg.senderId === currentUser.uid;
            return (
                <div key={msg.id || index} className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                    {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.senderPhotoURL} />
                            <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn("max-w-xs md:max-w-md rounded-xl px-4 py-2", isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        {!isCurrentUser && <p className="text-xs font-bold text-primary mb-1">{msg.senderName}</p>}
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                            {msg.timestamp ? format(msg.timestamp.toDate(), 'p') : ''}
                        </p>
                    </div>
                </div>
            )
        })}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <Textarea
            {...form.register("text")}
            placeholder="Type your message here..."
            className="pr-20"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <p className="text-xs text-muted-foreground hidden sm:block">
              <CornerDownLeft className="inline h-3 w-3" /> to send
            </p>
            <Button type="submit" size="icon" disabled={isSending || !form.formState.isValid}>
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
