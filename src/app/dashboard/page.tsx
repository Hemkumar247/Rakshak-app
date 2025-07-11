"use client";

import { useLanguage } from '@/lib/i18n';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { MarketCard } from '@/components/dashboard/market-card';
import { GeoCard } from '@/components/dashboard/geo-card';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          {t('welcome')}
        </h1>
        <p className="text-muted-foreground">{t('dashboardDescription')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WeatherCard />
        <MarketCard />
        <GeoCard />
      </div>
    </div>
  );
}
