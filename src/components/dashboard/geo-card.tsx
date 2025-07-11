"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { Globe, Mountain } from 'lucide-react';

export function GeoCard() {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg border-white/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Globe className="text-accent" />
          {t('geographicalConditions')}
        </CardTitle>
        <CardDescription>Key metrics about your farm's location</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
