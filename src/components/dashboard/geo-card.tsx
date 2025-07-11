// src/components/dashboard/geo-card.tsx
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { Globe, Mountain, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export function GeoCard() {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg border-white/40 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Globe className="text-accent" />
          {t('geographicalConditions')}
        </CardTitle>
        <CardDescription>Key metrics about your farm's location</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('soilPh')}</span>
                <span className="font-semibold text-lg">6.8</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('elevation')}</span>
                <span className="font-semibold text-lg">250m</span>
            </div>
        </div>
        <div className="flex-grow" />
        <Button asChild variant="ghost" className="mt-4 self-end text-sm text-primary hover:text-primary/90">
          <Link href="/crop-suggestions">
            {t('getSuggestions')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
