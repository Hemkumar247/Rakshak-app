"use client";

import { useLanguage } from '@/lib/i18n';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { MarketCard } from '@/components/dashboard/market-card';
import { GeoCard } from '@/components/dashboard/geo-card';
import { GovernmentSchemesCard } from '@/components/dashboard/government-schemes-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
          {t('welcome')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('dashboardDescription')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <WeatherCard />
        <MarketCard />
        <GeoCard />
        <GovernmentSchemesCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardLink 
            href="/crop-suggestions" 
            title={t('cropSuggestions')}
            description="Get AI-powered recommendations for your farm."
        />
        <CardLink 
            href="/agronomic-tips"
            title={t('plantDiagnosis')}
            description="Upload a photo to diagnose plant diseases."
        />
      </div>
    </div>
  );
}

function CardLink({ href, title, description }: { href: string, title: string, description: string }) {
    return (
        <Link href={href} className="block group">
            <div className="bg-card/80 p-6 rounded-xl shadow-lg border border-transparent hover:border-primary transition-all duration-300 h-full">
                <h3 className="text-xl font-bold text-primary font-headline group-hover:text-accent transition-colors">{title}</h3>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>
        </Link>
    )
}
