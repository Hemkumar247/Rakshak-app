// src/app/market-analysis/page.tsx
"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, TrendingUp, BarChart, Tag, Calendar, ShieldCheck, AreaChart, MapPin } from 'lucide-react';
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { getMarketPrices } from './actions';
import type { MarketPriceData } from './actions';

const formSchema = z.object({
  commodity: z.string().min(2, "Crop name is required."),
  state: z.string().min(2, "State is required."),
  market: z.string().min(2, "Market name is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function MarketAnalysisPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [priceData, setPriceData] = useState<MarketPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commodity: "",
      state: "",
      market: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setPriceData(null);
    try {
      const result = await getMarketPrices(values.commodity, values.state, values.market);
      setPriceData(result);
    } catch (error) {
      console.error("Failed to get market prices:", error);
      let errorMessage = t('errorDescription');
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: t('errorTitle'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGetLocation() {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error("Failed to fetch address");
          const data = await response.json();
          const state = data.address.state;
          
          if (!state) {
            throw new Error("Could not determine state from your location.");
          }

          form.setValue('state', state, { shouldValidate: true });
          
          toast({
            title: "Location Found",
            description: "Your state has been filled in. Please enter your local market.",
          });
        } catch (e) {
            console.error("Reverse geocoding failed", e);
            toast({
                variant: "destructive",
                title: "Could not fetch address",
                description: e instanceof Error ? e.message : "An unknown error occurred.",
            });
        } finally {
            setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let description = "An unknown error occurred.";
        if (error.code === error.PERMISSION_DENIED) {
            description = "You denied the request for Geolocation.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            description = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
            description = "The request to get user location timed out.";
        }
        toast({
          variant: "destructive",
          title: "Error Getting Location",
          description,
        });
      }
    );
  }

  const chartData = priceData?.priceData.map(d => ({ name: d.day, price: d.price }));

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
              <TrendingUp /> Get Market Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="commodity"
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="e.g., Maharashtra" {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating} aria-label="Use My Location">
                            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pune" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('loading') : "Get Prices"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="animate-fade-in space-y-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-96 bg-card rounded-lg shadow-lg border-white/40">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Fetching live prices...</p>
            </div>
          )}
          {priceData && (
            <Card className="shadow-lg border-white/40">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Price Trend for <span className="text-primary">{priceData.commodity}</span></CardTitle>
                <CardDescription className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-2">{priceData.market}, {priceData.state}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                    <h3 className="font-headline text-lg font-semibold mb-2">Price Trend (Last 5 Days)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <RechartsAreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `₹${value}`} domain={['dataMin - 100', 'dataMax + 100']} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: "hsl(var(--background))", 
                                        borderColor: "hsl(var(--border))" 
                                    }}
                                    labelStyle={{ color: "hsl(var(--foreground))" }}
                                    formatter={(value: number) => [`₹${value.toFixed(2)}`, t('pricePerQuintal')]}
                                />
                                <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrice)" />
                            </RechartsAreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
              </CardContent>
            </Card>
          )}
          {!isLoading && !priceData && (
            <div className="flex flex-col items-center justify-center h-96 text-center bg-card rounded-lg shadow-lg border-white/40">
              <AreaChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">Market price trends will appear here.</p>
              <p className="text-muted-foreground/80">{t('enterDetails')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
