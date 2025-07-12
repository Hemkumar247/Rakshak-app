"use client";

import dynamic from 'next/dynamic';
import { Header } from '@/components/header';

// Dynamically import VoiceCommand with SSR turned off
const VoiceCommand = dynamic(() => import('@/components/voice-command').then(mod => mod.VoiceCommand), {
  ssr: false,
});


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6">
        {children}
      </main>
      <VoiceCommand />
    </div>
  );
}
