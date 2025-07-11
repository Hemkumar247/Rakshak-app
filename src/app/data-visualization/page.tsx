"use client";

import { WeatherHistoryChart } from '@/components/charts/weather-history-chart';
import { SoilDataChart } from '@/components/charts/soil-data-chart';
import { MarketTrendsChart } from '@/components/charts/market-trends-chart';
import { useLanguage } from '@/lib/i18n';

export default function DataVisualizationPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('dataVisualizationTitle')}</h1>
        <p className="text-muted-foreground">{t('dataVisualizationDescription')}</p>
      </div>

      <div className="grid gap-8">
        <WeatherHistoryChart />
        <div className="grid md:grid-cols-2 gap-8">
            <SoilDataChart />
            <MarketTrendsChart />
        </div>
      </div>
    </div>
  );
}
