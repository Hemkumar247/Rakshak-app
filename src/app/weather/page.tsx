"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, Eye, Sun, Cloud, CloudRain, CloudSun, CloudDrizzle, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAIFarmTip } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for the 7-day forecast
const dailyForecasts = [
  { day: 'Today', condition: 'Partly Cloudy', high: 24, low: 14, humidity: 65, rainChance: 0, icon: CloudSun },
  { day: 'Tomorrow', condition: 'Scattered Showers', high: 26, low: 17, humidity: 70, rainChance: 20, icon: CloudDrizzle },
  { day: 'Wednesday', condition: 'Rain', high: 23, low: 13, humidity: 80, rainChance: 60, icon: CloudRain },
  { day: 'Thursday', condition: 'Cloudy', high: 21, low: 11, humidity: 75, rainChance: 10, icon: Cloud },
  { day: 'Friday', condition: 'Sunny', high: 24, low: 13, humidity: 60, rainChance: 0, icon: Sun },
  { day: 'Saturday', condition: 'Sunny', high: 27, low: 13, humidity: 55, rainChance: 0, icon: Sun },
  { day: 'Sunday', condition: 'Partly Cloudy', high: 28, low: 16, humidity: 60, rainChance: 5, icon: CloudSun },
];

const currentConditions = {
  temperature: 22,
  humidity: 65,
  windSpeed: 8,
  visibility: 10,
};

type ForecastWithTip = typeof dailyForecasts[0] & { tip?: string };

export default function WeatherPage() {
  const { t, language } = useLanguage();
  const [forecastsWithTips, setForecastsWithTips] = useState<ForecastWithTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      const tipsPromises = dailyForecasts.map(day => 
        getAIFarmTip({
          condition: day.condition,
          tempHigh: day.high,
          tempLow: day.low,
          rainChance: day.rainChance,
          humidity: day.humidity,
          language: language,
        })
      );
      
      try {
        const tipsResults = await Promise.all(tipsPromises);
        const updatedForecasts = dailyForecasts.map((day, index) => ({
          ...day,
          tip: tipsResults[index].tip,
        }));
        setForecastsWithTips(updatedForecasts);
      } catch (error) {
        console.error("Failed to fetch AI tips", error);
        // Set forecasts without tips if AI fails
        setForecastsWithTips(dailyForecasts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, [language]);


  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('weatherForecastTitle')}</h1>
        <p className="text-muted-foreground">{t('weatherForecastDescription')}</p>
      </div>

      <Card className="shadow-lg border-white/40">
        <CardContent className="p-6">
          <h2 className="text-xl font-headline font-semibold mb-4">{t('currentConditions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Thermometer className="h-7 w-7 text-destructive" />
              <div>
                <p className="text-muted-foreground text-sm">{t('temperature')}</p>
                <p className="font-bold text-lg">{currentConditions.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Droplets className="h-7 w-7 text-blue-500" />
              <div>
                <p className="text-muted-foreground text-sm">{t('humidity')}</p>
                <p className="font-bold text-lg">{currentConditions.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Wind className="h-7 w-7 text-gray-500" />
              <div>
                <p className="text-muted-foreground text-sm">{t('windSpeed')}</p>
                <p className="font-bold text-lg">{currentConditions.windSpeed} mph</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Eye className="h-7 w-7 text-purple-500" />
              <div>
                <p className="text-muted-foreground text-sm">{t('visibility')}</p>
                <p className="font-bold text-lg">{currentConditions.visibility} mi</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-headline font-semibold mb-4">{t('sevenDayForecast')}</h2>
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Card key={i} className="shadow-lg border-white/40 p-4 space-y-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Separator />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Separator />
                         <div className="flex items-center gap-2">
                             <Loader2 className="h-4 w-4 animate-spin text-primary"/>
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {forecastsWithTips.map((day) => (
                <Card key={day.day} className="shadow-lg border-white/40 p-4 flex flex-col">
                <div>
                    <h3 className="font-bold font-headline">{day.day}</h3>
                    <p className="text-sm text-muted-foreground">{day.condition}</p>
                </div>
                <div className="my-3 flex justify-between items-center">
                    <day.icon className="h-10 w-10 text-accent" />
                    <p className="text-2xl font-bold">{day.high}°<span className="text-muted-foreground">/{day.low}°</span></p>
                </div>
                <Separator />
                <div className="text-sm space-y-2 mt-3">
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('humidity')}</span>
                    <span className="font-semibold">{day.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('rainChance')}</span>
                    <span className="font-semibold">{day.rainChance}%</span>
                    </div>
                </div>
                <div className="flex-grow"/>
                <Separator className="my-3" />
                <Alert className="mt-auto bg-primary/10 border-primary/30 text-primary-dark">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-primary/90 font-medium">
                    {day.tip || 'Plan your activities accordingly.'}
                    </AlertDescription>
                </Alert>
                </Card>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
