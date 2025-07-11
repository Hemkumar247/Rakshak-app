// src/app/market-analysis/page.tsx
"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, TrendingUp, BarChart, Check, X, Tag, Calendar, ShieldCheck } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";


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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { getMarketAnalysis, type MarketAnalysisOutput } from './actions';

const formSchema = z.object({
  cropName: z.string().min(2, "Crop name is required."),
  harvestTime: z.string().min(1, "Harvest time is required."),
  cropCondition: z.string().min(1, "Crop condition is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function MarketAnalysisPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<MarketAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: "",
      harvestTime: "",
      cropCondition: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await getMarketAnalysis({ ...values, language });
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to get market analysis:", error);
      toast({
        variant: "destructive",
        title: t('errorTitle'),
        description: t('errorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  const chartData = analysis?.priceData.map(d => ({ name: d.day, price: d.price }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('marketAnalysisTitle')}</h1>
        <p className="text-muted-foreground">{t('marketAnalysisDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg border-white/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <TrendingUp /> {t('getAnalysis')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cropName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('cropName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('cropNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="harvestTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('harvestTime')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select harvest time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="just_now">{t('harvestTimeJustNow')}</SelectItem>
                          <SelectItem value="2_days_ago">{t('harvestTime2Days')}</SelectItem>
                          <SelectItem value="4_days_ago">{t('harvestTime4Days')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cropCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('cropCondition')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="perfect">{t('conditionPerfect')}</SelectItem>
                            <SelectItem value="good">{t('conditionGood')}</SelectItem>
                            <SelectItem value="average">{t('conditionAverage')}</SelectItem>
                            <SelectItem value="poor">{t('conditionPoor')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('loading') : t('getAnalysis')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="animate-fade-in space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-96 bg-card rounded-lg shadow-lg border-white/40">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">{t('aiAnalyzingPrices')}</p>
            </div>
          )}
          {analysis && (
            <Card className="shadow-lg border-white/40">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{t('resultsFor')} <span className="text-primary">{analysis.cropName}</span></CardTitle>
                <CardDescription className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {analysis.harvestTime}</span>
                    <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {analysis.cropCondition}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            {analysis.recommendation === 'Sell Now' ? <Check className="text-green-500"/> : <X className="text-red-500" />}
                            {t('recommendation')}: <span className={analysis.recommendation === 'Sell Now' ? 'text-green-500' : 'text-red-500'}>{analysis.translatedRecommendation}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{analysis.reasoning}</p>
                    </CardContent>
                </Card>

                <div>
                    <h3 className="font-headline text-lg font-semibold mb-2">{t('priceTrend')}</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <RechartsBarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: "hsl(var(--background))", 
                                        borderColor: "hsl(var(--border))" 
                                    }}
                                    labelStyle={{ color: "hsl(var(--foreground))" }}
                                    formatter={(value: number) => [`₹${value}`, t('pricePerQuintal')]}
                                />
                                <Bar dataKey="price" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
              </CardContent>
            </Card>
          )}
          {!isLoading && !analysis && (
            <div className="flex flex-col items-center justify-center h-96 text-center bg-card rounded-lg shadow-lg border-white/40">
              <BarChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">{t('analysisResults')}</p>
              <p className="text-muted-foreground/80">{t('enterDetails')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
