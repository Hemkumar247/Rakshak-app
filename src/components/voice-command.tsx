"use client";

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
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

// Add SpeechRecognition types for browsers that support it
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceCommand() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: "Browser Not Supported",
        description: "Your browser doesn't support voice commands.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
      // If it stops without processing, it means no speech was detected.
      if (isProcessing) {
          // This will be set to false in the onresult handler's finally block
      } else {
          setIsProcessing(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      toast({
        variant: 'destructive',
        title: "Voice Error",
        description: event.error === 'no-speech' ? "I didn't hear anything. Please try again." : "An error occurred during voice recognition.",
      });
      setIsProcessing(false);
      setIsRecording(false);
    };

    recognition.onresult = async (event: any) => {
      const command = event.results[0][0].transcript;
      setIsProcessing(true); // Moved here to signal processing has started
      try {
        const intentResult = await getUserIntent({
          command,
          language: language,
        });

        if (intentResult && intentResult.intent) {
          handleIntent(intentResult);
        } else {
          toast({ variant: 'destructive', title: "Could not understand", description: "Please try speaking again clearly." });
        }
      } catch (error) {
        console.error("Error processing voice command:", error);
        toast({ variant: 'destructive', title: "Voice Error", description: "Failed to process your voice command." });
      } finally {
        setIsProcessing(false);
      }
    };
    
    recognitionRef.current = recognition;
  }, [language, toast, router, isProcessing]); // Added dependencies

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

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsProcessing(true); // Show loading state immediately on click
      recognitionRef.current.start();
    }
  };

  const getTooltipContent = () => {
    if (isRecording) return 'Recording...';
    if (isProcessing) return 'Processing...';
    return t('appName') + ' is listening!';
  }

  const isDisabled = !recognitionRef.current || isProcessing;

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        size="icon"
                        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-primary hover:bg-accent hover:text-accent-foreground'}`}
                        onClick={handleMicClick}
                        disabled={isDisabled}
                    >
                        {isProcessing && !isRecording ? (
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
                <p>{getTooltipContent()}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
