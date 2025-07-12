"use client";

import { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
// @ts-ignore - The react-media-recorder package does not have official type definitions.
import { useReactMediaRecorder } from 'react-media-recorder';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { getUserIntent } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GetUserIntentOutput } from '@/ai/flows/get-user-intent';


export function VoiceCommand() {
  const { language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const onStop = async (blobUrl: string, blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        const intentResult = await getUserIntent({ 
            audioDataUri: base64Audio, 
            language: language 
        });

        if (intentResult && intentResult.intent) {
            handleIntent(intentResult);
        } else {
            toast({ variant: 'destructive', title: "Could not understand", description: "Please try speaking again clearly." });
        }
      };
    } catch (error) {
        console.error("Error processing voice command:", error);
        toast({ variant: 'destructive', title: "Voice Error", description: "Failed to process your voice command." });
    } finally {
        setIsProcessing(false);
    }
  };

  const { status, startRecording, stopRecording } = useReactMediaRecorder({ 
      audio: true,
      onStop,
      blobPropertyBag: { type: 'audio/wav' } 
    });

  const handleIntent = (intent: GetUserIntentOutput) => {
    switch(intent.intent) {
        case 'navigation':
            if (intent.page) {
                router.push(intent.page);
            } else {
                toast({ variant: 'destructive', title: "Navigation Error", description: "Could not determine which page to go to." });
            }
            break;
        case 'diagnosis':
             router.push('/agronomic-tips');
             break;
        case 'market_price':
            if (intent.cropName) {
                router.push(`/market-analysis?crop=${encodeURIComponent(intent.cropName)}`);
            } else {
                router.push('/market-analysis');
            }
            break;
        case 'unsupported':
            toast({ title: "Feature Not Supported", description: "Sorry, I can't perform that action yet."});
            break;
        default:
            toast({ variant: 'destructive', title: "Unknown Command", description: "Sorry, I didn't recognize that command." });
            break;
    }
  }

  const isRecording = status === 'recording';

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        size="icon"
                        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-primary hover:bg-accent hover:text-accent-foreground'}`}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isRecording ? (
                            <MicOff className="h-6 w-6" />
                        ) : (
                            <Mic className="h-6 w-6" />
                        )}
                        <span className="sr-only">
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </span>
                    </Button>
                </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="mb-2">
                <p>{isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Ask me anything!'}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
