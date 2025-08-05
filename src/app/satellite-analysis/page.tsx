
"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Map, Satellite, Loader2 } from 'lucide-react';
import Image from 'next/image';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  coordinates: z.string().regex(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?((1[0-7]\d(\.\d+)?|([1-9]?\d)(\.\d+)?))$/, "Invalid coordinates. Please use 'lat, lon' format."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SatelliteAnalysisPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<{imageUrl: string; ndvi: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coordinates: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnalysisResult(null);

    // Simulate fetching data from a backend service that uses Google Earth Engine
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, the backend would return a real satellite image URL and NDVI value.
    setAnalysisResult({
        imageUrl: `https://placehold.co/800x600.png`,
        ndvi: Math.random() * (0.8 - 0.2) + 0.2, // Random NDVI value between 0.2 and 0.8
    });

    toast({
        title: "Analysis Complete",
        description: "Satellite imagery processed successfully."
    });

    setIsLoading(false);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('satelliteAnalysisTitle')}</h1>
        <p className="text-muted-foreground">{t('satelliteAnalysisDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Satellite /> {t('newAnalysis')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="coordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmCoordinates')}</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 28.6139, 77.2090" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('loading') : t('analyzeField')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="min-h-[400px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Map /> {t('analysisResult')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                 {isLoading && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-lg text-muted-foreground">{t('fetchingSatellite')}</p>
                    </div>
                )}

                {analysisResult && (
                    <Tabs defaultValue="image" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="image">{t('satelliteImage')}</TabsTrigger>
                            <TabsTrigger value="health">{t('vegetationHealth')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="image" className="mt-4">
                            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                                <Image 
                                    src={analysisResult.imageUrl} 
                                    alt="Satellite view of the farm" 
                                    layout="fill" 
                                    objectFit="cover"
                                    data-ai-hint="satellite farm"
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="health" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>NDVI (Vegetation Index)</CardTitle>
                                    <CardDescription>
                                        This value indicates the density and health of green vegetation. Higher is better.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-5xl font-bold text-center text-primary">
                                        {analysisResult.ndvi.toFixed(3)}
                                    </div>
                                    <p className="text-center text-muted-foreground mt-2">
                                        {analysisResult.ndvi > 0.6 ? "Excellent" : analysisResult.ndvi > 0.4 ? "Good" : "Moderate"} vegetation health.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}

                {!isLoading && !analysisResult && (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Satellite className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-lg">{t('resultsAppearHere')}</p>
                    <p className="text-muted-foreground/80">{t('enterCoordinatesToStart')}</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

