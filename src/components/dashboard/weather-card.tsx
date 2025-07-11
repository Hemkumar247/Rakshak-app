// src/components/dashboard/weather-card.tsx
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { Sun, Cloud, CloudRain, Wind, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';

const forecast = [
  { day: 'Mon', Icon: Sun, temp: '29°C' },
  { day: 'Tue', Icon: Cloud, temp: '27°C' },
  { day: 'Wed', Icon: CloudRain, temp: '25°C' },
  { day: 'Thu', Icon: Sun, temp: '30°C' },
  { day: 'Fri', Icon: Wind, temp: '28°C' },
];

export function WeatherCard() {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg border-white/40 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sun className="text-accent" />
          {t('weather')}
        </CardTitle>
        <CardDescription>Sample 5-day forecast</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="text-4xl font-bold text-center py-2">22°C</div>
        <Separator className="my-2" />
        <div className="flex justify-between text-center">
          {forecast.map(({ day, Icon, temp }) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{day}</span>
              <Icon className="h-6 w-6 text-foreground" />
              <span className="text-sm font-semibold">{temp}</span>
            </div>
          ))}
        </div>
        <div className="flex-grow" />
        <Button asChild variant="ghost" className="mt-4 self-end text-sm text-primary hover:text-primary/90">
          <Link href="/weather">
            {t('learnMore')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
