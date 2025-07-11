"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Bot, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSmartCropSuggestions } from './actions';
import { useLanguage } from '@/lib/i18n';
import type { SmartCropSuggestionsOutput } from '@/ai/flows/smart-crop-suggestions';

const formSchema = z.object({
  farmLocation: z.string().min(2, "Farm location is required."),
});

type Recommendation = SmartCropSuggestionsOutput['recommendations'][0];

export default function CropSuggestionsPage() {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmLocation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await getSmartCropSuggestions(values);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Failed to get crop suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('cropSuggestionsTitle')}</h1>
        <p className="text-muted-foreground">{t('cropSuggestionsDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg border-white/40 sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Bot /> {t('getSuggestions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="farmLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmLocation')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmLocationPlaceholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        The AI will analyze the location and current season for the best recommendations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('loading') : t('getSuggestions')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="animate-fade-in space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {recommendations && (
             <div className="space-y-6">
              <h2 className="text-2xl font-headline font-bold">{t('recommendations')}</h2>
              {recommendations.map((rec) => (
                <Card key={rec.cropName} className="shadow-lg border-white/40 overflow-hidden">
                    <div className="relative h-48 w-full">
                        <Image 
                            src={`https://placehold.co/600x400.png`} 
                            alt={rec.cropName} 
                            layout="fill" 
                            objectFit="cover"
                            data-ai-hint={rec.imageQuery}
                        />
                    </div>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline text-primary">{rec.cropName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                        {rec.reasoning.map((reason, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-foreground/90">{reason}</span>
                            </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && !recommendations && (
            <div className="flex flex-col items-center justify-center h-96 text-center bg-card rounded-lg shadow-lg border-white/40">
              <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">Your crop recommendations will appear here.</p>
              <p className="text-muted-foreground/80">Enter a location to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
