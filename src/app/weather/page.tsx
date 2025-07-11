
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudSun, CloudDrizzle, Sparkles, Loader2, MapPin, LocateFixed, CloudLightning, CloudSnow, SunMoon, Moon, CloudFog } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getAIFarmTip, getRealtimeWeather, type WeatherData } from './actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const conditionToIconMap: { [key: string]: React.ElementType } = {
  'Sunny': Sun,
  'Clear': Moon,
  'Partly cloudy': CloudSun,
  'Cloudy': Cloud,
  'Overcast': Cloud,
  'Mist': CloudFog,
  'Patchy rain possible': CloudDrizzle,
  'Patchy snow possible': CloudSnow,
  'Patchy sleet possible': CloudDrizzle,
  'Patchy freezing drizzle possible': CloudDrizzle,
  'Thundery outbreaks possible': CloudLightning,
  'Blowing snow': CloudSnow,
  'Blizzard': CloudSnow,
  'Fog': CloudFog,
  'Freezing fog': CloudFog,
  'Patchy light drizzle': CloudDrizzle,
  'Light drizzle': CloudDrizzle,
  'Freezing drizzle': CloudDrizzle,
  'Heavy freezing drizzle': CloudDrizzle,
  'Patchy light rain': CloudRain,
  'Light rain': CloudRain,
  'Moderate rain at times': CloudRain,
  'Moderate rain': CloudRain,
  'Heavy rain at times': CloudRain,
  'Heavy rain': CloudRain,
  'Light freezing rain': CloudRain,
  'Moderate or heavy freezing rain': CloudRain,
  'Light sleet': CloudDrizzle,
  'Moderate or heavy sleet': CloudDrizzle,
  'Patchy light snow': CloudSnow,
  'Light snow': CloudSnow,
  'Patchy moderate snow': CloudSnow,
  'Moderate snow': CloudSnow,
  'Patchy heavy snow': CloudSnow,
  'Heavy snow': CloudSnow,
  'Ice pellets': CloudSnow,
  'Light rain shower': CloudRain,
  'Moderate or heavy rain shower': CloudRain,
  'Torrential rain shower': CloudRain,
  'Light sleet showers': CloudDrizzle,
  'Moderate or heavy sleet showers': CloudDrizzle,
  'Light snow showers': CloudSnow,
  'Moderate or heavy snow showers': CloudSnow,
  'Light showers of ice pellets': CloudSnow,
  'Moderate or heavy showers of ice pellets': CloudSnow,
  'Patchy light rain with thunder': CloudLightning,
  'Moderate or heavy rain with thunder': CloudLightning,
  'Patchy light snow with thunder': CloudLightning,
  'Moderate or heavy snow with thunder': CloudLightning,
};

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
});

type FormValues = z.infer<typeof formSchema>;
type ForecastWithTip = WeatherData['forecast'][0] & { tip?: string };

export default function WeatherPage() {
  const { t, language } = useLanguage();
  const [currentWeather, setCurrentWeather] = useState<WeatherData['current'] | null>(null);
  const [forecastsWithTips, setForecastsWithTips] = useState<ForecastWithTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { location: "" },
  });

  const fetchWeather = async (loc: string) => {
    setIsLoading(true);
    setForecastsWithTips([]);
    setCurrentWeather(null);
    setLocation(loc);

    try {
      const weatherData = await getRealtimeWeather(loc);
      setCurrentWeather(weatherData.current);

      const tipsPromises = weatherData.forecast.map(day =>
        getAIFarmTip({
          condition: day.condition,
          tempHigh: day.high,
          tempLow: day.low,
          rainChance: day.rainChance,
          humidity: day.humidity,
          language: language,
        })
      );
      
      const tipsResults = await Promise.all(tipsPromises);
      const updatedForecasts = weatherData.forecast.map((day, index) => ({
        ...day,
        icon: conditionToIconMap[day.condition] || Sun,
        tip: tipsResults[index].tip,
      }));
      setForecastsWithTips(updatedForecasts);

    } catch (error) {
      console.error("Failed to fetch weather data or AI tips", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    await fetchWeather(values.location);
  }
  
  // Re-fetch tips when language changes
  useEffect(() => {
    if (location) {
      fetchWeather(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);


  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('weatherForecastTitle')}</h1>
        <p className="text-muted-foreground">{t('weatherForecastDescription')}</p>
      </div>

      <Card className="shadow-lg border-white/40">
        <CardHeader>
          <CardTitle className="font-headline">{t('farmLocation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder={t('farmLocationPlaceholder')} {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed />}
                <span>{t('getSuggestions')}</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {location && (
        <>
        <Card className="shadow-lg border-white/40">
            <CardHeader>
                <CardTitle className="font-headline">{t('currentConditions')} in <span className="text-primary">{location}</span></CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <Skeleton className="h-10 w-32 mx-auto" />
                  <Skeleton className="h-10 w-32 mx-auto" />
                  <Skeleton className="h-10 w-32 mx-auto" />
                </div>
              ) : currentWeather && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                    <Thermometer className="h-7 w-7 text-destructive" />
                    <div>
                        <p className="text-muted-foreground text-sm">{t('temperature')}</p>
                        <p className="font-bold text-lg">{currentWeather.temperature}°C</p>
                    </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                    <Droplets className="h-7 w-7 text-blue-500" />
                    <div>
                        <p className="text-muted-foreground text-sm">{t('humidity')}</p>
                        <p className="font-bold text-lg">{currentWeather.humidity}%</p>
                    </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                    <Wind className="h-7 w-7 text-gray-500" />
                    <div>
                        <p className="text-muted-foreground text-sm">{t('windSpeed')}</p>
                        <p className="font-bold text-lg">{currentWeather.windSpeed} kph</p>
                    </div>
                    </div>
                </div>
              )}
            </CardContent>
        </Card>
      
        <div>
            <h2 className="text-xl font-headline font-semibold mb-4">{t('sevenDayForecast')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
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
                ))
            ) : (
                forecastsWithTips.map((day) => (
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
                ))
            )}
            </div>
        </div>
        </>
      )}
      {!location && !isLoading && (
        <Card className="shadow-lg border-white/40 flex flex-col items-center justify-center text-center py-16">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">See Your Farm's Forecast</CardTitle>
                <CardContent>Enter a location above to get started.</CardContent>
            </CardHeader>
        </Card>
      )}
    </div>
  );
}
