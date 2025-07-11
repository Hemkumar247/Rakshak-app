"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Lightbulb, Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAIAgronomicTips } from './actions';
import { useLanguage } from '@/lib/i18n';

const formSchema = z.object({
  cropType: z.string().min(2, "Crop type is required."),
  farmConditions: z.string().min(10, "Farm conditions are required."),
});

export default function AgronomicTipsPage() {
  const { t } = useLanguage();
  const [tips, setTips] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      farmConditions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTips(null);
    try {
      const result = await getAIAgronomicTips(values);
      setTips(result.tips);
    } catch (error) {
      console.error("Failed to get agronomic tips:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('agronomicTipsTitle')}</h1>
        <p className="text-muted-foreground">{t('agronomicTipsDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-white/40">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('cropType')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('cropTypePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farmConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmConditions')}</FormLabel>
                      <FormControl>
                        <Textarea rows={6} placeholder={t('farmConditionsPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('loading') : t('getTips')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="animate-fade-in">
          <Card className="shadow-lg border-white/40 min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Lightbulb /> {t('tips')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {tips && (
                <ul className="space-y-3 list-decimal pl-5 text-foreground/90">
                  {tips.map((tip, index) => (
                    <li key={index} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              )}
              {!isLoading && !tips && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Your agronomic tips will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
