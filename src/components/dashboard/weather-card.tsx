"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
    <Card className="shadow-lg border-white/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sun className="text-accent" />
          {t('weather')}
        </CardTitle>
        <CardDescription>{t('currentTemp')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="my-4" />
        <div className="flex justify-between text-center">
          {forecast.map(({ day, Icon, temp }) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{day}</span>
              <Icon className="h-6 w-6 text-foreground" />
              <span className="text-sm font-semibold">{temp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
