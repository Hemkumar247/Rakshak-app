"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Bot, Loader2 } from 'lucide-react';

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

const formSchema = z.object({
  farmLocation: z.string().min(2, "Farm location is required."),
});

export default function CropSuggestionsPage() {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState<string | null>(null);
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
      setRecommendations(result.cropRecommendations);
    } catch (error) {
      console.error("Failed to get crop suggestions:", error);
      // You could add a toast notification here
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-white/40">
          <CardContent className="pt-6">
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

        <div className="animate-fade-in">
          <Card className="shadow-lg border-white/40 min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Bot /> {t('recommendations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {recommendations && (
                <p className="text-foreground/90 leading-relaxed">{recommendations}</p>
              )}
              {!isLoading && !recommendations && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Bot className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Your crop recommendations will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
